INSERT INTO vehicles (make, model, category, transmission, fuel, seats, luggage, daily_price, image_url, city)
SELECT 'Dacia', 'Sandero', 'Citadine', 'Manuelle', 'Essence', 5, 2, 250, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80', 'Casablanca'
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE make = 'Dacia' AND model = 'Sandero');
INSERT INTO vehicles (make, model, category, transmission, fuel, seats, luggage, daily_price, image_url, city)
SELECT 'Renault', 'Clio', 'Citadine', 'Manuelle', 'Essence', 5, 2, 300, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80', 'Rabat'
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE make = 'Renault' AND model = 'Clio');
INSERT INTO vehicles (make, model, category, transmission, fuel, seats, luggage, daily_price, image_url, city)
SELECT 'Hyundai', 'Tucson', 'SUV', 'Automatique', 'Diesel', 5, 4, 650, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80', 'Marrakech'
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE make = 'Hyundai' AND model = 'Tucson');
INSERT INTO vehicles (make, model, category, transmission, fuel, seats, luggage, daily_price, image_url, city)
SELECT 'Peugeot', '508', 'Berline', 'Automatique', 'Diesel', 5, 3, 550, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80', 'Tanger'
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE make = 'Peugeot' AND model = '508');
INSERT INTO vehicles (make, model, category, transmission, fuel, seats, luggage, daily_price, image_url, city)
SELECT 'Dacia', 'Jogger', 'Familiale', 'Manuelle', 'Essence', 7, 4, 420, 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80', 'Agadir'
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE make = 'Dacia' AND model = 'Jogger');
INSERT INTO vehicles (make, model, category, transmission, fuel, seats, luggage, daily_price, image_url, city)
SELECT 'Toyota', 'Corolla', 'Berline', 'Automatique', 'Hybride', 5, 3, 480, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80', 'Fès'
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE make = 'Toyota' AND model = 'Corolla');