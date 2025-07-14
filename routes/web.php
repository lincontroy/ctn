<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->get('/dashboard-summary', [DashboardController::class, 'summary']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('users', function () {
        return Inertia::render('customers');
    })->name('customers');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('tasks', function () {
        return Inertia::render('tasks');
    })->name('tasks');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('loanApplications', function () {
        return Inertia::render('loanApplications');
    })->name('loanApplications');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('approvedApplications', function () {
        return Inertia::render('ApprovedLoans');
    })->name('approvedApplication');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('pendingApplications', function () {
        return Inertia::render('PendingLoans');
    })->name('pendingApplications');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('loanRepayments', function () {
        return Inertia::render('LoanRepayments');
    })->name('loanRepayments');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
