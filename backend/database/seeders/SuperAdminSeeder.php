<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = "superadmin@example.com";
        
        // Check if super admin already exists
        $existing = User::where('email', $email)->first();
        if ($existing) {
            $this->command->info('Super admin already exists.');
            return;
        }

        // Create super admin
        User::create([
            'name' => 'Super Admin',
            'email' => $email,
            'password' => Hash::make('SuperAdmin123!'),
            'role' => 'SUPER_ADMIN',
            'active' => true,
        ]);

        $this->command->info('Super admin created successfully.');
        $this->command->info('Email: ' . $email);
        $this->command->info('Password: SuperAdmin123!');
    }
}
