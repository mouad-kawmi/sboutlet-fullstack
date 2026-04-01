<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminEmail = env('SEED_ADMIN_EMAIL');
        $adminPassword = env('SEED_ADMIN_PASSWORD');

        if (!$adminEmail || !$adminPassword) {
            $this->command?->warn(
                'Admin seeding skipped. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env if you want a local admin account.'
            );

            return;
        }

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => env('SEED_ADMIN_NAME', 'Admin SBOutlet'),
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
            ]
        );

        $this->command?->info("Local admin account seeded for {$adminEmail}.");
    }
}
