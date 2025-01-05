<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\CustomAuthController;
use Tymon\JWTAuth\Facades\JWTAuth;

// Bejelentkezés és regisztráció
Route::get('/register', [CustomAuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [CustomAuthController::class, 'register']);




// React alkalmazás útvonalak (SPA)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!admin).*'); // Az admin útvonal kivétele
