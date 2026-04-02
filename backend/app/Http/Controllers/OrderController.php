<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of orders (Admin only usually).
     */
    public function index()
    {
        $orders = Order::with('items.product')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created order (Checkout logic).
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_city' => 'required|string',
            'customer_address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $subtotal = 0;
                $itemsToCreate = [];

                foreach ($request->items as $itemData) {
                    $product = Product::lockForUpdate()->find($itemData['product_id']);

                    // Check stock
                    if ($product->stock < $itemData['quantity']) {
                        throw new \Exception("Product {$product->name} is out of stock.");
                    }

                    $price = $product->price;
                    $itemTotal = $price * $itemData['quantity'];
                    $subtotal += $itemTotal;

                    // Prepare items data
                    $itemsToCreate[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'price' => $price,
                        'quantity' => $itemData['quantity'],
                        'main_image' => $product->main_image,
                    ];
                }

                $shipping = 0; // You can add logic for shipping here
                $total = $subtotal + $shipping;

                // Create Order
                $order = Order::create([
                    'id' => 'CMD-' . strtoupper(Str::random(6)), // Unique ID CMD-XXXXXX
                    'user_id' => auth('sanctum')->id(), // If user is logged in
                    'customer_name' => $request->customer_name,
                    'customer_phone' => $request->customer_phone,
                    'customer_city' => $request->customer_city,
                    'customer_address' => $request->customer_address,
                    'subtotal' => $subtotal,
                    'shipping' => $shipping,
                    'total' => $total,
                    'status' => 'En attente',
                ]);

                // Create Order Items
                foreach ($itemsToCreate as $item) {
                    $order->items()->create($item);
                }

                return response()->json([
                    'message' => 'Order created successfully',
                    'order' => $order->load('items')
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified order.
     */
    public function show(string $id)
    {
        $order = Order::with('items.product')->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $user = request()->user();
        $isAdmin = $user && $user->role === 'admin';
        $isOwner = $user && $order->user_id === $user->id;

        if (!$isAdmin && !$isOwner) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        return response()->json($order);
    }

    /**
     * Update order status (Admin).
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate(['status' => 'required|in:En attente,Livré,Annulé']);

        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return DB::transaction(function () use ($request, $order) {
            $oldStatus = $order->status;
            $newStatus = $request->status;

            if ($oldStatus !== 'Livré' && $newStatus === 'Livré') {
                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    if ($product) {
                        $product->decrement('stock', $item->quantity);
                    }
                }
            }

            $order->update(['status' => $newStatus]);
            return response()->json(['message' => 'Order status updated', 'order' => $order]);
        });
    }
}
