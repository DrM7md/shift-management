<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'مدير النظام',
            'email' => 'admin@company.com',
            'password' => Hash::make('password'),
        ]);

        $this->call([
            EmployeeSeeder::class,
        ]);
    }
}
