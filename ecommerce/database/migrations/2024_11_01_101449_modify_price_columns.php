<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyPriceColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Módosítjuk a 'price' mezőt a 'products' táblában
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->change(); // Megnövelt méret
        });

        // Módosítjuk a 'price' mezőt az 'order_items' táblában
        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->change(); // Megnövelt méret
        });

        // Módosítjuk a 'total_price' mezőt az 'orders' táblában
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('total_price', 15, 2)->change(); // Megnövelt méret
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Visszaállítjuk a 'price' mezőt a 'products' táblában
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 8, 2)->change(); // Eredeti méret
        });

        // Visszaállítjuk a 'price' mezőt az 'order_items' táblában
        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('price', 8, 2)->change(); // Eredeti méret
        });

        // Visszaállítjuk a 'total_price' mezőt az 'orders' táblában
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('total_price', 8, 2)->change(); // Eredeti méret
        });
    }
}
