<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments_', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); 
            $table->decimal('amount', 8, 2); 
            $table->string('payment_method'); 
            $table->string('status')->default('pending'); 
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments_');
    }
}
