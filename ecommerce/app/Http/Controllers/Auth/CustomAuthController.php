<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
    
        if (Auth::attempt($credentials)) {
            // Ha admin, irányítsa az admin dashboardra
            if (Auth::user()->role === 'admin') {
                return redirect()->intended('/admin');
            }
            // Ha sima felhasználó, irányítsa a profil oldalra
            return redirect()->intended('/profile');
        }
    
        return redirect()->back()->withErrors(['email' => 'Invalid credentials.']);
    }
    

    // Kijelentkezés
    public function logout()
    {
        Auth::logout();
        return redirect('/');
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

        Auth::login($user);

        return redirect('/profile');
    }
}

