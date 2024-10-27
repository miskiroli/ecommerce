<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/products', [ProductController::class, 'apiIndex']);
Route::get('/products/{id}', [ProductController::class, 'apiShow']);
Route::get('/categories', [CategoryController::class, 'apiIndex']);

Route::middleware('auth:api')->group(function () {
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'remove']);


    Route::post('/order', [OrderController::class, 'create']);

});
Route::get('/check-login', function (Request $request) {
    return response()->json(['name' => $request->user()->name]);
})->middleware('auth:api');