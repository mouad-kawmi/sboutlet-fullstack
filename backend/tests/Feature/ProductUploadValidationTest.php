<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductUploadValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_cannot_create_product_with_svg_main_image(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/products', [
            'name' => 'Test product',
            'description' => 'Test description',
            'price' => 100,
            'main_image' => UploadedFile::fake()->create('product.svg', 20, 'image/svg+xml'),
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['main_image']);
    }

    public function test_admin_cannot_update_product_with_svg_gallery_image(): void
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
            'images' => [
                UploadedFile::fake()->create('gallery.svg', 20, 'image/svg+xml'),
            ],
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['images.0']);
    }
}
