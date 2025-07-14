<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Carbon;
use App\Models\Customer;
use App\Models\LoanApplication;
use App\Models\LoanRepayment;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\DashboardController;

Route::apiResource('users', UserController::class);
Route::apiResource('tasks', TaskController::class);


Route::middleware('auth:sanctum')->get('/dashboard-summary', [DashboardController::class, 'summary']);


