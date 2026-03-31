<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\ExternalServiceController;
use App\Http\Controllers\Api\AdminServiceController;
use App\Http\Controllers\Api\AdminWalletController; 
use App\Http\Controllers\Api\AdminExternalServiceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminUserController;
// Public

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/services/tree', [ServiceController::class, 'tree']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

Route::get('/external/services', [ExternalServiceController::class, 'getServices']);

Route::get('/notifications', [AdminDashboardController::class, 'userNotifications']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/account', [AccountController::class, 'me']);
    Route::put('/account/profile', [AccountController::class, 'updateProfile']);
    Route::put('/account/password', [AccountController::class, 'changePassword']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    Route::post('/external/orders', [ExternalServiceController::class, 'createOrder']);

    Route::get('/wallet', [WalletController::class, 'index']);
    Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
    Route::post('/wallet/deposit', [WalletController::class, 'createDeposit']);

    Route::prefix('admin')->group(function () {
        Route::put('/external-services/{service}', [AdminExternalServiceController::class, 'update']);

        Route::get('/services/{service}', [AdminServiceController::class, 'show']);
        Route::put('/services/{service}', [AdminServiceController::class, 'update']);

        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::put('/orders/{order}', [AdminOrderController::class, 'update']);

        Route::get('/wallet/users', [AdminWalletController::class, 'users']);
        Route::get('/wallet/stats', [AdminWalletController::class, 'stats']);
        Route::post('/wallet/adjust', [AdminWalletController::class, 'adjust']);

        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/notifications', [AdminDashboardController::class, 'notifications']);
        Route::post('/notifications', [AdminDashboardController::class, 'storeNotification']);


        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);
        Route::patch('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
    });
});
