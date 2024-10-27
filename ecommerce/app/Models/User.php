<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject; // Importáld a JWTSubject interfészt

class User extends Authenticatable implements JWTSubject // Implementáld a JWTSubject interfészt
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // A JWT azonosító lekérdezése
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Visszaadja a felhasználó azonosítóját (id)
    }

    // Egyéni JWT igények
    public function getJWTCustomClaims()
    {
        return []; // Itt adhatók meg egyéni igények, ha szükséges
    }
}
