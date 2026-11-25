// More built-in clones (added in 2.2, from the v4 dish list). Same shape as data.js.
// Prices are typical US menu prices vs. estimated grocery cost per serving. Estimates, not verified nutrition.
const i = (name, qty, cost, aisle) => ({ name, qty, cost, aisle });

export const MORE_MEALS = [
  // ---------- Burgers ----------
  {
    id: 'baconator', restaurant: "Wendy's", item: 'Double bacon cheeseburger', emoji: '🍔', category: 'Burgers',
    restaurantPrice: 9.49, homePrice: 4.15, restaurantCal: 960, homeCal: 820, protein: 55, minutes: 20, score: 87,
    diets: ['vegetarian'], tags: ['game-day', 'high-protein'],
    ingredients: [
      i('Ground beef 80/20', '8 oz', 2.20, 'protein'), i('Thick-cut bacon', '3 slices', 0.95, 'protein'),
      i('American cheese', '2 slices', 0.40, 'dairy'), i('Brioche bun', '1', 0.45, 'bakery'),
      i('Ketchup + mayo', '1 tbsp each', 0.15, 'pantry'),
    ],
    steps: [
      'Bake bacon on a rack at 400°F for 15–18 minutes until crisp.',
      'Form two 4 oz square-ish patties a little wider than the bun. Salt and pepper both sides.',
      'Sear in a very hot skillet 3 minutes, flip, top each with cheese, cook 2 more minutes (160°F).',
      'Toast the bun. Stack mayo, patty, bacon, patty, bacon, ketchup.',
    ],
    swaps: [['Vegetarian', 'Two plant-based patties and smoky tempeh "bacon."'], ['Lighter', 'One patty, two bacon slices, lettuce wrap — about 450 calories.']],
  },
  {
    id: 'five-guys-burger', restaurant: 'Five Guys', item: 'Cheeseburger, all the way', emoji: '🍔', category: 'Burgers',
    restaurantPrice: 12.49, homePrice: 4.05, restaurantCal: 980, homeCal: 760, protein: 46, minutes: 20, score: 86,
    diets: ['vegetarian', 'vegan'], tags: ['kid-friendly', 'family'],
    ingredients: [
      i('Ground beef 80/20', '7 oz', 1.95, 'protein'), i('Sesame bun', '1', 0.40, 'bakery'), i('American cheese', '2 slices', 0.40, 'dairy'),
      i('Grilled onions + mushrooms', '½ cup', 0.55, 'produce'), i('Lettuce, tomato, pickles', '1 serving', 0.50, 'produce'),
      i('Mayo, ketchup, mustard', 'to taste', 0.25, 'pantry'),
    ],
    steps: [
      'Sauté sliced onions and mushrooms in a little oil 8 minutes until soft and browned.',
      'Divide beef into two thin 3½ oz patties. Season well.',
      'Cook on a hot griddle 3 minutes per side until well done (160°F); cheese on for the last minute.',
      'Toast the bun and load it with mayo, both patties, grilled veg, lettuce, tomato, pickles, ketchup and mustard.',
    ],
    swaps: [['Vegan', 'Plant-based patties, vegan cheese, egg-free mayo.'], ['Vegetarian', 'Swap patties for a big grilled portobello plus cheese.']],
  },
  {
    id: 'shackburger', restaurant: 'Shake Shack', item: 'Smashed cheeseburger with Shack-style sauce', emoji: '🍔', category: 'Burgers',
    restaurantPrice: 8.79, homePrice: 2.40, restaurantCal: 530, homeCal: 500, protein: 29, minutes: 15, score: 90,
    diets: ['vegetarian', 'vegan'], tags: ['quick', 'kid-friendly'],
    ingredients: [
      i('Ground beef 80/20', '4 oz', 1.10, 'protein'), i('Potato bun', '1', 0.45, 'bakery'), i('American cheese', '1 slice', 0.20, 'dairy'),
      i('Green-leaf lettuce + tomato', '1 serving', 0.40, 'produce'), i('Mayo, ketchup, mustard, pickle brine', '2 tbsp sauce', 0.25, 'pantry'),
    ],
    steps: [
      'Stir mayo, a little ketchup, yellow mustard, a splash of pickle brine and a pinch of cayenne for the sauce.',
      'Roll beef into a ball. Smash it flat on a smoking-hot skillet with a stiff spatula; season.',
      'Cook 2½ minutes until the edges are deeply browned, flip, add cheese, cook 1 minute more (160°F).',
      'Toast the buttered bun. Build: lettuce, tomato, patty, sauce.',
    ],
    swaps: [['Vegan', 'Smash a plant-based patty; vegan cheese and egg-free mayo.'], ['Vegetarian', 'Panko-crusted portobello stuffed with melted cheese.']],
  },

  // ---------- Mexican ----------
  {
    id: 'tb-quesadilla', restaurant: 'Taco Bell', item: 'Chicken quesadilla with creamy jalapeño sauce', emoji: '🫓', category: 'Mexican',
    restaurantPrice: 6.79, homePrice: 2.40, restaurantCal: 520, homeCal: 480, protein: 30, minutes: 15, score: 88,
    diets: ['vegetarian', 'vegan'], tags: ['quick', 'kid-friendly'],
    ingredients: [
      i('Cooked chicken breast', '4 oz', 1.10, 'protein'), i('Large flour tortilla', '1', 0.30, 'bakery'),
      i('Three-cheese Mexican blend', '½ cup', 0.70, 'dairy'), i('Mayo + pickled jalapeño brine', '2 tbsp sauce', 0.20, 'pantry'),
      i('Cumin, paprika, garlic powder', 'pinch each', 0.10, 'pantry'),
    ],
    steps: [
      'Mix mayo with jalapeño brine, a few minced jalapeños, cumin, paprika and garlic powder.',
      'Dice the chicken and season with a pinch of the same spices.',
      'Spread sauce on half the tortilla, add cheese and chicken, fold over.',
      'Cook in a dry skillet over medium heat 2–3 minutes per side until crisp and melted. Cut into wedges.',
    ],
    swaps: [['Vegetarian', 'Black beans and sautéed peppers instead of chicken.'], ['Vegan', 'Beans, vegan cheese and an egg-free mayo sauce.']],
  },
  {
    id: 'steak-burrito', restaurant: 'Chipotle', item: 'Steak burrito', emoji: '🌯', category: 'Mexican',
    restaurantPrice: 13.45, homePrice: 4.95, restaurantCal: 1050, homeCal: 860, protein: 48, minutes: 35, score: 89,
    diets: ['vegetarian', 'vegan'], tags: ['meal-prep', 'high-protein'],
    ingredients: [
      i('Flank or sirloin steak', '6 oz', 2.60, 'protein'), i('Large flour tortilla', '1', 0.35, 'bakery'),
      i('Long-grain rice', '¾ cup cooked', 0.30, 'pantry'), i('Pinto or black beans', '½ cup', 0.38, 'pantry'),
      i('Pico de gallo', '⅓ cup', 0.45, 'produce'), i('Shredded cheese + sour cream', '2 tbsp each', 0.45, 'dairy'),
      i('Chipotle in adobo + lime', '1 tbsp', 0.42, 'pantry'),
    ],
    steps: [
      'Blend chipotle in adobo, garlic, cumin, oregano, oil and salt. Marinate the steak at least 20 minutes.',
      'Cook rice and finish with lime juice and chopped cilantro.',
      'Sear steak over high heat 3–4 minutes per side (145°F for medium). Rest 5 minutes, then dice.',
      'Warm the tortilla. Fill with rice, beans, steak, pico, cheese and sour cream; fold in the sides and roll tight.',
    ],
    swaps: [['Vegan', 'Sofritas: crumbled tofu in the chipotle marinade; skip dairy.'], ['Lighter', 'Make it a bowl over lettuce — about 600 calories.']],
  },
  {
    id: 'chilis-fajitas', restaurant: "Chili's", item: 'Sizzling chicken fajitas', emoji: '🌮', category: 'Mexican',
    restaurantPrice: 18.99, homePrice: 4.40, restaurantCal: 1100, homeCal: 640, protein: 44, minutes: 30, score: 87,
    diets: ['vegetarian', 'vegan'], tags: ['family', 'high-protein'],
    ingredients: [
      i('Chicken breast', '6 oz', 1.65, 'protein'), i('Bell peppers + onion', '1½ cups sliced', 0.95, 'produce'),
      i('Flour tortillas', '3 small', 0.45, 'bakery'), i('Lime, garlic, chili powder, cumin', 'marinade', 0.40, 'pantry'),
      i('Sour cream, pico, cheese', '2 tbsp each', 0.95, 'dairy'),
    ],
    steps: [
      'Marinate sliced chicken in lime juice, oil, garlic, chili powder, cumin and salt for 20 minutes.',
      'Get a cast-iron skillet smoking hot. Sear the chicken in one layer 5–6 minutes until 165°F; set aside.',
      'Cook peppers and onions in the same pan 5 minutes until charred at the edges. Return the chicken and squeeze in lime.',
      'Serve sizzling with warm tortillas and the toppings.',
    ],
    swaps: [['Vegetarian', 'Portobello strips and black beans.'], ['Vegan', 'Portobellos, guacamole instead of dairy.']],
  },
  {
    id: 'mexican-pizza', restaurant: 'Taco Bell', item: 'Mexican pizza', emoji: '🍕', category: 'Mexican',
    restaurantPrice: 6.49, homePrice: 2.45, restaurantCal: 540, homeCal: 520, protein: 22, minutes: 20, score: 85,
    diets: ['vegetarian', 'vegan'], tags: ['kid-friendly', 'air-fryer'],
    ingredients: [
      i('Flour tortillas (small)', '2', 0.30, 'bakery'), i('Ground beef', '2 oz', 0.55, 'protein'),
      i('Refried beans', '⅓ cup', 0.30, 'pantry'), i('Enchilada sauce', '3 tbsp', 0.30, 'pantry'),
      i('Mexican cheese blend', '⅓ cup', 0.55, 'dairy'), i('Tomato', '¼ diced', 0.25, 'produce'), i('Taco seasoning', '1 tsp', 0.20, 'pantry'),
    ],
    steps: [
      'Brown the beef with taco seasoning and a splash of water until cooked through (160°F).',
      'Air-fry or pan-fry the tortillas in a little oil until crisp and puffed, about 2 minutes each.',
      'Spread beans and beef on one tortilla, top with the second, then sauce, cheese and tomato.',
      'Bake at 425°F (or air-fry at 375°F) 4–5 minutes until the cheese melts.',
    ],
    swaps: [['Vegetarian', 'Double the beans, skip the beef.'], ['Vegan', 'Beans only, vegan cheese.']],
  },

  // ---------- Chicken ----------
  {
    id: 'popeyes-spicy', restaurant: 'Popeyes', item: 'Spicy fried chicken sandwich', emoji: '🌶️', category: 'Chicken',
    restaurantPrice: 6.29, homePrice: 3.05, restaurantCal: 700, homeCal: 640, protein: 34, minutes: 40, score: 87,
    diets: ['vegetarian', 'vegan'], tags: ['game-day'],
    ingredients: [
      i('Boneless chicken thigh', '6 oz', 1.20, 'protein'), i('Buttermilk', '½ cup', 0.25, 'dairy'),
      i('Flour + cornstarch', '¾ cup', 0.20, 'pantry'), i('Cayenne, paprika, garlic powder', '1 tbsp', 0.15, 'pantry'),
      i('Brioche bun', '1', 0.45, 'bakery'), i('Thick pickles', '3', 0.15, 'pantry'),
      i('Mayo + hot sauce', '2 tbsp', 0.20, 'pantry'), i('Frying oil', 'for frying', 0.45, 'pantry'),
    ],
    steps: [
      'Soak chicken in buttermilk with hot sauce and salt for 30 minutes (or overnight).',
      'Season flour and cornstarch with cayenne, paprika, garlic powder and salt. Drizzle in a spoon of buttermilk for shaggy bits.',
      'Dredge well and fry at 350°F for 6–7 minutes until deep golden and 165°F inside.',
      'Spread spicy mayo on a toasted bun; add chicken and pickles.',
    ],
    swaps: [['Vegetarian', 'Fry a thick slab of pressed extra-firm tofu or a cauliflower steak.'], ['Lighter', 'Air-fry at 400°F for 12 minutes after a light oil spray.']],
  },
  {
    id: 'cfa-nuggets', restaurant: 'Chick-fil-A', item: 'Chicken nuggets', emoji: '🍗', category: 'Chicken',
    restaurantPrice: 7.85, homePrice: 2.35, restaurantCal: 380, homeCal: 360, protein: 38, minutes: 30, score: 89,
    diets: ['vegetarian', 'vegan'], tags: ['kid-friendly', 'high-protein'],
    ingredients: [
      i('Chicken breast', '8 oz', 1.40, 'protein'), i('Pickle juice', '½ cup', 0.10, 'pantry'), i('Egg + milk', '1 + ¼ cup', 0.35, 'dairy'),
      i('Flour + powdered sugar', '¾ cup', 0.15, 'pantry'), i('Paprika, salt, pepper', 'to taste', 0.05, 'pantry'), i('Peanut oil', 'for frying', 0.30, 'pantry'),
    ],
    steps: [
      'Cut chicken into bite-size pieces and soak in pickle juice for 30 minutes to 2 hours.',
      'Whisk egg and milk. Mix flour, 1 tbsp powdered sugar, paprika, salt and pepper.',
      'Dip pieces in egg wash, then flour. Fry at 350°F for 4–5 minutes until golden and 165°F.',
      'Drain on a rack and serve with honey mustard or a Polynesian-style sauce.',
    ],
    swaps: [['Vegetarian', 'Cauliflower florets, same brine and coating.'], ['Lighter', 'Grilled: skip the coating, sear the brined pieces in a skillet.']],
  },
  {
    id: 'garlic-parm-wings', restaurant: 'Wingstop', item: 'Garlic parmesan wings', emoji: '🍗', category: 'Chicken',
    restaurantPrice: 12.49, homePrice: 3.65, restaurantCal: 750, homeCal: 620, protein: 46, minutes: 45, score: 88,
    diets: ['vegetarian'], tags: ['game-day', 'air-fryer', 'high-protein'],
    ingredients: [
      i('Chicken wings', '1 lb', 2.50, 'protein'), i('Baking powder', '1 tsp', 0.05, 'pantry'), i('Butter', '2 tbsp', 0.30, 'dairy'),
      i('Garlic', '3 cloves', 0.20, 'produce'), i('Grated parmesan', '3 tbsp', 0.45, 'dairy'), i('Parsley, salt, pepper', 'to taste', 0.15, 'produce'),
    ],
    steps: [
      'Pat wings very dry and toss with baking powder and salt.',
      'Air-fry at 380°F for 22–25 minutes, shaking twice, until crisp and 175°F at the bone.',
      'Melt butter with minced garlic over low heat 2 minutes; stir in parsley and black pepper.',
      'Toss hot wings in garlic butter, then in parmesan. Serve right away.',
    ],
    swaps: [['Vegetarian', 'Cauliflower "wings" roasted at 450°F, then tossed the same way.'], ['Lighter', 'Half the butter; use a garlic-lemon toss.']],
  },
  {
    id: 'pollo-citrus', restaurant: 'Pollo Tropical', item: 'Citrus-marinated grilled chicken', emoji: '🍊', category: 'Chicken',
    restaurantPrice: 11.99, homePrice: 3.90, restaurantCal: 760, homeCal: 590, protein: 46, minutes: 45, score: 86,
    diets: ['vegetarian', 'vegan'], tags: ['meal-prep', 'high-protein'],
    ingredients: [
      i('Chicken leg quarter or thighs', '10 oz', 1.70, 'protein'), i('Oranges + limes', '1 each', 0.80, 'produce'),
      i('Garlic, cumin, oregano', 'marinade', 0.30, 'pantry'), i('Rice + black beans', '1 cup', 0.60, 'pantry'),
      i('Sweet plantain', '½', 0.50, 'produce'),
    ],
    steps: [
      'Blend orange and lime juice with garlic, cumin, oregano, oil and salt. Marinate the chicken 1–4 hours.',
      'Grill or roast at 425°F for 30–35 minutes until the skin chars and the meat is 175°F.',
      'Slice the plantain on a bias and pan-fry in a little oil until caramelized.',
      'Serve with rice and black beans and a spoon of the warmed marinade (boiled 1 minute first).',
    ],
    swaps: [['Vegetarian', 'Marinate thick slabs of tofu or cauliflower steaks.'], ['Vegan', 'Tofu, and check the beans are cooked without lard.']],
  },
  {
    id: 'chicken-madeira', restaurant: 'The Cheesecake Factory', item: 'Chicken Madeira', emoji: '🍄', category: 'Chicken',
    restaurantPrice: 25.95, homePrice: 5.40, restaurantCal: 1250, homeCal: 720, protein: 52, minutes: 35, score: 86,
    diets: ['vegetarian'], tags: ['date-night', 'comfort'],
    ingredients: [
      i('Chicken breast', '7 oz', 1.90, 'protein'), i('Mushrooms', '1 cup sliced', 0.80, 'produce'), i('Asparagus', '5 spears', 0.90, 'produce'),
      i('Mozzarella', '2 slices', 0.55, 'dairy'), i('Madeira or dry sherry', '¼ cup', 0.80, 'pantry'), i('Beef broth + butter', '½ cup + 1 tbsp', 0.45, 'pantry'),
    ],
    steps: [
      'Pound chicken to an even ½ inch. Season and sear in oil 4–5 minutes per side until 165°F. Set aside.',
      'Brown mushrooms in butter, then add Madeira and broth and simmer until reduced by half and glossy.',
      'Blanch asparagus 2 minutes. Lay it on the chicken, top with mozzarella, and broil 2 minutes to melt.',
      'Spoon the mushroom Madeira sauce over the top. Serve with mashed potatoes.',
    ],
    swaps: [['Vegetarian', 'Thick portobello caps instead of chicken; vegetable broth.'], ['Lighter', 'Skip the cheese and butter; serve over greens.']],
  },

  // ---------- Bowls ----------
  {
    id: 'famous-bowl', restaurant: 'KFC', item: 'Famous bowl', emoji: '🥣', category: 'Bowls',
    restaurantPrice: 6.99, homePrice: 2.70, restaurantCal: 720, homeCal: 640, protein: 28, minutes: 35, score: 85,
    diets: ['vegetarian'], tags: ['comfort', 'kid-friendly'],
    ingredients: [
      i('Chicken tenders (breaded)', '4 oz', 1.00, 'protein'), i('Potatoes', '1 medium', 0.35, 'produce'),
      i('Milk + butter', '¼ cup + 1 tbsp', 0.30, 'dairy'), i('Frozen sweet corn', '⅓ cup', 0.25, 'frozen'),
      i('Brown gravy mix', '½ packet', 0.40, 'pantry'), i('Shredded cheddar blend', '¼ cup', 0.40, 'dairy'),
    ],
    steps: [
      'Boil peeled potato chunks 15 minutes, then mash with butter, milk and salt.',
      'Bake or air-fry the tenders until crisp and 165°F; cut into bites.',
      'Make the gravy per the packet. Warm the corn.',
      'Layer: mashed potatoes, corn, chicken, gravy, cheese.',
    ],
    swaps: [['Vegetarian', 'Crispy breaded tofu bites and a mushroom gravy.'], ['Lighter', 'Half potatoes, half mashed cauliflower; grilled chicken.']],
  },
  {
    id: 'cava-harissa', restaurant: 'Cava', item: 'Harissa chicken bowl', emoji: '🥗', category: 'Bowls',
    restaurantPrice: 13.95, homePrice: 4.20, restaurantCal: 800, homeCal: 620, protein: 44, minutes: 35, score: 86,
    diets: ['vegetarian', 'vegan'], tags: ['meal-prep', 'high-protein'],
    ingredients: [
      i('Chicken thighs', '6 oz', 1.40, 'protein'), i('Harissa paste', '1 tbsp', 0.45, 'pantry'), i('Brown rice', '¾ cup cooked', 0.30, 'pantry'),
      i('Hummus', '3 tbsp', 0.45, 'dairy'), i('Cucumber, tomato, red onion', '1 cup', 0.70, 'produce'),
      i('Feta', '2 tbsp', 0.40, 'dairy'), i('Lemon + tahini', 'dressing', 0.50, 'pantry'),
    ],
    steps: [
      'Coat chicken in harissa, oil, garlic and salt. Roast at 425°F for 20 minutes or until 175°F; slice.',
      'Toss diced cucumber, tomato and onion with lemon, oil and salt.',
      'Whisk tahini, lemon juice, water and salt into a pourable dressing.',
      'Bowl it up: rice, hummus, chicken, salad, feta, tahini drizzle.',
    ],
    swaps: [['Vegan', 'Harissa-roasted chickpeas or falafel; skip feta.'], ['Lighter', 'Greens instead of rice — about 450 calories.']],
  },

  // ---------- Asian ----------
  {
    id: 'beijing-beef', restaurant: 'Panda Express', item: 'Beijing beef with rice', emoji: '🥡', category: 'Asian',
    restaurantPrice: 11.70, homePrice: 3.95, restaurantCal: 940, homeCal: 720, protein: 30, minutes: 30, score: 85,
    diets: ['vegetarian', 'vegan'], tags: ['family'],
    ingredients: [
      i('Flank steak', '5 oz', 2.10, 'protein'), i('Cornstarch', '¼ cup', 0.10, 'pantry'), i('Red bell pepper + onion', '1 cup', 0.70, 'produce'),
      i('Sweet chili + hoisin + ketchup', 'sauce', 0.55, 'pantry'), i('Rice vinegar, garlic, ginger', 'to taste', 0.20, 'pantry'), i('White rice', '1 cup cooked', 0.30, 'pantry'),
    ],
    steps: [
      'Slice beef thin across the grain, toss with salt and egg white, then coat in cornstarch.',
      'Shallow-fry in batches at 350°F for 2–3 minutes until crisp. Drain.',
      'Stir-fry peppers and onions 2 minutes. Add sweet chili, hoisin, ketchup, vinegar, garlic and ginger; bubble 1 minute.',
      'Toss in the beef and serve over rice right away so it stays crunchy.',
    ],
    swaps: [['Vegan', 'Crispy pressed tofu or seitan strips.'], ['Lighter', 'Skip the frying: sear the beef and halve the sauce sugar.']],
  },
  {
    id: 'kung-pao', restaurant: 'Panda Express', item: 'Kung pao chicken', emoji: '🥜', category: 'Asian',
    restaurantPrice: 10.90, homePrice: 3.10, restaurantCal: 650, homeCal: 540, protein: 38, minutes: 25, score: 87,
    diets: ['vegetarian', 'vegan'], tags: ['quick', 'high-protein'],
    ingredients: [
      i('Chicken thighs', '6 oz', 1.40, 'protein'), i('Roasted peanuts', '2 tbsp', 0.25, 'pantry'), i('Zucchini + red pepper', '1 cup', 0.70, 'produce'),
      i('Dried red chilies', '4', 0.15, 'pantry'), i('Soy sauce, black vinegar, sugar', 'sauce', 0.30, 'pantry'), i('White rice', '1 cup cooked', 0.30, 'pantry'),
    ],
    steps: [
      'Cube chicken and toss with soy sauce and cornstarch.',
      'Mix sauce: soy sauce, black (or rice) vinegar, sugar, a little cornstarch and water.',
      'Stir-fry chilies 20 seconds, add chicken and cook 4–5 minutes until 165°F. Add zucchini and pepper for 2 minutes.',
      'Pour in the sauce, toss until glossy, stir in peanuts. Serve with rice.',
    ],
    swaps: [['Vegan', 'Firm tofu cubes, cornstarch-dusted and pan-fried first.'], ['Lighter', 'Cauliflower rice and half the peanuts.']],
  },

  // ---------- Pasta ----------
  {
    id: 'og-lasagna', restaurant: 'Olive Garden', item: 'Lasagna classico', emoji: '🍝', category: 'Pasta',
    restaurantPrice: 18.99, homePrice: 3.85, restaurantCal: 940, homeCal: 720, protein: 42, minutes: 90, score: 88,
    diets: ['vegetarian'], tags: ['comfort', 'meal-prep'],
    ingredients: [
      i('Lasagna noodles', '3 sheets', 0.30, 'pantry'), i('Ground beef + Italian sausage', '4 oz', 1.20, 'protein'),
      i('Marinara', '¾ cup', 0.55, 'pantry'), i('Ricotta', '⅓ cup', 0.65, 'dairy'),
      i('Mozzarella + parmesan', '½ cup', 0.85, 'dairy'), i('Egg, garlic, basil', '1 serving', 0.30, 'produce'),
    ],
    steps: [
      'Brown beef and sausage until cooked through (160°F); stir in marinara and simmer 15 minutes.',
      'Mix ricotta with egg, parmesan, chopped basil and pepper.',
      'In a dish layer sauce, noodles, ricotta, mozzarella, meat sauce — repeat, ending with sauce and cheese.',
      'Cover and bake at 375°F for 40 minutes, uncover for 15. Rest 15 minutes before slicing.',
    ],
    swaps: [['Vegetarian', 'Roasted zucchini, spinach and mushrooms instead of meat.'], ['Lighter', 'Part-skim cheeses and lean turkey.']],
  },
  {
    id: 'shrimp-scampi', restaurant: 'Red Lobster', item: 'Shrimp scampi with linguine', emoji: '🍤', category: 'Seafood',
    restaurantPrice: 18.99, homePrice: 4.25, restaurantCal: 700, homeCal: 560, protein: 34, minutes: 20, score: 88,
    diets: ['vegetarian', 'vegan'], tags: ['quick', 'date-night'],
    ingredients: [
      i('Shrimp, peeled', '6 oz', 2.40, 'frozen'), i('Linguine', '3 oz', 0.30, 'pantry'), i('Butter', '2 tbsp', 0.30, 'dairy'),
      i('Garlic', '4 cloves', 0.25, 'produce'), i('Lemon', '½', 0.30, 'produce'), i('White wine or broth', '¼ cup', 0.55, 'pantry'), i('Parsley + chili flakes', 'pinch', 0.15, 'produce'),
    ],
    steps: [
      'Boil linguine in well-salted water; save ½ cup pasta water.',
      'Melt butter with oil, add garlic and chili flakes for 1 minute.',
      'Add shrimp and cook 1–2 minutes per side until pink and 145°F. Add wine and lemon juice; simmer 1 minute.',
      'Toss in pasta, parsley and a splash of pasta water until glossy.',
    ],
    swaps: [['Vegetarian', 'King oyster mushroom "scallops," seared hard.'], ['Vegan', 'Mushrooms plus olive oil instead of butter.']],
  },

  // ---------- Seafood / Steak ----------
  {
    id: 'roadhouse-salmon', restaurant: 'Texas Roadhouse', item: 'Grilled salmon with lemon pepper butter', emoji: '🐟', category: 'Seafood',
    restaurantPrice: 20.99, homePrice: 5.85, restaurantCal: 800, homeCal: 560, protein: 40, minutes: 20, score: 87,
    diets: [], tags: ['quick', 'lighter', 'high-protein'],
    ingredients: [
      i('Salmon fillet', '6 oz', 4.50, 'protein'), i('Butter', '1 tbsp', 0.15, 'dairy'), i('Lemon pepper seasoning', '1 tsp', 0.15, 'pantry'),
      i('Lemon', '½', 0.30, 'produce'), i('Green beans', '1 cup', 0.70, 'produce'), i('Garlic', '1 clove', 0.05, 'produce'),
    ],
    steps: [
      'Pat salmon dry and season with lemon pepper and salt.',
      'Grill or pan-sear skin-side down 4 minutes, flip, cook 2–3 minutes more to 145°F.',
      'Sauté green beans with garlic until crisp-tender.',
      'Melt butter with lemon juice and spoon over the salmon.',
    ],
    swaps: [['Lighter', 'Skip the butter; finish with lemon and olive oil.']],
  },
  {
    id: 'outback-sirloin', restaurant: 'Outback', item: 'Seasoned sirloin', emoji: '🥩', category: 'Steak',
    restaurantPrice: 22.99, homePrice: 5.80, restaurantCal: 850, homeCal: 640, protein: 48, minutes: 30, score: 86,
    diets: ['vegetarian', 'vegan'], tags: ['date-night', 'high-protein'],
    ingredients: [
      i('Top sirloin steak', '8 oz', 4.20, 'protein'), i('Paprika, brown sugar, garlic, onion powder', 'rub', 0.25, 'pantry'),
      i('Russet potato', '1', 0.50, 'produce'), i('Butter + sour cream', '1 tbsp each', 0.35, 'dairy'), i('Side salad greens', '1 cup', 0.50, 'produce'),
    ],
    steps: [
      'Bake the potato at 425°F for 50–60 minutes until tender.',
      'Mix paprika, a little brown sugar, garlic and onion powder, salt, pepper and a pinch of cayenne. Rub on the steak and rest 20 minutes.',
      'Sear in a smoking-hot cast-iron pan 3–4 minutes per side (130°F medium-rare, 145°F medium). Rest 5 minutes.',
      'Serve with the loaded potato and salad.',
    ],
    swaps: [['Vegetarian', 'Thick cauliflower or portobello "steaks" with the same rub.'], ['Vegan', 'Same, with olive oil instead of butter.']],
  },

  // ---------- Pizza ----------
  {
    id: 'pepperoni-pizza', restaurant: "Domino's", item: 'Hand-tossed pepperoni pizza', emoji: '🍕', category: 'Pizza',
    restaurantPrice: 15.99, homePrice: 4.40, restaurantCal: 600, homeCal: 560, protein: 26, minutes: 30, score: 86,
    diets: ['vegetarian', 'vegan'], tags: ['family', 'kid-friendly'],
    ingredients: [
      i('Pizza dough', '½ lb (makes 2 servings)', 1.25, 'bakery'), i('Pizza sauce', '⅓ cup', 0.40, 'pantry'),
      i('Low-moisture mozzarella', '1 cup', 1.60, 'dairy'), i('Pepperoni', '1 oz', 0.85, 'protein'), i('Garlic butter + Italian seasoning', 'crust brush', 0.30, 'pantry'),
    ],
    steps: [
      'Heat the oven (with a pan or stone inside) to 500°F for 30 minutes.',
      'Stretch the dough to 12 inches, leaving a thick edge.',
      'Spread sauce, cover with mozzarella and pepperoni. Brush the edge with garlic butter and seasoning.',
      'Bake 10–12 minutes until the crust is browned and the cheese bubbles. Per serving = half the pizza.',
    ],
    swaps: [['Vegetarian', 'Mushrooms, peppers and olives instead of pepperoni.'], ['Vegan', 'Vegan mozzarella and veggies.']],
  },

  // ---------- Soups ----------
  {
    id: 'og-minestrone', restaurant: 'Olive Garden', item: 'Minestrone', emoji: '🍲', category: 'Soups',
    restaurantPrice: 8.99, homePrice: 1.85, restaurantCal: 220, homeCal: 210, protein: 8, minutes: 40, score: 89,
    diets: ['vegetarian', 'vegan'], tags: ['meal-prep', 'lighter', 'plant-based'],
    ingredients: [
      i('Onion, carrot, celery, zucchini', '1½ cups', 0.70, 'produce'), i('Kidney + cannellini beans', '½ cup', 0.35, 'pantry'),
      i('Crushed tomatoes + vegetable broth', '1½ cups', 0.45, 'pantry'), i('Small shell pasta', '2 tbsp', 0.10, 'pantry'),
      i('Spinach', 'handful', 0.20, 'produce'), i('Garlic, oregano, basil', 'to taste', 0.05, 'pantry'),
    ],
    steps: [
      'Soften diced onion, carrot and celery in olive oil 6 minutes; add garlic.',
      'Add tomatoes, broth, beans, zucchini and herbs. Simmer 20 minutes.',
      'Add pasta and cook 8 minutes; stir in spinach at the end.',
      'Season and serve with parmesan if you like.',
    ],
    swaps: [['High protein', 'Stir in extra white beans or shredded chicken.']],
  },

  // ---------- Breakfast ----------
  {
    id: 'ihop-pancakes', restaurant: 'IHOP', item: 'Buttermilk pancakes', emoji: '🥞', category: 'Breakfast',
    restaurantPrice: 10.49, homePrice: 1.35, restaurantCal: 670, homeCal: 560, protein: 15, minutes: 20, score: 90,
    diets: ['vegetarian', 'vegan'], tags: ['kid-friendly', 'quick'],
    ingredients: [
      i('Flour, sugar, baking powder, baking soda', '1 cup mix', 0.25, 'pantry'), i('Buttermilk', '¾ cup', 0.40, 'dairy'),
      i('Egg', '1', 0.25, 'dairy'), i('Butter', '2 tbsp', 0.30, 'dairy'), i('Syrup', '2 tbsp', 0.15, 'pantry'),
    ],
    steps: [
      'Whisk flour, 1 tbsp sugar, 1 tsp baking powder, ½ tsp baking soda and a pinch of salt.',
      'Whisk buttermilk, egg and 1 tbsp melted butter; stir into the dry mix until just combined (lumps are fine). Rest 5 minutes.',
      'Cook ⅓-cup portions on a buttered griddle at medium heat until bubbles pop, flip, cook 1 minute more.',
      'Stack with butter and warm syrup.',
    ],
    swaps: [['Vegan', 'Oat milk + 1 tbsp vinegar for buttermilk; flax egg; vegan butter.'], ['High protein', 'Swap ¼ cup flour for protein powder.']],
  },
  {
    id: 'egg-mcmuffin', restaurant: "McDonald's", item: 'Egg muffin sandwich', emoji: '🍳', category: 'Breakfast',
    restaurantPrice: 5.29, homePrice: 1.40, restaurantCal: 310, homeCal: 300, protein: 18, minutes: 10, score: 91,
    diets: ['vegetarian', 'vegan'], tags: ['quick', 'meal-prep'],
    ingredients: [
      i('English muffin', '1', 0.35, 'bakery'), i('Egg', '1', 0.25, 'dairy'), i('Canadian bacon', '1 slice', 0.55, 'protein'),
      i('American cheese', '1 slice', 0.20, 'dairy'), i('Butter', '1 tsp', 0.05, 'dairy'),
    ],
    steps: [
      'Toast and butter the English muffin.',
      'Crack the egg into a greased egg ring (or a canning lid) in a pan, break the yolk, add a splash of water and cover 2–3 minutes until set.',
      'Warm the Canadian bacon in the same pan 30 seconds per side.',
      'Stack muffin, cheese, egg, bacon, muffin. Wrap in foil 1 minute so the cheese melts.',
    ],
    swaps: [['Vegetarian', 'Skip the bacon; add sliced tomato.'], ['Vegan', 'Seasoned tofu round and vegan cheese.']],
  },
  {
    id: 'ihop-french-toast', restaurant: 'IHOP', item: 'French toast', emoji: '🍞', category: 'Breakfast',
    restaurantPrice: 9.99, homePrice: 1.60, restaurantCal: 620, homeCal: 480, protein: 16, minutes: 15, score: 88,
    diets: ['vegetarian', 'vegan'], tags: ['kid-friendly', 'quick'],
    ingredients: [
      i('Thick bread (brioche or Texas toast)', '3 slices', 0.60, 'bakery'), i('Eggs', '2', 0.50, 'dairy'), i('Milk', '⅓ cup', 0.15, 'dairy'),
      i('Vanilla, cinnamon, sugar', 'to taste', 0.15, 'pantry'), i('Butter + powdered sugar + syrup', 'to serve', 0.20, 'pantry'),
    ],
    steps: [
      'Whisk eggs, milk, 1 tsp sugar, vanilla, cinnamon and a pinch of salt.',
      'Soak each slice 10–15 seconds per side.',
      'Cook in butter over medium heat 2–3 minutes per side until golden and set in the middle.',
      'Dust with powdered sugar; serve with syrup.',
    ],
    swaps: [['Vegan', 'Batter of oat milk, banana and a spoon of flour; vegan butter.'], ['High protein', 'Add egg whites and a scoop of protein to the batter.']],
  },
  {
    id: 'avocado-toast', restaurant: 'First Watch', item: 'Avocado toast with eggs', emoji: '🥑', category: 'Breakfast',
    restaurantPrice: 12.49, homePrice: 2.60, restaurantCal: 620, homeCal: 470, protein: 20, minutes: 10, score: 89,
    diets: ['vegetarian', 'vegan'], tags: ['quick', 'lighter'],
    ingredients: [
      i('Thick multigrain bread', '2 slices', 0.50, 'bakery'), i('Avocado', '1', 1.10, 'produce'), i('Eggs', '2', 0.50, 'dairy'),
      i('Lemon, chili flakes, flaky salt', 'to taste', 0.20, 'produce'), i('Cherry tomatoes + arugula', 'handful', 0.30, 'produce'),
    ],
    steps: [
      'Toast the bread well so it holds up.',
      'Mash avocado with lemon juice, salt and chili flakes.',
      'Fry or poach the eggs until the whites set (yolks runny or cooked through, your choice).',
      'Spread avocado, top with eggs, halved tomatoes, arugula and flaky salt.',
    ],
    swaps: [['Vegan', 'Skip eggs; add white beans or seared tofu.']],
  },

  // ---------- Sandwiches ----------
  {
    id: 'italian-bmt', restaurant: 'Subway', item: 'Italian sub with salami, pepperoni and ham', emoji: '🥖', category: 'Sandwiches',
    restaurantPrice: 9.29, homePrice: 3.20, restaurantCal: 450, homeCal: 440, protein: 22, minutes: 10, score: 87,
    diets: ['vegetarian', 'vegan'], tags: ['quick', 'meal-prep'],
    ingredients: [
      i('Italian sub roll (6 inch)', '1', 0.55, 'bakery'), i('Genoa salami, pepperoni, ham', '3 oz total', 1.65, 'protein'),
      i('Provolone', '2 slices', 0.40, 'dairy'), i('Lettuce, tomato, onion, banana peppers', '1 serving', 0.45, 'produce'),
      i('Oil, red wine vinegar, oregano', 'drizzle', 0.15, 'pantry'),
    ],
    steps: [
      'Split the roll and toast it lightly with the provolone on top if you like it melty.',
      'Layer salami, pepperoni and ham.',
      'Add lettuce, tomato, onion and banana peppers.',
      'Drizzle oil and vinegar, sprinkle oregano, salt and pepper. Close and slice.',
    ],
    swaps: [['Vegetarian', 'Grilled veggies, fresh mozzarella and pesto.'], ['Vegan', 'Marinated tofu, hummus and all the veggies.']],
  },
  {
    id: 'philly-cheesesteak', restaurant: "Jersey Mike's", item: 'Philly cheesesteak', emoji: '🥖', category: 'Sandwiches',
    restaurantPrice: 12.45, homePrice: 4.75, restaurantCal: 750, homeCal: 640, protein: 40, minutes: 20, score: 88,
    diets: ['vegetarian', 'vegan'], tags: ['game-day', 'high-protein'],
    ingredients: [
      i('Shaved ribeye or sirloin', '5 oz', 2.90, 'protein'), i('Sub roll', '1', 0.55, 'bakery'), i('White American or provolone', '2 slices', 0.40, 'dairy'),
      i('Onion + green pepper', '¾ cup', 0.55, 'produce'), i('Mushrooms (optional)', '½ cup', 0.35, 'produce'),
    ],
    steps: [
      'Freeze the steak 20 minutes, then slice paper-thin (or buy shaved).',
      'Cook onions, peppers and mushrooms on a hot griddle 5 minutes; push aside.',
      'Sear the steak 2 minutes, chopping with two spatulas; season. Mix in the veggies.',
      'Lay cheese over the pile, cover 30 seconds to melt, then scoop into the toasted roll.',
    ],
    swaps: [['Vegetarian', 'Thin-sliced portobellos and peppers.'], ['Vegan', 'Seitan strips and vegan provolone.']],
  },
  {
    id: 'filet-o-fish', restaurant: "McDonald's", item: 'Fish sandwich with tartar sauce', emoji: '🐟', category: 'Seafood',
    restaurantPrice: 6.19, homePrice: 1.90, restaurantCal: 390, homeCal: 380, protein: 18, minutes: 20, score: 88,
    diets: ['vegetarian', 'vegan'], tags: ['kid-friendly', 'air-fryer'],
    ingredients: [
      i('Breaded pollock fillet', '1 (about 3 oz)', 1.15, 'frozen'), i('Soft bun', '1', 0.35, 'bakery'), i('American cheese', '½ slice', 0.10, 'dairy'),
      i('Mayo, relish, lemon, onion', 'tartar sauce', 0.30, 'pantry'),
    ],
    steps: [
      'Stir mayo, sweet relish, a little minced onion, lemon juice and salt for the tartar sauce.',
      'Air-fry or bake the fish per the package until crisp and 145°F.',
      'Steam the bun: wrap in a damp paper towel and microwave 10 seconds.',
      'Bun, tartar sauce, fish, half slice of cheese, top bun.',
    ],
    swaps: [['Vegetarian', 'Panko-crusted tofu "fish" with nori and lemon.'], ['Vegan', 'Same tofu, vegan mayo tartar.']],
  },

  // ---------- Desserts ----------
  {
    id: 'cheesecake', restaurant: 'The Cheesecake Factory', item: 'Original cheesecake (strawberry optional)', emoji: '🍰', category: 'Desserts',
    restaurantPrice: 10.95, homePrice: 1.65, restaurantCal: 830, homeCal: 480, protein: 8, minutes: 90, score: 87,
    diets: ['vegetarian'], tags: ['date-night', 'meal-prep'],
    ingredients: [
      i('Cream cheese', '4 oz (per 1/8 cake)', 0.75, 'dairy'), i('Graham crackers + butter', 'crust', 0.30, 'pantry'),
      i('Sugar, eggs, sour cream, vanilla', '1 serving', 0.40, 'dairy'), i('Strawberries (optional)', '¼ cup', 0.20, 'produce'),
    ],
    steps: [
      'Press 1½ cups graham crumbs mixed with 5 tbsp melted butter into a 9-inch springform. Bake 10 minutes at 350°F.',
      'Beat 2 lb room-temperature cream cheese with 1¼ cups sugar, then ½ cup sour cream, 2 tsp vanilla and 4 eggs one at a time, on low.',
      'Pour onto the crust and bake in a water bath at 325°F about 70 minutes, until the center barely wobbles. Cool in the oven with the door cracked 1 hour.',
      'Chill at least 6 hours. Top with sliced strawberries in a little sugar if you like. Makes 8 servings.',
    ],
    swaps: [['Lighter', 'Use Neufchâtel and Greek yogurt instead of sour cream.']],
  },
  {
    id: 'cinnamon-roll', restaurant: 'Cinnabon', item: 'Classic cinnamon roll', emoji: '🥐', category: 'Desserts',
    restaurantPrice: 5.99, homePrice: 0.95, restaurantCal: 880, homeCal: 520, protein: 8, minutes: 150, score: 86,
    diets: ['vegetarian', 'vegan'], tags: ['comfort', 'family'],
    ingredients: [
      i('Flour, yeast, sugar, salt', 'dough (per roll)', 0.25, 'pantry'), i('Milk, butter, egg', 'dough (per roll)', 0.30, 'dairy'),
      i('Brown sugar + cinnamon', 'filling', 0.15, 'pantry'), i('Cream cheese + powdered sugar', 'frosting', 0.25, 'dairy'),
    ],
    steps: [
      'Make a soft dough: 3½ cups flour, 2¼ tsp yeast, ¼ cup sugar, 1 cup warm milk, 1 egg, 5 tbsp butter, 1 tsp salt. Knead 8 minutes; rise 1 hour.',
      'Roll to 16×20 inches, spread with soft butter, then 1 cup brown sugar mixed with 2½ tbsp cinnamon.',
      'Roll up, cut into 8, place in a pan and rise 30 minutes. Bake at 375°F for 18–20 minutes.',
      'Beat cream cheese, butter, powdered sugar and vanilla; frost the rolls while warm. Makes 8.',
    ],
    swaps: [['Vegan', 'Oat milk, vegan butter, flax egg, vegan cream cheese frosting.']],
  },

  // ---------- Drinks ----------
  {
    id: 'iced-matcha', restaurant: 'Starbucks', item: 'Iced matcha latte', emoji: '🍵', category: 'Drinks',
    restaurantPrice: 5.95, homePrice: 1.10, restaurantCal: 200, homeCal: 150, protein: 8, minutes: 5, score: 88,
    diets: ['vegetarian', 'vegan'], tags: ['quick'],
    ingredients: [
      i('Matcha powder', '1½ tsp', 0.60, 'pantry'), i('Milk', '1 cup', 0.30, 'dairy'), i('Simple syrup or honey', '1 tbsp', 0.10, 'pantry'), i('Ice', '1 cup', 0.10, 'frozen'),
    ],
    steps: [
      'Whisk matcha with 2 tbsp warm (not boiling) water until smooth and frothy.',
      'Fill a glass with ice and milk, stir in the syrup.',
      'Pour the matcha over the top and stir.',
    ],
    swaps: [['Vegan', 'Oat or almond milk.']],
  },
  {
    id: 'dunkin-iced-caramel', restaurant: "Dunkin'", item: 'Iced caramel coffee', emoji: '🧋', category: 'Drinks',
    restaurantPrice: 4.79, homePrice: 0.75, restaurantCal: 260, homeCal: 150, protein: 3, minutes: 5, score: 89,
    diets: ['vegetarian', 'vegan'], tags: ['quick'],
    ingredients: [
      i('Strong brewed coffee, chilled', '1½ cups', 0.35, 'pantry'), i('Caramel syrup', '2 tbsp', 0.25, 'pantry'), i('Cream or milk', '3 tbsp', 0.15, 'dairy'),
    ],
    steps: [
      'Brew coffee double-strength and chill it (or use cold brew).',
      'Stir caramel syrup into the coffee until dissolved.',
      'Pour over a full glass of ice and add cream to taste.',
    ],
    swaps: [['Vegan', 'Oat milk and a dairy-free caramel.'], ['Lighter', 'Sugar-free caramel syrup.']],
  },

  // ---------- Sides ----------
  {
    id: 'cheddar-bay-biscuits', restaurant: 'Red Lobster', item: 'Cheddar garlic biscuits', emoji: '🧀', category: 'Sides',
    restaurantPrice: 4.99, homePrice: 0.90, restaurantCal: 320, homeCal: 300, protein: 7, minutes: 25, score: 89,
    diets: ['vegetarian'], tags: ['kid-friendly', 'quick'],
    ingredients: [
      i('Biscuit mix or flour + baking powder', '½ cup', 0.20, 'pantry'), i('Sharp cheddar', '¼ cup', 0.35, 'dairy'),
      i('Milk', '3 tbsp', 0.10, 'dairy'), i('Butter, garlic powder, parsley', 'topping', 0.25, 'dairy'),
    ],
    steps: [
      'Stir 2 cups biscuit mix, 1 cup shredded cheddar, ¾ cup cold milk and ½ tsp garlic powder into a soft dough.',
      'Drop ¼-cup scoops onto a lined sheet.',
      'Bake at 450°F for 10–12 minutes until golden.',
      'Brush with melted butter mixed with garlic powder and parsley while hot. Makes 10 (serving = 2).',
    ],
    swaps: [['Lighter', 'Half the butter brush; use reduced-fat cheddar.']],
  },
];
