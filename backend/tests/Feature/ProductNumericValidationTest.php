<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductNumericValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_cannot_create_product_with_negative_numeric_values(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/products', [
            'name' => 'Produit test',
            'description' => 'Description test',
            'price' => -10,
            'old_price' => -5,
            'discount' => -1,
            'stock' => -2,
            'main_image' => UploadedFile::fake()->create('product.jpg', 20, 'image/jpeg'),
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['price', 'old_price', 'discount', 'stock']);
    }

    public function test_admin_cannot_update_product_with_discount_above_one_hundred(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $product = Product::create([
            'brand' => 'Brand',
            'name' => 'Test product',
            'description' => 'Test description',
            'price' => 100,
            'old_price' => null,
            'discount' => 0,
            'category' => 'Homme',
            'condition_status' => 'Excellent Etat',
            'stock' => 1,
            'main_image' => 'products/test.jpg',
            'details' => null,
            'design' => null,
            'size' => null,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/products/{$product->id}", [
            'discount' => 150,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['discount']);
    }
}
