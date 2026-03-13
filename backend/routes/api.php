<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth Routes
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

// Public Products Routes
Route::get('products', [\App\Http\Controllers\ProductController::class, 'index']);
Route::get('products/{id}', [\App\Http\Controllers\ProductController::class, 'show']);

// Public Order (Checkout)
Route::post('orders', [\App\Http\Controllers\OrderController::class, 'store']);

// Protected Routes (Logged in users)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [\App\Http\Controllers\AuthController::class, 'me']);
    Route::put('/profile', [\App\Http\Controllers\AuthController::class, 'updateProfile']);
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    // User can see their own order (Optional logic needed in controller later if we want security)
    Route::get('orders/{id}', [\App\Http\Controllers\OrderController::class, 'show']);

    // Admin Only Routes
    Route::middleware('admin')->group(function () {
        // Product Management
        Route::post('products', [\App\Http\Controllers\ProductController::class, 'store']);
        Route::put('products/{id}', [\App\Http\Controllers\ProductController::class, 'update']);
        Route::delete('products/{id}', [\App\Http\Controllers\ProductController::class, 'destroy']);
        Route::delete('products/images/{id}', [\App\Http\Controllers\ProductController::class, 'deleteImage']);

        // Order Management
        Route::get('orders', [\App\Http\Controllers\OrderController::class, 'index']);
        Route::patch('orders/{id}/status', [\App\Http\Controllers\OrderController::class, 'updateStatus']);
    });
});
