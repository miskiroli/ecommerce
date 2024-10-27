<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\CustomAuthController;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;


// Web Routes for Views
Route::get('/login', [CustomAuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [CustomAuthController::class, 'login']); 
Route::post('/logout', [CustomAuthController::class, 'logout'])->name('logout');
Route::get('/register', [CustomAuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [CustomAuthController::class, 'register']);




// API Route for Logout
Route::post('/api/logout', function (Request $request) {
    JWTAuth::invalidate(JWTAuth::getToken()); 
    return response()->json(['message' => 'Logged out'], 200);
});

// Admin Routes
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/products', [AdminController::class, 'products'])->name('admin.products.index');
    Route::get('/admin/products/create', [AdminController::class, 'createProduct'])->name('admin.products.create');
    Route::post('/admin/products', [AdminController::class, 'storeProduct'])->name('admin.products.store');
    Route::get('/admin/products/{product}/edit', [AdminController::class, 'editProduct'])->name('admin.products.edit');
    Route::put('/admin/products/{product}', [AdminController::class, 'updateProduct'])->name('admin.products.update');
    Route::delete('/admin/products/{product}', [AdminController::class, 'destroyProduct'])->name('admin.products.destroy');
    Route::get('/admin/users', [AdminController::class, 'users'])->name('admin.users.index');
});


Route::get('/', function () {
    return view('welcome');
});
Route::get('/{any}', function () {
    return view('welcome'); 
})->where('any', '^(?!admin).*');
