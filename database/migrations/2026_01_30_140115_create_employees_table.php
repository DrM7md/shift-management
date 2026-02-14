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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('status', ['متاح', 'إجازة مرضية', 'إجازة سنوية', 'غير متاح'])->default('متاح');
            $table->integer('saturday_order')->default(0);
            $table->integer('thursday_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->date('return_from_leave')->nullable();
            $table->enum('return_type', ['مناوبة', 'سنوية'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
