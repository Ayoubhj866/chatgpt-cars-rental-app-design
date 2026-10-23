(() => {
  const API = window.__HATCHABLE__?.api || "/api";
  const grid = document.getElementById("vehicle-grid");
  const errorBox = document.getElementById("vehicle-error");
  const categoryFilter = document.getElementById("filter-category");
  const sortSelect = document.getElementById("sort-price");
  const modal = document.getElementById("booking-modal");
  const bookingForm = document.getElementById("booking-form");
  const message = document.getElementById("booking-message");
  let vehicles = [];

  document.getElementById("year").textContent = new Date().getFullYear();
  const today = new Date();
  const isoLocal = (d) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };
  const pickupSearch = document.getElementById("search-pickup");
  const returnSearch = document.getElementById("search-return");
  pickupSearch.min = isoLocal(today);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  pickupSearch.value = isoLocal(tomorrow);
  const dayAfter = new Date(tomorrow); dayAfter.setDate(dayAfter.getDate() + 2);
  returnSearch.min = pickupSearch.value;
  returnSearch.value = isoLocal(dayAfter).slice(0, 10);
  pickupSearch.addEventListener("change", () => {
    returnSearch.min = pickupSearch.value;
    if (returnSearch.value <= pickupSearch.value) {
      const next = new Date(pickupSearch.value + "T12:00:00");
      next.setDate(next.getDate() + 1);
      returnSearch.value = isoLocal(next).slice(0, 10);
    }
  });
  document.querySelector("#reservation form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!pickupSearch.value || !returnSearch.value || returnSearch.value <= pickupSearch.value) {
      alert("Veuillez sélectionner une date de retour après la date de départ.");
      return;
    }
    categoryFilter.value = document.getElementById("search-category").value;
    renderVehicles();
    document.getElementById("vehicules").scrollIntoView({behavior:"smooth"});
  });

  const money = (n) => new Intl.NumberFormat("fr-MA", {style:"currency",currency:"MAD",maximumFractionDigits:0}).format(Number(n));
  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fallbackPhoto = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";

  function renderVehicles() {
    let list = vehicles.filter(v => !categoryFilter.value || v.category === categoryFilter.value);
    list.sort((a,b) => sortSelect.value === "desc" ? Number(b.daily_price)-Number(a.daily_price) : Number(a.daily_price)-Number(b.daily_price));
    if (!list.length) {
      grid.innerHTML = '<div class="sm:col-span-2 xl:col-span-3 bg-slate-50 rounded-2xl p-10 text-center"><h3 class="font-bold text-lg">Aucun véhicule dans cette catégorie</h3><p class="text-slate-500 mt-2">Essayez une autre catégorie.</p></div>';
      return;
    }
    grid.innerHTML = list.map(v => `
      <article class="car-card">
        <div class="relative h-56 bg-slate-100"><img src="${escapeHtml(v.image_url || fallbackPhoto)}" alt="${escapeHtml(v.make)} ${escapeHtml(v.model)}" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='${fallbackPhoto}'"><span class="absolute top-4 left-4 pill">${escapeHtml(v.category)}</span><span class="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700">Exemple</span></div>
        <div class="p-5"><div class="flex justify-between gap-3 items-start"><div><h3 class="font-bold text-xl">${escapeHtml(v.make)} ${escapeHtml(v.model)}</h3><p class="text-slate-500 text-sm mt-1">${escapeHtml(v.city || "Maroc")}</p></div><div class="text-right shrink-0"><strong class="text-lg" style="color:var(--brand)">${money(v.daily_price)}</strong><p class="text-xs text-slate-500">/ jour · indicatif</p></div></div>
        <div class="grid grid-cols-3 gap-2 border-y border-slate-100 py-4 my-4 text-xs text-slate-600"><span>⚙ ${escapeHtml(v.transmission)}</span><span>⛽ ${escapeHtml(v.fuel)}</span><span>♙ ${escapeHtml(v.seats)} places</span></div>
        <div class="flex gap-3"><button class="btn-secondary rounded-xl py-3 px-4 flex-1 text-sm" data-details="${escapeHtml(v.id)}">Détails</button><button class="btn-primary rounded-xl py-3 px-4 flex-1 text-sm" data-book="${escapeHtml(v.id)}">Réserver →</button></div></div>
      </article>`).join("");
  }
  categoryFilter.addEventListener("change", renderVehicles);
  sortSelect.addEventListener("change", renderVehicles);
  document.getElementById("search-city").addEventListener("change", () => {
    // A location is carried into the booking form when the customer opens it.
  });
  grid.addEventListener("click", (event) => {
    const book = event.target.closest("[data-book]");
    const details = event.target.closest("[data-details]");
    const id = book?.dataset.book || details?.dataset.details;
    if (!id) return;
    const car = vehicles.find(v => v.id === id);
    if (!car) return;
    if (details) {
      alert(`${car.make} ${car.model}\nCatégorie : ${car.category}\nBoîte : ${car.transmission}\nCarburant : ${car.fuel}\nPlaces : ${car.seats}\nTarif indicatif : ${money(car.daily_price)} / jour\n\nLes informations et disponibilités sont à confirmer par l'agence.`);
      return;
    }
    document.getElementById("book-vehicle-id").value = car.id;
    document.getElementById("modal-title").textContent = `Demander ${car.make} ${car.model}`;
    document.getElementById("modal-price").textContent = `Tarif de démonstration : ${money(car.daily_price)} / jour · prix final à confirmer.`;
    document.getElementById("booking-message").textContent = "";
    const city = document.getElementById("search-city").value;
    bookingForm.elements.pickup_location.value = city === "Autre" ? "À convenir" : city;
    const searchStart = pickupSearch.value ? pickupSearch.value + "T10:00" : "";
    const searchEnd = returnSearch.value ? returnSearch.value + "T10:00" : "";
    bookingForm.elements.pickup_at.value = searchStart;
    bookingForm.elements.return_at.value = searchEnd;
    modal.classList.remove("hidden"); modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  });
  const closeModal = () => { modal.classList.add("hidden"); modal.classList.remove("flex"); document.body.style.overflow = ""; };
  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = document.getElementById("booking-submit");
    const formData = new FormData(bookingForm);
    const body = Object.fromEntries(formData.entries());
    if (new Date(body.return_at) <= new Date(body.pickup_at)) {
      message.className = "text-sm mb-3 text-rose-600";
      message.textContent = "La date de retour doit être après la date de départ.";
      return;
    }
    submit.disabled = true; submit.textContent = "Envoi en cours…";
    message.className = "text-sm mb-3 text-slate-500"; message.textContent = "";
    try {
      const response = await fetch(API + "/reservations", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Impossible d'envoyer la demande. Veuillez réessayer.");
      message.className = "sm:col-span-2 rounded-xl bg-emerald-50 text-emerald-800 p-4 text-sm mb-3";
      message.textContent = `Demande enregistrée ! Référence : ${result.reservation.booking_reference}. Le statut est « en attente » ; l'agence doit confirmer la disponibilité et le prix final.`;
      bookingForm.reset();
      submit.classList.add("hidden");
    } catch (err) {
      message.className = "text-sm mb-3 text-rose-600";
      message.textContent = err.message || "Une erreur est survenue.";
    } finally {
      submit.disabled = false;
      if (!submit.classList.contains("hidden")) submit.textContent = "Envoyer ma demande";
    }
  });

  fetch(API + "/vehicles")
    .then(r => { if (!r.ok) throw new Error("Catalog unavailable"); return r.json(); })
    .then(data => { vehicles = Array.isArray(data.vehicles) ? data.vehicles : []; renderVehicles(); })
    .catch(() => { grid.innerHTML = ""; errorBox.classList.remove("hidden"); });
})();