<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\CustomAuthController;

// API bejelentkezés és kijelentkezés
Route::post('/login', [CustomAuthController::class, 'login']);
Route::post('/logout', [CustomAuthController::class, 'logout'])->middleware('auth:api');

// Bejelentkezés ellenőrzése
Route::middleware('auth:api')->get('/check-login', [CustomAuthController::class, 'checkLogin']);
Route::middleware(['auth:api', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [ProfileController::class, 'getAdminDashboard']);
    Route::get('/admin/users', [ProfileController::class, 'listUsers']);
    Route::get('/admin/products', [ProfileController::class, 'listProducts']);
    Route::post('/admin/products', [ProfileController::class, 'storeProduct']);
    Route::get('/admin/products/{product}', [ProfileController::class, 'editProduct']);
    Route::put('/admin/products/{product}', [ProfileController::class, 'updateProduct']);
    Route::delete('/admin/products/{product}', [ProfileController::class, 'destroyProduct']);
});
// Profilkezelés
Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);
    Route::get('/profile/address', [ProfileController::class, 'getAddress']);
    Route::put('/profile/address', [ProfileController::class, 'updateAddress']);
    Route::get('/profile/orders', [ProfileController::class, 'orderHistory']);
});

// Termékek és kategóriák
Route::get('/products', [ProductController::class, 'apiIndex']);
Route::get('/products/{id}', [ProductController::class, 'apiShow']);
Route::get('/categories', [CategoryController::class, 'apiIndex']);

// Kosár és rendelés útvonalak
Route::middleware('auth:api')->group(function () {
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'remove']);
    Route::post('/order', [OrderController::class, 'create']);
    Route::get('/orders/{orderId}/products', [OrderController::class, 'getOrderProducts']);
});
