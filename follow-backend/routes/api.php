<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\ExternalServiceController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/services/tree', [ServiceController::class, 'tree']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

Route::prefix('external')->group(function () {
    Route::get('/services', [ExternalServiceController::class, 'getServices']);
    Route::post('/orders', [ExternalServiceController::class, 'createOrder']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/account', [AccountController::class, 'me']);
    Route::put('/account/profile', [AccountController::class, 'updateProfile']);
    Route::put('/account/password', [AccountController::class, 'changePassword']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    Route::get('/wallet', [WalletController::class, 'index']);
    Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
    Route::post('/wallet/deposit', [WalletController::class, 'createDeposit']);
});