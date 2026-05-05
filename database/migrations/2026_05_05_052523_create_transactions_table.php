<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Illuminate\Database\Schema\Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->decimal('amount', 15, 2);
    $table->enum('type', ['in', 'out']); // 'in' for inflow, 'out' for cash advances
    $table->string('date');
    $table->foreignId('user_id')->constrained(); // Links to the employee
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
