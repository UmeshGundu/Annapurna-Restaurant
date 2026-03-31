package com.annapurna.in.config;

import com.annapurna.in.entity.MenuItem;
import com.annapurna.in.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) {
        if (menuItemRepository.count() > 0) return; // seed only once

        List<MenuItem> items = List.of(
            // BIRYANI
            MenuItem.builder().name("Chicken Dum Biryani").price(150.0).category("Biryani")
                .description("Aromatic basmati rice layered with juicy chicken. Slow-cooked in dum style with rich spices.").build(),
            MenuItem.builder().name("Mutton Biryani").price(200.0).category("Biryani")
                .description("Tender mutton cooked with flavorful long-grain rice. Packed with traditional spices and deep aroma.").build(),
            MenuItem.builder().name("Egg Biryani").price(120.0).category("Biryani")
                .description("Boiled eggs blended with spicy masala rice. Simple, tasty and perfectly satisfying meal.").build(),
            MenuItem.builder().name("Veg Biryani").price(110.0).category("Biryani")
                .description("Fresh vegetables cooked with fragrant basmati rice. Light, healthy and full of flavor.").build(),
            MenuItem.builder().name("Paneer Biryani").price(140.0).category("Biryani")
                .description("Soft paneer cubes mixed with rich masala rice. Creamy texture with delicious spices.").build(),
            MenuItem.builder().name("Chilli Chicken Biryani").price(170.0).category("Biryani")
                .description("Spicy chilli chicken tossed with flavorful rice. A bold fusion of Indo-Chinese taste.").build(),
            MenuItem.builder().name("Kaju Biryani").price(150.0).category("Biryani")
                .description("Crunchy cashews blended with aromatic rice. Rich, nutty flavor with mild spices.").build(),
            MenuItem.builder().name("Ulavacharu Biryani").price(180.0).category("Biryani")
                .description("Traditional ulavacharu gravy mixed with rice. Authentic Andhra taste with tangy richness.").build(),
            MenuItem.builder().name("Fish Biryani").price(190.0).category("Biryani")
                .description("Fresh fish cooked with spiced basmati rice. Light, flavorful and coastal-style delight.").build(),
            MenuItem.builder().name("Prawn Biryani").price(220.0).category("Biryani")
                .description("Juicy prawns cooked in rich masala rice. Seafood lovers' favorite with bold flavor.").build(),

            // MEALS
            MenuItem.builder().name("Veg Meals").price(110.0).category("Meals")
                .description("Complete vegetarian meal with rice, dal, curries, roti, and pickle. Healthy and balanced.").build(),
            MenuItem.builder().name("Special Meals").price(140.0).category("Meals")
                .description("Deluxe combo with extra curries, sweets, and special dishes. Rich and filling experience.").build(),
            MenuItem.builder().name("Non Veg Meals").price(180.0).category("Meals")
                .description("Rice served with chicken or mutton curry, dal, and sides. A complete feast.").build(),
            MenuItem.builder().name("Mini Meals").price(90.0).category("Meals")
                .description("Light meal with rice, one curry, dal, and pickle. Perfect for quick hunger.").build(),
            MenuItem.builder().name("Paneer Meals").price(130.0).category("Meals")
                .description("Paneer curry served with rice, roti, and sides. Creamy and delicious.").build(),
            MenuItem.builder().name("Chicken Meals").price(170.0).category("Meals")
                .description("Chicken curry paired with rice, dal, and sides. Protein-rich and tasty.").build(),
            MenuItem.builder().name("Fish Meals").price(190.0).category("Meals")
                .description("Fish curry served with rice and traditional sides. Coastal flavor delight.").build(),
            MenuItem.builder().name("Mutton Meals").price(210.0).category("Meals")
                .description("Tender mutton curry with rice and sides. Rich and satisfying meal.").build(),

            // STARTERS
            MenuItem.builder().name("Gobi Manchurian").price(140.0).category("Starters")
                .description("Crispy cauliflower tossed in spicy Manchurian sauce. Perfect Indo-Chinese starter.").build(),
            MenuItem.builder().name("Paneer Chilli").price(160.0).category("Starters")
                .description("Fried paneer cubes cooked with capsicum and spicy sauces. Soft and flavorful.").build(),
            MenuItem.builder().name("Veg Manchurian").price(140.0).category("Starters")
                .description("Vegetable balls tossed in tangy Manchurian gravy. A classic veg starter.").build(),
            MenuItem.builder().name("Chicken Chilli").price(150.0).category("Starters")
                .description("Juicy chicken pieces stir-fried with spices and sauces. Spicy and delicious.").build(),
            MenuItem.builder().name("Chicken 65").price(150.0).category("Starters")
                .description("Deep-fried spicy chicken with curry leaves and masala. South Indian favorite.").build(),
            MenuItem.builder().name("Chicken Manchurian").price(150.0).category("Starters")
                .description("Chicken balls tossed in flavorful Manchurian sauce. Rich and tangy taste.").build(),
            MenuItem.builder().name("Chicken Garlic Bread").price(150.0).category("Starters")
                .description("Crispy bread topped with garlic butter and chicken. Crunchy and savory.").build(),
            MenuItem.builder().name("Chicken Lollipop").price(160.0).category("Starters")
                .description("Fried chicken wings shaped like lollipops. Crispy outside, juicy inside.").build(),
            MenuItem.builder().name("Mutton Chilli").price(180.0).category("Starters")
                .description("Spicy mutton pieces cooked with sauces and peppers. Bold and rich flavor.").build(),

            // TANDOORI
            MenuItem.builder().name("Tandoori Chicken Half").price(190.0).category("Tandoori")
                .description("Half chicken marinated in spices and grilled in tandoor. Smoky and juicy.").build(),
            MenuItem.builder().name("Tandoori Chicken Full").price(320.0).category("Tandoori")
                .description("Full chicken roasted in traditional tandoor. Rich smoky flavor.").build(),
            MenuItem.builder().name("Chicken Tikka").price(200.0).category("Tandoori")
                .description("Boneless chicken marinated and grilled. Soft, smoky and flavorful.").build(),
            MenuItem.builder().name("Kalmi Kebab").price(200.0).category("Tandoori")
                .description("Juicy chicken leg pieces marinated and grilled. Rich and tender taste.").build(),
            MenuItem.builder().name("Tangdi Kebab").price(210.0).category("Tandoori")
                .description("Spiced chicken drumsticks grilled to perfection. Smoky and juicy.").build(),
            MenuItem.builder().name("Chicken Seekh Kebab").price(190.0).category("Tandoori")
                .description("Minced chicken skewers grilled in tandoor. Soft and flavorful.").build(),
            MenuItem.builder().name("Paneer Tikka").price(180.0).category("Tandoori")
                .description("Paneer cubes grilled with spices and veggies. Smoky vegetarian delight.").build(),
            MenuItem.builder().name("Mushroom Tikka").price(170.0).category("Tandoori")
                .description("Juicy mushrooms marinated and grilled. Light and flavorful.").build(),

            // DESSERTS
            MenuItem.builder().name("Gulab Jamun").price(60.0).category("Desserts")
                .description("Soft fried dumplings soaked in sugar syrup. Sweet and classic dessert.").build(),
            MenuItem.builder().name("Rasmalai").price(80.0).category("Desserts")
                .description("Soft paneer discs soaked in creamy milk. Rich and delicious sweet.").build(),
            MenuItem.builder().name("Ice Cream").price(50.0).category("Desserts")
                .description("Chilled creamy ice cream. Perfect refreshing dessert.").build(),
            MenuItem.builder().name("Chocolate Cake").price(120.0).category("Desserts")
                .description("Moist chocolate cake with rich flavor. Perfect sweet treat.").build(),
            MenuItem.builder().name("Brownie").price(100.0).category("Desserts")
                .description("Soft chocolate brownie with fudgy texture. Rich and indulgent.").build(),
            MenuItem.builder().name("Cupcake").price(90.0).category("Desserts")
                .description("Mini cake topped with cream frosting. Sweet and delightful.").build(),

            // DRINKS
            MenuItem.builder().name("Coke").price(20.0).category("Drinks")
                .description("Chilled carbonated soft drink. Refreshing and fizzy.").build(),
            MenuItem.builder().name("Pepsi").price(40.0).category("Drinks")
                .description("Classic cola drink with refreshing taste.").build(),
            MenuItem.builder().name("Sprite").price(20.0).category("Drinks")
                .description("Lemon-lime flavored soft drink. Crisp and refreshing.").build(),
            MenuItem.builder().name("Thumbs Up").price(20.0).category("Drinks")
                .description("Strong cola with bold taste. Popular Indian favorite.").build(),
            MenuItem.builder().name("Lassi").price(30.0).category("Drinks")
                .description("Traditional yogurt-based drink. Cool and refreshing.").build(),
            MenuItem.builder().name("Buttermilk").price(30.0).category("Drinks")
                .description("Light spiced buttermilk. Perfect for digestion.").build()
        );

        menuItemRepository.saveAll(items);
        System.out.println("✅ Menu data seeded: " + items.size() + " items");
    }
}
