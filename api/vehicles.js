import { db } from "hatchable";

export const access = "public";
export const methods = ["GET"];

export default async function (req, res) {
  const { rows } = await db.query(
    "SELECT id, make, model, category, transmission, fuel, seats, luggage, daily_price, image_url, city FROM vehicles WHERE active = TRUE ORDER BY daily_price ASC"
  );
  res.json({ vehicles: rows, demo_notice: "Tarifs et véhicules de démonstration à confirmer auprès de l'agence." });
}