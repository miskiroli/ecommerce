<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['name' => 'TV'],
            ['name' => 'Watch'],
            ['name' => 'Phone'],
            ['name' => 'Laptop'],
            ['name' => 'Camera'],
            ['name' => 'Tablet'],
            ['name' => 'Headphones'],
            ['name' => 'Fridge'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
