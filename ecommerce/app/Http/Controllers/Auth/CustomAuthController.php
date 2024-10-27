<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class CustomAuthController extends Controller
{
    // Bejelentkezési oldal megjelenítése
    public function showLoginForm()
    {
        return view('auth.login');
    }

    // Bejelentkezés kezelése
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        
        // Ellenőrizzük a hitelesítési adatokat
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $user = Auth::user();
    
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'message' => 'Login successful!',
        ]);
    }
    

    // Kijelentkezés
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken()); // Invalidate the token
        return response()->json(['message' => 'Successfully logged out']);
    }

    // Regisztrációs oldal megjelenítése
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    // Regisztráció kezelése
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Regisztráció után azonnal bejelentkeztetjük a felhasználót és JWT-t adunk vissza
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'message' => 'Registration successful!',
        ]);
    }
}

