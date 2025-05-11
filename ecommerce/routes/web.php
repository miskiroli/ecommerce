<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\CustomAuthController;
use Tymon\JWTAuth\Facades\JWTAuth;

// Bejelentkezés és regisztráció




// React alkalmazás útvonalak (SPA)
Route::get('/{any}', function () {
    return view('welcome'); // Ez a React alkalmazás
})->where('any', '.*'); // Az admin útvonal kivétele
