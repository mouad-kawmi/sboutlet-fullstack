<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('images');

        // Filter by category
        if ($request->has('category') && $request->category !== 'Tous' && $request->category !== 'undefined') {
            $query->where('category', $request->category);
        }

        // Filter by price
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Stock filter (default: only in stock)
        if ($request->get('in_stock', 'true') === 'true') {
            $query->where('stock', '>', 0);
        }

        // Return all or Paginate (10 per page)
        $query->orderBy('created_at', 'desc');

        if ($request->has('all')) {
            return $query->get();
        }

        return $query->paginate(10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'brand' => 'nullable|string',
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'category' => 'nullable|string',
            'condition_status' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'details' => 'nullable|string',
            'design' => 'nullable|string',
            'size' => 'nullable|string',
            'main_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'images' => 'nullable|array',
        ]);

        $mainImagePath = str_replace('\\', '/', $request->file('main_image')->store('products', 'public'));
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // We'll store them in the database below
            }
        }

        $product = Product::create(
            [
                'brand' => $request->brand,
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'old_price' => $request->old_price,
                'discount' => $request->discount ?? 0,
                'category' => $request->category ?? 'Non spécifié',
                'condition_status' => $request->condition_status ?? 'Excellent État',
                'stock' => $request->stock ?? 1,
                'details' => $request->details,
                'design' => $request->design,
                'size' => $request->size,
                'main_image' => $mainImagePath,
            ]
        );
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePath = str_replace('\\', '/', $image->store('products', 'public'));
                $product->images()->create(['image_url' => $imagePath]);
            }
        }

        return response()->json($product->load('images'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('images')->find($id);
        if ($product) {
            return response()->json($product);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'brand' => 'nullable|string',
            'name' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0|max:100',
            'category' => 'nullable|string',
            'condition_status' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'details' => 'nullable|string',
            'design' => 'nullable|string',
            'size' => 'nullable|string',
            'main_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'images' => 'nullable|array',
        ]);

        // Use only() to get specific fields for the products table
        $data = $request->only([
            'brand',
            'name',
            'description',
            'price',
            'old_price',
            'discount',
            'category',
            'condition_status',
            'stock',
            'details',
            'design',
            'size'
        ]);

        if (isset($data['discount']) && $data['discount'] === null) {
            $data['discount'] = 0;
        }

        if ($request->hasFile('main_image')) {
            // Delete old main image if exists
            if ($product->main_image && !\Str::startsWith($product->main_image, 'http')) {
                \Storage::disk('public')->delete($product->main_image);
            }
            $data['main_image'] = str_replace('\\', '/', $request->file('main_image')->store('products', 'public'));
        } elseif ($request->main_image_clear === 'true') {
            if ($product->main_image && !\Str::startsWith($product->main_image, 'http')) {
                \Storage::disk('public')->delete($product->main_image);
            }
            $data['main_image'] = ''; // Or a placeholder
        }

        $product->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('products', 'public');
                $product->images()->create(['image_url' => $imagePath]);
            }
        }

        return response()->json($product->load('images'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::with('images')->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Delete Main Image file
        if ($product->main_image) {
            \Storage::disk('public')->delete($product->main_image);
        }

        // Delete Gallery files
        foreach ($product->images as $image) {
            \Storage::disk('public')->delete($image->image_url);
        }

        $product->delete();

        return response()->json(['message' => 'Product and its images deleted successfully']);
    }

    /**
     * Remove a specific image from the gallery.
     */
    public function deleteImage(string $id)
    {
        $image = \App\Models\ProductImage::find($id);
        if (!$image) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        // Delete from storage
        \Storage::disk('public')->delete($image->image_url);

        // Delete from database
        $image->delete();

        return response()->json(['message' => 'Gallery image deleted successfully']);
    }
}
