<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = ['user_id', 'address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country'];

    // Kapcsolat a felhasználóhoz
    public function user() {
        return $this->belongsTo(User::class);
    }
    use HasFactory;
}
