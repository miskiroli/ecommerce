<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = ['user_id', 'product_id', 'quantity'];

    // Kapcsolat a felhasználóhoz
    public function user() {
        return $this->belongsTo(User::class);
    }

    // Kapcsolat a termékhez
    public function product() {
        return $this->belongsTo(Product::class);
    }
    use HasFactory;
}
