-- ============================================================
-- QuickBasket Seed Data
-- Run this after the app creates tables (ddl-auto=update)
-- Usage: mysql -u root -proot dmart < seed.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============ CATEGORIES ============
TRUNCATE TABLE `categories`;
INSERT INTO `categories` (id, name, description, image_url) VALUES
(1, 'Electronics', 'Cutting-edge devices and digital gadgets including smartphones, laptops, and accessories.', NULL),
(2, 'Fashion', 'Latest trends in apparel, footwear, and fashion accessories for men and women.', NULL),
(3, 'Home & Kitchen', 'Essentials and decor for modern homes — cookware, furniture, and home improvement tools.', NULL),
(4, 'Sports & Fitness', 'Equipment, apparel, and accessories to support an active lifestyle and training needs.', NULL),
(5, 'Books', 'Wide range of literature — from fiction and self-help to academic and professional reads.', NULL),
(6, 'Beauty & Personal Care', 'Cosmetics, skincare, haircare, and personal hygiene essentials for every routine.', NULL),
(7, 'Toys & Games', 'Engaging toys, board games, and learning kits for kids and families.', NULL),
(8, 'Automotive', 'Car and bike accessories, maintenance products, and performance upgrades.', NULL),
(9, 'Health & Wellness', 'Supplements, healthcare devices, and wellness products for holistic living.', NULL),
(10, 'Pet Supplies', 'Food, toys, and grooming products for pets — keeping your companions happy and healthy.', NULL),
(11, 'Fruits & Vegetables', 'Fresh fruits, leafy vegetables, organic produce.', NULL),
(12, 'Dairy & Eggs', 'Milk, cheese, yogurt, eggs, butter, and paneer.', NULL),
(13, 'Beverages', 'Juices, soft drinks, tea, coffee, energy drinks.', NULL),
(14, 'Snacks & Bakery', 'Chips, biscuits, cookies, cakes, bakery items.', NULL),
(15, 'Staples & Grains', 'Rice, wheat flour, pulses, lentils, spices.', NULL),
(16, 'Frozen & Ready-to-Eat', 'Frozen foods, ready meals, frozen snacks.', NULL),
(17, 'Meat & Seafood', 'Fresh meat, fish, and seafood products.', NULL),
(18, 'Personal Care', 'Soap, shampoo, toothpaste, hygiene products.', NULL),
(19, 'Household Essentials', 'Cleaning supplies, detergents, kitchen essentials.', NULL),
(20, 'Baby & Kids', 'Baby food, diapers, wipes, formula, kids snacks.', NULL);

-- ============ PRODUCTS ============
TRUNCATE TABLE `product_images`;
TRUNCATE TABLE `products`;

INSERT INTO `products` (id, created_at, description, name, price, stock_quantity, updated_at, category_id) VALUES
-- Sports & Fitness (category 4)
(1, NOW(), 'Non-slip yoga mat for all levels.', 'Yoga Mat Pro', 29.99, 150, NOW(), 4),
(2, NOW(), 'Foldable treadmill with speed control.', 'Treadmill Runner 3000', 899, 20, NOW(), 4),
(3, NOW(), 'Adjustable dumbbell set for home workouts.', 'Dumbbell Set 20kg', 79.99, 100, NOW(), 4),
(4, NOW(), 'Heart rate and activity tracker.', 'Fitness Tracker Band', 59.99, 200, NOW(), 4),
(5, NOW(), 'Set of 5 resistance bands for strength training.', 'Resistance Bands Kit', 24.99, 300, NOW(), 4),
(6, NOW(), 'FIBA-approved outdoor basketball.', 'Basketball Official', 39.99, 120, NOW(), 4),
(7, NOW(), 'Durable ball for training and matches.', 'Soccer Ball Pro', 29.99, 150, NOW(), 4),
(8, NOW(), 'Lightweight helmet with ventilation.', 'Cycling Helmet', 49.99, 180, NOW(), 4),
(9, NOW(), 'Adjustable jump rope for cardio workouts.', 'Jump Rope Speed', 14.99, 250, NOW(), 4),
(10, NOW(), 'Stationary bike with LCD monitor.', 'Exercise Bike X100', 399, 35, NOW(), 4),

-- Books (category 5)
(11, NOW(), 'Bestselling fiction novel.', 'The Great Novel', 19.99, 200, NOW(), 5),
(12, NOW(), 'Comprehensive Java programming guide.', 'Learn Java in 24 Hours', 39.99, 150, NOW(), 5),
(13, NOW(), 'Illustrated book on global art history.', 'History of Art', 49.99, 100, NOW(), 5),
(14, NOW(), 'Tips for personal growth and success.', 'Self-Improvement Handbook', 24.99, 180, NOW(), 5),
(15, NOW(), 'Detailed reference for all scientific fields.', 'Science Encyclopedia', 99, 50, NOW(), 5),
(16, NOW(), 'Delicious recipes for home chefs.', 'Cookbook Gourmet', 29.99, 120, NOW(), 5),
(17, NOW(), 'Illustrated stories for kids 5-10 years.', 'Children Story Book', 14.99, 250, NOW(), 5),
(18, NOW(), 'Suspenseful novel with plot twists.', 'Mystery Thriller', 19.99, 200, NOW(), 5),
(19, NOW(), 'Insights into corporate management.', 'Business Strategy Guide', 59.99, 80, NOW(), 5),
(20, NOW(), 'Learn photography techniques and composition.', 'Photography Basics', 34.99, 90, NOW(), 5),

-- Beauty & Personal Care (category 6)
(21, NOW(), 'Gentle daily cleanser for all skin types.', 'Facial Cleanser', 19.99, 200, NOW(), 6),
(22, NOW(), 'Hydrating cream with natural ingredients.', 'Moisturizing Cream', 29.99, 180, NOW(), 6),
(23, NOW(), 'Nourishing hair care duo.', 'Shampoo & Conditioner Set', 24.99, 150, NOW(), 6),
(24, NOW(), 'Long-lasting fragrance for women.', 'Perfume Eau de Parfum', 49.99, 100, NOW(), 6),
(25, NOW(), 'Complete cosmetics kit for all occasions.', 'Makeup Kit Deluxe', 69.99, 80, NOW(), 6),
(26, NOW(), 'High protection for sensitive skin.', 'Sunscreen SPF50', 19.99, 250, NOW(), 6),
(27, NOW(), 'Rich color lipstick with smooth finish.', 'Lipstick Matte', 14.99, 200, NOW(), 6),
(28, NOW(), 'Fast-drying hair tool with multiple heat settings.', 'Hair Dryer Pro', 59.99, 60, NOW(), 6),
(29, NOW(), 'Daily moisturizing lotion for smooth skin.', 'Body Lotion Nourish', 22.99, 120, NOW(), 6),
(30, NOW(), 'Brightening serum for healthy skin.', 'Face Serum Vitamin C', 39.99, 90, NOW(), 6),

-- Toys & Games (category 7)
(31, NOW(), 'Creative blocks for children ages 3-10.', 'Building Blocks Set', 29.99, 150, NOW(), 7),
(32, NOW(), 'Challenging jigsaw puzzle.', 'Puzzle 500 Pieces', 19.99, 200, NOW(), 7),
(33, NOW(), 'Fast RC car with rechargeable battery.', 'Remote Control Car', 49.99, 100, NOW(), 7),
(34, NOW(), 'Classic board game for family fun.', 'Board Game Strategy', 39.99, 120, NOW(), 7),
(35, NOW(), 'Miniature house with furniture.', 'Dollhouse Mini', 59.99, 80, NOW(), 7),
(36, NOW(), 'Soft plush toy for toddlers.', 'Stuffed Animal Bear', 24.99, 200, NOW(), 7),
(37, NOW(), 'Creative kit for kids to make art projects.', 'Art & Craft Kit', 29.99, 150, NOW(), 7),
(38, NOW(), 'Interactive learning tablet for children.', 'Educational Tablet', 99.99, 50, NOW(), 7),
(39, NOW(), 'Mini sports gear for kids.', 'Sports Toy Set', 34.99, 100, NOW(), 7),
(40, NOW(), 'Learn fun magic tricks.', 'Magic Trick Kit', 19.99, 180, NOW(), 7),

-- Automotive (category 8)
(41, NOW(), 'Portable vacuum cleaner for vehicles.', 'Car Vacuum Cleaner', 59.99, 80, NOW(), 8),
(42, NOW(), 'Full HD dashcam with night vision.', 'Dashboard Camera', 129.99, 60, NOW(), 8),
(43, NOW(), 'Leather seat covers for comfort.', 'Car Seat Cover', 89.99, 120, NOW(), 8),
(44, NOW(), 'Reliable GPS for cars and trucks.', 'GPS Navigation Device', 149.99, 50, NOW(), 8),
(45, NOW(), 'Set of 4 alloy wheels.', 'Alloy Wheel Set', 499, 20, NOW(), 8),
(46, NOW(), 'Synthetic motor oil for all vehicles.', 'Motor Oil 5L', 39.99, 150, NOW(), 8),
(47, NOW(), 'Compact electric tire inflator.', 'Tire Inflator Pump', 29.99, 200, NOW(), 8),
(48, NOW(), 'Premium leather cover.', 'Steering Wheel Cover', 19.99, 250, NOW(), 8),
(49, NOW(), 'Fast charger for car batteries.', 'Car Battery Charger', 69.99, 40, NOW(), 8),
(50, NOW(), 'Durable roof rack for SUVs.', 'Roof Rack Carrier', 199.99, 30, NOW(), 8),

-- Health & Wellness (category 9)
(51, NOW(), 'Immune-boosting dietary supplement.', 'Vitamin C Tablets', 14.99, 200, NOW(), 9),
(52, NOW(), 'Stability ball for workouts.', 'Yoga Ball', 29.99, 150, NOW(), 9),
(53, NOW(), 'Deep tissue massage for muscles.', 'Massage Gun', 99.99, 50, NOW(), 9),
(54, NOW(), 'High-protein supplement.', 'Protein Powder Whey', 49.99, 120, NOW(), 9),
(55, NOW(), 'Selection of organic teas.', 'Herbal Tea Set', 24.99, 100, NOW(), 9),
(56, NOW(), 'Aromatic oils for wellness.', 'Essential Oils Kit', 39.99, 80, NOW(), 9),
(57, NOW(), 'Protective mat for treadmill.', 'Treadmill Mat', 19.99, 90, NOW(), 9),
(58, NOW(), 'Comfortable cushion for meditation.', 'Meditation Cushion', 34.99, 150, NOW(), 9),
(59, NOW(), 'Advanced tracker with multiple sensors.', 'Fitness Tracker Pro', 79.99, 60, NOW(), 9),
(60, NOW(), 'Digital monitor for home use.', 'Blood Pressure Monitor', 59.99, 70, NOW(), 9),

-- Pet Supplies (category 10)
(61, NOW(), 'High-quality dog food for all breeds.', 'Dog Food Premium', 49.99, 120, NOW(), 10),
(62, NOW(), 'Absorbent litter for indoor cats.', 'Cat Litter Clumping', 24.99, 200, NOW(), 10),
(63, NOW(), 'Durable chew toy for dogs.', 'Pet Toy Chew', 14.99, 180, NOW(), 10),
(64, NOW(), 'Complete kit for beginners.', 'Aquarium Starter Kit', 79.99, 60, NOW(), 10),
(65, NOW(), 'Comfortable bed for dogs and cats.', 'Pet Bed Deluxe', 59.99, 90, NOW(), 10),
(66, NOW(), 'Multi-level activity tree for cats.', 'Cat Tree Scratcher', 129.99, 50, NOW(), 10),
(67, NOW(), 'Strong leash with comfortable handle.', 'Dog Leash Adjustable', 19.99, 150, NOW(), 10),
(68, NOW(), 'All-in-one grooming set.', 'Pet Grooming Kit', 39.99, 80, NOW(), 10),
(69, NOW(), 'Spacious cage for small birds.', 'Bird Cage Medium', 49.99, 40, NOW(), 10),
(70, NOW(), 'Nutritious flakes for aquarium fish.', 'Fish Food Premium', 9.99, 250, NOW(), 10),

-- Fruits & Vegetables (category 11)
(71, NOW(), 'Fresh red apples, pack of 1kg.', 'Apple - Red Delicious', 150, 100, NOW(), 11),
(72, NOW(), 'Fresh bananas, pack of 1 dozen.', 'Banana - Cavendish', 60, 150, NOW(), 11),
(73, NOW(), 'Organic tomatoes, 500g.', 'Tomato - Organic', 40, 200, NOW(), 11),
(74, NOW(), 'Fresh potatoes, 1kg.', 'Potato - Regular', 30, 180, NOW(), 11),
(75, NOW(), 'Organic carrots, 500g.', 'Carrot - Organic', 50, 120, NOW(), 11),
(76, NOW(), 'Fresh red onions, 1kg.', 'Onion - Red', 45, 150, NOW(), 11),
(77, NOW(), 'Farm fresh cucumbers, 500g.', 'Cucumber - Fresh', 35, 130, NOW(), 11),
(78, NOW(), 'Premium Alphonso mangoes, 1kg.', 'Mango - Alphonso', 300, 50, NOW(), 11),
(79, NOW(), 'Organic spinach leaves, 250g.', 'Spinach - Organic', 25, 100, NOW(), 11),
(80, NOW(), 'Fresh green capsicum, 500g.', 'Capsicum - Green', 55, 120, NOW(), 11),

-- Dairy & Eggs (category 12)
(81, NOW(), '1L full cream milk.', 'Milk - Full Cream', 55, 200, NOW(), 12),
(82, NOW(), '200g cheddar cheese block.', 'Cheese - Cheddar', 120, 150, NOW(), 12),
(83, NOW(), '500g fresh paneer.', 'Paneer - Fresh', 150, 100, NOW(), 12),
(84, NOW(), '500g natural yogurt.', 'Yogurt - Plain', 60, 180, NOW(), 12),
(85, NOW(), 'Pack of 12 eggs.', 'Eggs - Brown', 70, 200, NOW(), 12),
(86, NOW(), '200g salted butter.', 'Butter - Salted', 90, 100, NOW(), 12),
(87, NOW(), '500g fresh curd.', 'Curd - Homemade', 50, 150, NOW(), 12),
(88, NOW(), '1L toned milk.', 'Milk - Toned', 50, 180, NOW(), 12),
(89, NOW(), '100g cheese spread for sandwiches.', 'Cheese Spread', 45, 130, NOW(), 12),
(90, NOW(), '500ml pure ghee.', 'Ghee - Pure', 250, 70, NOW(), 12),

-- Beverages (category 13)
(91, NOW(), '250g premium Assam tea leaves.', 'Tea - Assam', 150, 120, NOW(), 13),
(92, NOW(), '100g instant coffee jar.', 'Coffee - Instant', 200, 100, NOW(), 13),
(93, NOW(), '1L fresh orange juice.', 'Orange Juice', 120, 150, NOW(), 13),
(94, NOW(), '500ml cola beverage.', 'Cola Drink', 40, 200, NOW(), 13),
(95, NOW(), '25 tea bags.', 'Green Tea - Organic', 180, 100, NOW(), 13),
(96, NOW(), '250ml energy drink.', 'Energy Drink - Red', 80, 120, NOW(), 13),
(97, NOW(), '1L 100% apple juice.', 'Apple Juice', 130, 100, NOW(), 13),
(98, NOW(), 'Ready-to-drink cold coffee, 200ml.', 'Cold Coffee', 50, 150, NOW(), 13),
(99, NOW(), 'Pack of 6 bottles.', 'Mineral Water 1L', 60, 200, NOW(), 13),
(100, NOW(), '20 tea bags with herbs.', 'Herbal Tea', 160, 80, NOW(), 13),

-- Snacks & Bakery (category 14)
(101, NOW(), 'Pack of 12 Oreo biscuits.', 'Oreo Biscuits', 40, 150, NOW(), 14),
(102, NOW(), 'Pack of 150g potato chips.', 'Lays Chips - Classic', 30, 200, NOW(), 14),
(103, NOW(), '200g assorted Indian snacks.', 'Haldiram Namkeen', 60, 100, NOW(), 14),
(104, NOW(), '500g loaf of whole wheat bread.', 'Bread - Whole Wheat', 35, 180, NOW(), 14),
(105, NOW(), '500g chocolate sponge cake.', 'Cake - Chocolate', 250, 50, NOW(), 14),
(106, NOW(), 'Pack of 12 butter cookies.', 'Cookies - Butter', 45, 150, NOW(), 14),
(107, NOW(), '200g spicy savory mixture.', 'Namkeen Mixture', 55, 100, NOW(), 14),
(108, NOW(), 'Pack of 6 ready-to-bake puffs.', 'Puff Pastry', 80, 120, NOW(), 14),
(109, NOW(), '250g crispy rusk.', 'Rusk - Classic', 40, 150, NOW(), 14),
(110, NOW(), 'Chocolate brownie, 200g.', 'Brownie Pack', 120, 80, NOW(), 14),

-- Staples & Grains (category 15)
(111, NOW(), '5kg premium basmati rice.', 'Rice - Basmati', 450, 100, NOW(), 15),
(112, NOW(), '10kg whole wheat flour.', 'Wheat Flour - Atta', 400, 120, NOW(), 15),
(113, NOW(), '1kg split pigeon peas.', 'Pulses - Toor Dal', 120, 150, NOW(), 15),
(114, NOW(), '1kg yellow lentils.', 'Moong Dal', 130, 100, NOW(), 15),
(115, NOW(), '1kg split chickpeas.', 'Chana Dal', 110, 120, NOW(), 15),
(116, NOW(), '1kg iodized salt.', 'Salt - Iodized', 25, 200, NOW(), 15),
(117, NOW(), '1kg refined sugar.', 'Sugar - White', 50, 180, NOW(), 15),
(118, NOW(), '100g organic turmeric powder.', 'Turmeric Powder', 60, 150, NOW(), 15),
(119, NOW(), '100g ground red chili.', 'Red Chilli Powder', 55, 130, NOW(), 15),
(120, NOW(), '1L sunflower oil.', 'Cooking Oil - Sunflower', 120, 100, NOW(), 15),

-- Frozen & Ready-to-Eat (category 16)
(121, NOW(), '500g frozen green peas.', 'Frozen Peas', 80, 150, NOW(), 16),
(122, NOW(), '500g sweet corn kernels.', 'Frozen Corn', 90, 120, NOW(), 16),
(123, NOW(), '400g ready-to-bake pizza.', 'Veggie Pizza', 250, 80, NOW(), 16),
(124, NOW(), '250g frozen chicken nuggets.', 'Chicken Nuggets', 200, 100, NOW(), 16),
(125, NOW(), 'Pack of 5 whole wheat parathas.', 'Frozen Paratha', 120, 150, NOW(), 16),
(126, NOW(), '500ml premium ice cream.', 'Ice Cream Vanilla', 180, 90, NOW(), 16),
(127, NOW(), '500g mix of carrots, beans, and peas.', 'Frozen Mixed Vegetables', 95, 120, NOW(), 16),
(128, NOW(), '300g instant pasta meal.', 'Ready-to-Eat Pasta', 150, 100, NOW(), 16),
(129, NOW(), 'Pack of 6 vegetarian spring rolls.', 'Spring Rolls', 130, 80, NOW(), 16),
(130, NOW(), '500g white fish fillet.', 'Frozen Fish Fillet', 300, 50, NOW(), 16),

-- Meat & Seafood (category 17)
(131, NOW(), '1kg fresh chicken.', 'Chicken - Whole', 250, 100, NOW(), 17),
(132, NOW(), '500g boneless mutton.', 'Mutton - Boneless', 450, 50, NOW(), 17),
(133, NOW(), '1kg fresh Rohu fish.', 'Fish - Rohu', 300, 80, NOW(), 17),
(134, NOW(), '500g fresh prawns.', 'Prawns - Medium', 350, 70, NOW(), 17),
(135, NOW(), 'Pack of 12 country eggs.', 'Eggs - Country', 80, 150, NOW(), 17),
(136, NOW(), '500g skinless chicken breast.', 'Chicken Breast', 300, 90, NOW(), 17),
(137, NOW(), '500g mutton pieces for curry.', 'Mutton Curry Cut', 430, 60, NOW(), 17),
(138, NOW(), '1kg fresh Catla fish.', 'Fish - Catla', 280, 80, NOW(), 17),
(139, NOW(), '500g live crab.', 'Crab - Fresh', 400, 30, NOW(), 17),
(140, NOW(), '500g fresh chicken wings.', 'Chicken Wings', 200, 120, NOW(), 17),

-- Personal Care (category 18)
(141, NOW(), 'Pack of 2 moisturizing soap bars.', 'Soap - Dove', 120, 200, NOW(), 18),
(142, NOW(), '200ml hair care shampoo.', 'Shampoo - Pantene', 150, 180, NOW(), 18),
(143, NOW(), '100g tube, cavity protection.', 'Toothpaste - Colgate', 60, 250, NOW(), 18),
(144, NOW(), 'Pack of 2 soft bristle brushes.', 'Toothbrush - Soft', 80, 200, NOW(), 18),
(145, NOW(), '200ml moisturizing lotion.', 'Body Lotion - Nivea', 180, 120, NOW(), 18),
(146, NOW(), '200ml antibacterial handwash.', 'Handwash - Dettol', 90, 150, NOW(), 18),
(147, NOW(), '100ml herbal face wash.', 'Face Wash - Himalaya', 120, 100, NOW(), 18),
(148, NOW(), '100g smooth shaving cream.', 'Shaving Cream - Gillette', 140, 80, NOW(), 18),
(149, NOW(), '200ml coconut hair oil.', 'Hair Oil - Parachute', 100, 120, NOW(), 18),
(150, NOW(), '150ml body spray.', 'Deodorant - Axe', 180, 90, NOW(), 8),

-- Household Essentials (category 19)
(151, NOW(), '1kg laundry detergent powder.', 'Detergent Powder - Surf Excel', 200, 150, NOW(), 19),
(152, NOW(), '500ml dish soap.', 'Dishwashing Liquid - Vim', 90, 200, NOW(), 19),
(153, NOW(), '500ml disinfectant cleaner.', 'Floor Cleaner - Lizol', 120, 120, NOW(), 19),
(154, NOW(), 'Pack of 20 large garbage bags.', 'Garbage Bags', 80, 150, NOW(), 19),
(155, NOW(), 'Standard cleaning set.', 'Mop & Bucket Set', 400, 60, NOW(), 19),
(156, NOW(), 'Roll of 10 meters.', 'Aluminium Foil', 70, 100, NOW(), 19),
(157, NOW(), 'Pack of 20 sheets.', 'Plastic Wrap', 50, 150, NOW(), 19),
(158, NOW(), '300ml room freshener.', 'Air Freshener Spray', 120, 120, NOW(), 19),
(159, NOW(), 'Household cleaning set.', 'Broom & Dustpan', 180, 80, NOW(), 19),
(160, NOW(), '1L liquid detergent.', 'Laundry Liquid Detergent', 220, 100, NOW(), 19),

-- Baby & Kids (category 20)
(161, NOW(), 'Pack of 20 diapers, size M.', 'Baby Diapers - Pack', 350, 100, NOW(), 20),
(162, NOW(), 'Pack of 80 wipes.', 'Baby Wipes - Soft', 150, 120, NOW(), 20),
(163, NOW(), '400g baby formula milk.', 'Infant Formula', 500, 80, NOW(), 20),
(164, NOW(), '200ml gentle lotion.', 'Baby Lotion - Johnsons', 200, 100, NOW(), 20),
(165, NOW(), '200ml tear-free shampoo.', 'Baby Shampoo - Johnsons', 180, 100, NOW(), 20),
(166, NOW(), 'Pack of 10 biscuits.', 'Kids Snack Biscuits', 60, 150, NOW(), 20),
(167, NOW(), '120g mixed vegetable puree.', 'Baby Food Jar - Veg', 90, 120, NOW(), 20),
(168, NOW(), '50g soothing cream.', 'Diaper Rash Cream', 120, 80, NOW(), 20),
(169, NOW(), 'Feeding bottle with nipple.', 'Baby Bottle - 250ml', 150, 90, NOW(), 20),
(170, NOW(), 'Safe silicone pacifier.', 'Pacifier - Silicone', 100, 100, NOW(), 20);

-- ============ PRODUCT IMAGES ============
-- NOTE: These reference image files in the /uploads/products/ folder.
-- You'll need to copy the Images folder to the new device as well.
INSERT INTO `product_images` (id, created_at, image_url, is_primary, product_id) VALUES
(1, NOW(), '/uploads/products/e418916c-9771-4320-9079-cd25904d8087.jpg', 1, 13),
(2, NOW(), '/uploads/products/5c445b3b-bd0c-4ff0-a9b5-5d628d8a6f67.jpg', 1, 11),
(3, NOW(), '/uploads/products/5106a197-103e-4813-95c2-d8ad4a49043c.jpg', 1, 12),
(4, NOW(), '/uploads/products/284d7e27-352c-47b7-8e10-1a166f59a164.jpg', 1, 14),
(5, NOW(), '/uploads/products/999d6c2e-df19-4bdd-857a-5faf0c879a37.jpg', 1, 15),
(6, NOW(), '/uploads/products/a19b9ec4-8d80-456f-b5f1-883e7def3770.jpg', 1, 16),
(7, NOW(), '/uploads/products/f8a31037-ea3d-42f0-aa5d-12af8d9e1c03.jpg', 1, 17),
(8, NOW(), '/uploads/products/da5f2b0c-66b9-43ea-a363-69904d50d003.jpg', 1, 18),
(9, NOW(), '/uploads/products/c761530f-03ad-4591-9c39-ce9e4f30b1d2.jpg', 1, 19),
(10, NOW(), '/uploads/products/b93208d6-8694-46f0-beb2-11c2042cdab8.jpg', 1, 20);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DONE! Your database now has:
--   20 categories
--   170 products
--   10 product images (for products 11-20)
--
-- To also seed the admin user, run the app once — AdminSeeder 
-- will auto-create admin/Adminpassword@123
--
-- Don't forget to copy the Images folder to the new device at
-- the path configured in application.properties:
--   disk.upload.basepath=<your-path>/Images
-- ============================================================
