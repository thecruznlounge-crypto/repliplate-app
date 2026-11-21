// RepliPlate built-in clone library. Works fully offline.
// Prices are typical US menu prices (2026) vs. estimated grocery cost per serving.
// aisle: produce | protein | dairy | pantry | bakery | frozen

export const AISLES = {
  produce: 'Produce',
  protein: 'Meat & protein',
  dairy: 'Dairy & eggs',
  bakery: 'Bread & bakery',
  pantry: 'Pantry',
  frozen: 'Frozen',
};

export const CATEGORIES = ['Bowls', 'Burgers', 'Chicken', 'Pasta', 'Asian', 'Mexican', 'Soups', 'Drinks'];

const i = (name, qty, cost, aisle) => ({ name, qty, cost, aisle });

export const MEALS = [
  {
    id: 'chipotle-bowl', restaurant: 'Chipotle', item: 'Chicken burrito bowl', emoji: '🥣', category: 'Bowls',
    restaurantPrice: 13.95, homePrice: 4.82, restaurantCal: 980, homeCal: 690, protein: 48, minutes: 30, score: 91,
    diets: ['vegetarian', 'vegan'], tags: ['meal-prep', 'high-protein'],
    ingredients: [
      i('Chicken thighs', '6 oz', 1.85, 'protein'), i('Long-grain rice', '1 cup cooked', 0.42, 'pantry'),
      i('Black beans', '½ cup', 0.38, 'pantry'), i('Frozen corn', '⅓ cup', 0.44, 'frozen'),
      i('Romaine lettuce', '1 cup', 0.45, 'produce'), i('Shredded Monterey Jack', '¼ cup', 0.38, 'dairy'),
      i('Limes', '1', 0.35, 'produce'), i('Cilantro', 'small handful', 0.25, 'produce'), i('Chipotle in adobo', '1 tbsp', 0.30, 'pantry'),
    ],
    steps: [
      'Blend 1 chipotle pepper with garlic, cumin, oregano, oil, and salt. Coat the chicken and rest 15 minutes.',
      'Cook rice, then fold in lime zest, lime juice, and chopped cilantro.',
      'Grill or sear chicken over high heat 5–6 minutes per side until charred. Rest, then dice.',
      'Char the corn in a dry skillet and toss with red onion, lime, and a pinch of salt.',
      'Build the bowl: rice, beans, chicken, corn salsa, lettuce, and cheese.',
    ],
    swaps: [
      ['Vegan', 'Crumble firm tofu into the chipotle marinade and pan-fry it for a sofritas-style filling.'],
      ['Vegetarian', 'Swap the chicken for fajita peppers and onions plus extra beans.'],
      ['Lighter', 'Half rice, double lettuce, skip the cheese — about 480 calories.'],
    ],
  },
  {
    id: 'big-mac', restaurant: "McDonald's", item: 'Double burger with special sauce', emoji: '🍔', category: 'Burgers',
    restaurantPrice: 11.49, homePrice: 3.76, restaurantCal: 870, homeCal: 640, protein: 34, minutes: 20, score: 88,
    diets: ['vegetarian', 'vegan'], tags: ['kid-friendly', 'quick'],
    ingredients: [
      i('Ground beef 80/20', '4 oz', 1.40, 'protein'), i('Sesame burger buns', '1 + 1 heel', 0.62, 'bakery'),
      i('American cheese', '1 slice', 0.32, 'dairy'), i('Iceberg lettuce', '½ cup', 0.20, 'produce'),
      i('Dill pickle chips', '4', 0.18, 'pantry'), i('White onion', '2 tbsp minced', 0.10, 'produce'),
      i('Mayonnaise', '2 tbsp', 0.30, 'pantry'), i('Sweet relish', '1 tbsp', 0.14, 'pantry'),
    ],
    steps: [
      'Stir mayo, relish, mustard, vinegar, garlic powder, and paprika for the sauce. Chill.',
      'Divide beef into two thin 2 oz patties. Season with salt and pepper.',
      'Smash onto a very hot skillet for 90 seconds, flip, add cheese to one patty, cook 30 seconds more.',
      'Toast the bun pieces. Stack heel, sauce, lettuce, onion, cheese patty, middle bun, sauce, pickles, patty, top.',
    ],
    swaps: [
      ['Vegan', 'Plant-based patties, vegan cheese, and egg-free mayo in the sauce.'],
      ['Vegetarian', 'Use black bean or plant-based patties.'],
      ['Lighter', 'Lettuce-wrap it and use light mayo — about 420 calories.'],
    ],
  },
  {
    id: 'cfa-sandwich', restaurant: 'Chick-fil-A', item: 'Crispy chicken sandwich', emoji: '🥪', category: 'Chicken',
    restaurantPrice: 9.65, homePrice: 3.88, restaurantCal: 720, homeCal: 590, protein: 38, minutes: 35, score: 87,
    diets: ['vegetarian'], tags: ['kid-friendly', 'air-fryer'],
    ingredients: [
      i('Chicken breast', '1 filet', 1.80, 'protein'), i('Brioche buns', '1', 0.55, 'bakery'),
      i('Dill pickle chips', '4', 0.18, 'pantry'), i('All-purpose flour', '½ cup', 0.12, 'pantry'),
      i('Powdered sugar', '1 tbsp', 0.05, 'pantry'), i('Eggs', '1', 0.35, 'dairy'),
      i('Milk', '¼ cup', 0.12, 'dairy'), i('Peanut oil', 'for frying', 0.71, 'pantry'),
    ],
    steps: [
      'Brine the filet in pickle juice for at least 1 hour (overnight is best).',
      'Whisk egg and milk. Mix flour, powdered sugar, paprika, salt, and pepper.',
      'Dip the chicken in egg wash, then press into the seasoned flour.',
      'Fry in peanut oil at 350°F for 4 minutes per side, or air-fry at 400°F for 12 minutes, flipping once.',
      'Toast the buttered bun and add pickles and chicken.',
    ],
    swaps: [
      ['Vegetarian', 'Brine and bread thick-cut king oyster mushrooms the same way.'],
      ['Lighter', 'Grill the brined filet instead of frying — about 410 calories.'],
    ],
  },
  {
    id: 'orange-chicken', restaurant: 'Panda Express', item: 'Orange chicken with rice', emoji: '🍊', category: 'Asian',
    restaurantPrice: 12.80, homePrice: 4.35, restaurantCal: 1110, homeCal: 760, protein: 36, minutes: 30, score: 84,
    diets: ['vegetarian', 'vegan'], tags: ['family', 'kid-friendly'],
    ingredients: [
      i('Chicken thighs', '6 oz', 1.95, 'protein'), i('Orange juice', '⅓ cup', 0.40, 'dairy'),
      i('Soy sauce', '2 tbsp', 0.15, 'pantry'), i('Rice vinegar', '1 tbsp', 0.10, 'pantry'),
      i('Fresh ginger', '1 tsp', 0.10, 'produce'), i('Long-grain rice', '1 cup cooked', 0.35, 'pantry'),
      i('Broccoli', '1 cup', 0.85, 'produce'), i('Cornstarch', '3 tbsp', 0.15, 'pantry'),
    ],
    steps: [
      'Cut chicken into bite-size pieces and toss with cornstarch and a pinch of salt.',
      'Pan-fry or air-fry until crisp and golden, about 10 minutes.',
      'Simmer orange juice, zest, soy, vinegar, brown sugar, garlic, and ginger until glossy and thick.',
      'Toss the chicken in the sauce and serve over rice with steamed broccoli.',
    ],
    swaps: [
      ['Vegan', 'Use pressed, cornstarch-coated tofu or cauliflower florets.'],
      ['Lighter', 'Air-fry and use half the sauce — about 540 calories.'],
    ],
  },
  {
    id: 'alfredo', restaurant: 'Olive Garden', item: 'Chicken fettuccine alfredo', emoji: '🍝', category: 'Pasta',
    restaurantPrice: 18.99, homePrice: 5.94, restaurantCal: 1320, homeCal: 860, protein: 52, minutes: 25, score: 86,
    diets: ['vegetarian', 'vegan'], tags: ['comfort', 'date-night'],
    ingredients: [
      i('Fettuccine', '3 oz dry', 0.42, 'pantry'), i('Chicken breast', '5 oz', 1.75, 'protein'),
      i('Parmesan', '⅓ cup grated', 1.15, 'dairy'), i('Heavy cream', '⅓ cup', 0.76, 'dairy'),
      i('Butter', '1 tbsp', 0.20, 'dairy'), i('Garlic', '2 cloves', 0.28, 'produce'), i('Broccoli', '1 cup', 0.85, 'produce'),
    ],
    steps: [
      'Boil fettuccine in well-salted water until al dente. Save ½ cup of pasta water.',
      'Season and sear chicken 5–6 minutes per side. Rest and slice.',
      'Melt butter, sizzle garlic 30 seconds, add cream and simmer 2 minutes.',
      'Off the heat, whisk in parmesan and a splash of pasta water until silky.',
      'Toss the pasta in the sauce and top with chicken.',
    ],
    swaps: [
      ['Vegan', 'Blend soaked cashews, nutritional yeast, garlic, and lemon for the sauce; top with roasted mushrooms.'],
      ['Vegetarian', 'Skip the chicken and double the broccoli and mushrooms.'],
      ['Lighter', 'Use evaporated milk instead of cream — about 620 calories.'],
    ],
  },
  {
    id: 'crunchwrap', restaurant: 'Taco Bell', item: 'Crunchwrap supreme', emoji: '🌯', category: 'Mexican',
    restaurantPrice: 7.29, homePrice: 2.64, restaurantCal: 530, homeCal: 480, protein: 22, minutes: 20, score: 85,
    diets: ['vegetarian', 'vegan'], tags: ['kid-friendly', 'quick'],
    ingredients: [
      i('Large flour tortillas', '1 + 1 small', 0.55, 'bakery'), i('Ground beef 80/20', '3 oz', 1.05, 'protein'),
      i('Tostada shells', '1', 0.15, 'pantry'), i('Nacho cheese sauce', '2 tbsp', 0.30, 'pantry'),
      i('Sour cream', '1 tbsp', 0.12, 'dairy'), i('Roma tomatoes', '¼', 0.15, 'produce'), i('Iceberg lettuce', '¼ cup', 0.12, 'produce'),
      i('Taco seasoning', '1 tsp', 0.20, 'pantry'),
    ],
    steps: [
      'Brown beef with taco seasoning and a splash of water.',
      'Warm the large tortilla. Layer cheese sauce, beef, tostada, sour cream, lettuce, and tomato in the center.',
      'Cover the center with a small tortilla piece, then fold the edges in pleats over it.',
      'Toast seam-side down in a dry skillet 2 minutes per side until crisp.',
    ],
    swaps: [
      ['Vegan', 'Seasoned lentils or plant crumbles, cashew queso, and dairy-free sour cream.'],
      ['Vegetarian', 'Refried beans in place of beef.'],
    ],
  },
  {
    id: 'canes', restaurant: "Raising Cane's", item: 'Chicken fingers with Cane’s-style sauce', emoji: '🍗', category: 'Chicken',
    restaurantPrice: 12.49, homePrice: 4.10, restaurantCal: 1250, homeCal: 820, protein: 50, minutes: 40, score: 83,
    diets: [], tags: ['kid-friendly', 'family'],
    ingredients: [
      i('Chicken tenderloins', '4 pieces', 2.10, 'protein'), i('Buttermilk', '½ cup', 0.35, 'dairy'),
      i('All-purpose flour', '¾ cup', 0.15, 'pantry'), i('Mayonnaise', '3 tbsp', 0.40, 'pantry'),
      i('Ketchup', '1½ tbsp', 0.10, 'pantry'), i('Texas toast', '1 slice', 0.40, 'bakery'), i('Coleslaw mix', '1 cup', 0.60, 'produce'),
    ],
    steps: [
      'Soak tenders in buttermilk with salt and garlic powder for 30 minutes.',
      'Dredge in seasoned flour, press firmly, and rest 5 minutes.',
      'Fry at 350°F for 5–6 minutes until 165°F inside.',
      'Stir mayo, ketchup, lots of black pepper, garlic powder, and a dash of Worcestershire for the sauce.',
      'Serve with buttered, griddled Texas toast and slaw.',
    ],
    swaps: [['Lighter', 'Air-fry at 400°F for 12 minutes and use light mayo — about 560 calories.']],
  },
  {
    id: 'cava-falafel', restaurant: 'Cava', item: 'Falafel crunch bowl', emoji: '🧆', category: 'Bowls',
    restaurantPrice: 14.25, homePrice: 4.40, restaurantCal: 790, homeCal: 640, protein: 21, minutes: 35, score: 82,
    diets: ['vegetarian', 'vegan'], tags: ['meal-prep', 'plant-based'],
    ingredients: [
      i('Canned chickpeas', '1 can (for 3)', 0.40, 'pantry'), i('Parsley', '½ bunch', 0.45, 'produce'),
      i('Hummus', '3 tbsp', 0.60, 'dairy'), i('Cucumber', '½', 0.40, 'produce'), i('Cherry tomatoes', '½ cup', 0.65, 'produce'),
      i('Brown rice', '1 cup cooked', 0.35, 'pantry'), i('Pickled red onion', '2 tbsp', 0.20, 'pantry'),
      i('Tahini', '1 tbsp', 0.35, 'pantry'), i('Pita chips', 'small handful', 0.40, 'pantry'), i('Lemons', '½', 0.30, 'produce'),
    ],
    steps: [
      'Pulse chickpeas, parsley, garlic, cumin, coriander, and 2 tbsp flour until coarse. Chill 15 minutes.',
      'Shape into small patties and bake at 425°F for 20 minutes, flipping halfway.',
      'Whisk tahini, lemon, garlic, and water into a pourable dressing.',
      'Build: rice, hummus, cucumber-tomato salad, falafel, pickled onion, pita chips, and dressing.',
    ],
    swaps: [['High protein', 'Add a scoop of lentils or swap rice for quinoa.']],
  },
  {
    id: 'harvest-bowl', restaurant: 'Sweetgreen', item: 'Harvest bowl', emoji: '🥗', category: 'Bowls',
    restaurantPrice: 15.95, homePrice: 5.15, restaurantCal: 705, homeCal: 620, protein: 33, minutes: 35, score: 84,
    diets: ['vegetarian', 'vegan'], tags: ['meal-prep', 'lighter'],
    ingredients: [
      i('Chicken breast', '4 oz', 1.40, 'protein'), i('Sweet potato', '1 small', 0.60, 'produce'),
      i('Kale', '1½ cups', 0.70, 'produce'), i('Wild rice', '½ cup cooked', 0.55, 'pantry'),
      i('Apple', '½', 0.40, 'produce'), i('Goat cheese', '1 oz', 0.70, 'dairy'),
      i('Toasted almonds', '2 tbsp', 0.45, 'pantry'), i('Balsamic vinegar', '1 tbsp', 0.35, 'pantry'),
    ],
    steps: [
      'Roast cubed sweet potato at 425°F for 25 minutes.',
      'Roast or grill seasoned chicken, then slice.',
      'Massage kale with a pinch of salt and a drizzle of oil.',
      'Whisk balsamic, olive oil, Dijon, and honey.',
      'Toss kale and wild rice with dressing; top with sweet potato, apple, chicken, goat cheese, and almonds.',
    ],
    swaps: [
      ['Vegan', 'Roasted tofu instead of chicken, skip the goat cheese, and use maple in the dressing.'],
      ['Vegetarian', 'Swap chicken for a jammy egg or roasted chickpeas.'],
    ],
  },
  {
    id: 'lettuce-wraps', restaurant: "P.F. Chang's", item: 'Chicken lettuce wraps', emoji: '🥬', category: 'Asian',
    restaurantPrice: 14.50, homePrice: 4.20, restaurantCal: 630, homeCal: 450, protein: 35, minutes: 20, score: 89,
    diets: ['vegetarian', 'vegan'], tags: ['quick', 'lighter', 'high-protein'],
    ingredients: [
      i('Ground chicken', '6 oz', 1.80, 'protein'), i('Butter lettuce', '½ head', 0.90, 'produce'),
      i('Water chestnuts', '¼ can', 0.40, 'pantry'), i('Shiitake mushrooms', '3', 0.50, 'produce'),
      i('Hoisin sauce', '1 tbsp', 0.20, 'pantry'), i('Soy sauce', '1 tbsp', 0.10, 'pantry'), i('Green onions', '2', 0.30, 'produce'),
    ],
    steps: [
      'Stir together hoisin, soy, rice vinegar, sesame oil, and a little sugar.',
      'Brown chicken in a very hot wok, breaking it into small bits.',
      'Add garlic, ginger, mushrooms, and water chestnuts and cook 2 minutes.',
      'Pour in the sauce, toss until glossy, and finish with green onions.',
      'Spoon into chilled lettuce cups.',
    ],
    swaps: [
      ['Vegan', 'Use finely chopped firm tofu and extra mushrooms.'],
      ['Vegetarian', 'Same as vegan — tofu and mushrooms.'],
    ],
  },
  {
    id: 'wingstop', restaurant: 'Wingstop', item: 'Lemon pepper wings', emoji: '🍋', category: 'Chicken',
    restaurantPrice: 16.99, homePrice: 5.60, restaurantCal: 900, homeCal: 720, protein: 54, minutes: 50, score: 86,
    diets: ['vegetarian'], tags: ['game-day', 'air-fryer', 'high-protein'],
    ingredients: [
      i('Chicken wings', '10 pieces', 4.20, 'protein'), i('Baking powder', '1 tsp', 0.05, 'pantry'),
      i('Butter', '2 tbsp', 0.40, 'dairy'), i('Lemon pepper seasoning', '1 tbsp', 0.35, 'pantry'),
      i('Lemons', '½', 0.30, 'produce'), i('Celery', '2 stalks', 0.30, 'produce'),
    ],
    steps: [
      'Pat wings very dry and toss with baking powder and salt.',
      'Air-fry at 380°F for 20 minutes, flip, then 400°F for 6 minutes until crackly.',
      'Melt butter with lemon pepper and a squeeze of lemon.',
      'Toss hot wings in the butter and dust with more seasoning.',
    ],
    swaps: [['Vegetarian', 'Same treatment on battered, baked cauliflower florets.']],
  },
  {
    id: 'broccoli-cheddar', restaurant: 'Panera', item: 'Broccoli cheddar soup', emoji: '🍲', category: 'Soups',
    restaurantPrice: 9.29, homePrice: 2.35, restaurantCal: 360, homeCal: 330, protein: 14, minutes: 35, score: 90,
    diets: ['vegetarian', 'vegan'], tags: ['comfort', 'meal-prep'],
    ingredients: [
      i('Broccoli', '1 cup chopped', 0.85, 'produce'), i('Carrots', '1 small', 0.15, 'produce'),
      i('Sharp cheddar', '¾ cup shredded', 0.80, 'dairy'), i('Half-and-half', '½ cup', 0.35, 'dairy'),
      i('Vegetable broth', '1 cup', 0.30, 'pantry'), i('Butter', '1 tbsp', 0.20, 'dairy'), i('White onion', '¼', 0.10, 'produce'),
    ],
    steps: [
      'Melt butter, soften onion, then whisk in 2 tbsp flour for 1 minute.',
      'Slowly whisk in half-and-half and broth and simmer until thickened.',
      'Add broccoli and matchstick carrots and simmer 20 minutes.',
      'Off the heat, stir in cheddar a handful at a time. Season with nutmeg, salt, and pepper.',
    ],
    swaps: [['Vegan', 'Oat milk, vegan butter, and a cashew-nutritional yeast "cheddar."']],
  },
  {
    id: 'frappuccino', restaurant: 'Starbucks', item: 'Caramel frappuccino', emoji: '☕', category: 'Drinks',
    restaurantPrice: 6.75, homePrice: 1.42, restaurantCal: 420, homeCal: 260, protein: 5, minutes: 5, score: 82,
    diets: ['vegetarian', 'vegan'], tags: ['quick'],
    ingredients: [
      i('Cold brew concentrate', '¾ cup', 0.45, 'dairy'), i('Milk', '½ cup', 0.25, 'dairy'),
      i('Caramel sauce', '2 tbsp', 0.35, 'pantry'), i('Xanthan gum', 'pinch', 0.02, 'pantry'), i('Whipped cream', '2 tbsp', 0.35, 'dairy'),
    ],
    steps: [
      'Blend coffee, milk, 1 tbsp caramel, a pinch of xanthan gum, and 2 cups of ice until smooth.',
      'Pour and top with whipped cream and a caramel drizzle.',
    ],
    swaps: [
      ['Vegan', 'Oat milk and coconut whip.'],
      ['High protein', 'Blend in a scoop of vanilla protein powder.'],
    ],
  },
];

export const byId = id => MEALS.find(m => m.id === id);
