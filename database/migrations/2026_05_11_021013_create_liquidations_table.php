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
    Schema::create('liquidations', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('user_id')->nullable()->after ('id');
    $table->string('employee');
    $table->string('purpose');
    $table->decimal('amount', 10, 2);
    $table->string('status')->default('pending');
    $table->string('date');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('liquidations');
    }
};
