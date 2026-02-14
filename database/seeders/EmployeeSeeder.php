<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            'أحمد محمد',
            'خالد علي',
            'محمد عبدالله',
            'سعود فهد',
            'عبدالرحمن سالم',
            'فيصل ناصر',
            'ماجد سعد',
            'طارق إبراهيم',
            'سلطان عبدالعزيز',
            'يوسف حسن',
            'عمر خالد',
            'بدر محمود',
            'نايف أحمد',
            'تركي فهد',
            'راشد سليمان',
            'وليد عبدالله',
            'مشاري حمد',
            'عبدالله سعود',
            'حمد عبدالرحمن',
            'سامي يوسف',
        ];

        foreach ($employees as $index => $name) {
            $order = $index + 1;
            $nameParts = explode(' ', $name);
            $email = strtolower($nameParts[0]) . ($index + 1) . '@company.com';
            
            Employee::create([
                'name' => $name,
                'email' => $email,
                'status' => 'متاح',
                'saturday_order' => $order,
                'thursday_order' => $order,
                'is_active' => true,
            ]);
        }
    }
}
