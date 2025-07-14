<?php


use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\DashboardController;

Route::apiResource('users', UserController::class);
Route::apiResource('tasks', TaskController::class);


Route::middleware('auth:sanctum')->get('/dashboard-summary', [DashboardController::class, 'summary']);


