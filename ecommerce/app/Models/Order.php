<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'total_price', 'status'];

    // Kapcsolat a felhasználóhoz (egy rendelést egy felhasználó ad le)
    public function user() {
        return $this->belongsTo(User::class);
    }

    // Kapcsolat a rendelési tételekhez (egy rendeléshez több tétel tartozik)
    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }
    use HasFactory;
}
