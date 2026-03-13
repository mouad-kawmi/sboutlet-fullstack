<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Femme', 'Homme', 'Enfants', 'Accessoires'];
        $brands = ['Dior', 'Louis Vuitton', 'Gucci', 'Prada', 'Hermès', 'Saint Laurent', 'Givenchy', 'Balenciaga'];
        $conditions = ['Neuf avec étiquette', 'Excellent état', 'Très bon état'];

        $images = [
            'Femme' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
            'Homme' => 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=1000&auto=format&fit=crop',
            'Enfants' => 'https://images.unsplash.com/photo-1519235106638-30cc49b4f434?q=80&w=1000&auto=format&fit=crop',
            'Accessoires' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'
        ];

        for ($i = 1; $i <= 30; $i++) {
            $cat = $categories[array_rand($categories)];
            $brand = $brands[array_rand($brands)];

            $product = Product::create([
                'name' => "$brand " . ($cat === 'Accessoires' ? 'Sac d\'exception' : 'Pièce Heritage') . " #$i",
                'brand' => $brand,
                'price' => rand(5, 80) * 100, // 500 to 8000 DH
                'old_price' => rand(100, 150) * 100,
                'category' => $cat,
                'condition_status' => $conditions[array_rand($conditions)],
                'stock' => 1,
                'description' => "Une pièce authentique de la maison $brand, sélectionnée pour son allure intemporelle et sa qualité exceptionnelle. Parfait pour un style sophistiqué.",
                'details' => "Matière noble, coupe ajustée.",
                'design' => "Classique $brand",
                'size' => "Standard",
                'discount' => rand(0, 1) ? rand(10, 30) : 0,
                'main_image' => $images[$cat]
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $images[$cat]
            ]);
        }
    }
}
