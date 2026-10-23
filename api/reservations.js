import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const body = req.body || {};
  const required = ["vehicle_id", "customer_name", "customer_email", "customer_phone", "pickup_location", "return_location", "pickup_at", "return_at"];
  for (const key of required) {
    if (typeof body[key] !== "string" || !body[key].trim()) {
      return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customer_email)) {
    return res.status(400).json({ error: "Veuillez saisir une adresse e-mail valide." });
  }
  const pickup = new Date(body.pickup_at);
  const returned = new Date(body.return_at);
  if (!Number.isFinite(pickup.getTime()) || !Number.isFinite(returned.getTime()) || returned <= pickup) {
    return res.status(400).json({ error: "La date de retour doit être après la date de départ." });
  }
  const { rows: cars } = await db.query(
    "SELECT id, daily_price FROM vehicles WHERE id = $1 AND active = TRUE",
    [body.vehicle_id]
  );
  if (!cars.length) return res.status(404).json({ error: "Ce véhicule n'est plus disponible." });

  const { rows: conflicts } = await db.query(
    "SELECT id FROM reservations WHERE vehicle_id = $1 AND status IN ('Pending', 'Confirmed', 'In progress') AND pickup_at < $3 AND return_at > $2 LIMIT 1",
    [body.vehicle_id, pickup.toISOString(), returned.toISOString()]
  );
  if (conflicts.length) {
    return res.status(409).json({ error: "Ce véhicule a déjà une demande sur cette période. Veuillez choisir d'autres dates ou un autre véhicule." });
  }

  const days = Math.max(1, Math.ceil((returned.getTime() - pickup.getTime()) / 86400000));
  const total = Number(cars[0].daily_price) * days;
  const reference = "CM-" + crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  const { rows } = await db.query(
    "INSERT INTO reservations (booking_reference, vehicle_id, customer_name, customer_email, customer_phone, pickup_location, return_location, pickup_at, return_at, total_price) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING booking_reference, total_price, status",
    [reference, body.vehicle_id, body.customer_name.trim().slice(0,120), body.customer_email.trim().toLowerCase().slice(0,200), body.customer_phone.trim().slice(0,40), body.pickup_location.trim().slice(0,120), body.return_location.trim().slice(0,120), pickup.toISOString(), returned.toISOString(), total]
  );
  res.status(201).json({ reservation: rows[0], message: "Votre demande a bien été enregistrée. L'agence doit confirmer la réservation." });
}