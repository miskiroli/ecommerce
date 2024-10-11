<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    protected $fillable = ['name', 'description', 'price', 'stock', 'category_id', 'images'];
    protected $casts = [
        'images' => 'array',
    ];
    // Kapcsolat a kategóriához (egy termék egy kategóriához tartozik)
    public function category() {
        return $this->belongsTo(Category::class);

    }
    use HasFactory;
}


