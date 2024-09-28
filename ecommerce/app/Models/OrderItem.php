<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'product_id', 'quantity', 'price'];

    // Kapcsolat a rendeléshez
    public function order() {
        return $this->belongsTo(Order::class);
    }

    // Kapcsolat a termékhez
    public function product() {
        return $this->belongsTo(Product::class);
    }
    use HasFactory;
}
