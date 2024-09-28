<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = ['order_id', 'amount', 'payment_method', 'status'];

    // Kapcsolat a rendeléshez
    public function order() {
        return $this->belongsTo(Order::class);
    }
    use HasFactory;
}
