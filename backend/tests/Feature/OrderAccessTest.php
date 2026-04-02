<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_owner_can_view_their_order(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $order = Order::create([
            'id' => 'CMD-OWNER1',
            'user_id' => $user->id,
            'customer_name' => 'Owner User',
            'customer_phone' => '0600000000',
            'customer_city' => 'Casablanca',
            'customer_address' => 'Rue test',
            'subtotal' => 100,
            'shipping' => 0,
            'total' => 100,
            'status' => 'En attente',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/orders/{$order->id}");

        $response
            ->assertOk()
            ->assertJsonPath('id', $order->id);
    }

    public function test_non_admin_cannot_view_another_users_order(): void
    {
        $owner = User::factory()->create(['role' => 'customer']);
        $otherUser = User::factory()->create(['role' => 'customer']);
        $order = Order::create([
            'id' => 'CMD-OTHER1',
            'user_id' => $owner->id,
            'customer_name' => 'Owner User',
            'customer_phone' => '0600000000',
            'customer_city' => 'Casablanca',
            'customer_address' => 'Rue test',
            'subtotal' => 100,
            'shipping' => 0,
            'total' => 100,
            'status' => 'En attente',
        ]);

        Sanctum::actingAs($otherUser);

        $response = $this->getJson("/api/orders/{$order->id}");

        $response
            ->assertForbidden()
            ->assertJson(['message' => 'Access denied.']);
    }

    public function test_admin_can_view_any_order(): void
    {
        $owner = User::factory()->create(['role' => 'customer']);
        $admin = User::factory()->create(['role' => 'admin']);
        $order = Order::create([
            'id' => 'CMD-ADMIN1',
            'user_id' => $owner->id,
            'customer_name' => 'Owner User',
            'customer_phone' => '0600000000',
            'customer_city' => 'Casablanca',
            'customer_address' => 'Rue test',
            'subtotal' => 100,
            'shipping' => 0,
            'total' => 100,
            'status' => 'En attente',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson("/api/orders/{$order->id}");

        $response
            ->assertOk()
            ->assertJsonPath('id', $order->id);
    }
}
