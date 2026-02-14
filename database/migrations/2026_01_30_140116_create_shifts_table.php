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
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->date('shift_date');
            $table->string('day_name');
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('substitute_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->enum('status', ['مجدول', 'أتم', 'غائب', 'بديل'])->default('مجدول');
            $table->time('start_time')->default('13:00');
            $table->time('end_time');
            $table->boolean('has_extra_day')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique('shift_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
