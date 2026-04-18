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
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\AdminEmailNotificationController;
use App\Http\Controllers\Api\CheckController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AdminReportController;
use App\Http\Controllers\Api\AdminAffiliateController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\AiAnalyzeController;
use App\Http\Controllers\Api\AdminAiAnalyzeController;
use App\Http\Controllers\Api\DocumentSupportController;

// ========================
// PUBLIC
// ========================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/services/tree', [ServiceController::class, 'tree']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

Route::get('/external/services', [ExternalServiceController::class, 'getServices']);

Route::get('/notifications', [AdminDashboardController::class, 'userNotifications']);

// ========================
// PROTECTED (LOGIN)
// ========================
Route::middleware('auth:sanctum')->group(function () {

    // ===== AUTH =====
    Route::post('/logout', [AuthController::class, 'logout']);

    // ===== DASHBOARD =====
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ===== ACCOUNT =====
    Route::get('/account', [AccountController::class, 'me']);
    Route::put('/account/profile', [AccountController::class, 'updateProfile']);
    Route::put('/account/password', [AccountController::class, 'changePassword']);

    // ===== ORDERS =====
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/refresh-status', [OrderController::class, 'refreshStatus']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']);

    Route::post('/external/orders', [ExternalServiceController::class, 'createOrder']);

    // ===== WALLET =====
    Route::get('/wallet', [WalletController::class, 'index']);
    Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
    Route::post('/wallet/deposit', [WalletController::class, 'createDeposit']);

    // ========================
    // FEEDBACK (USER)
    // ========================
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::get('/feedback/history', [FeedbackController::class, 'history']);
    Route::get('/feedback/{id}', [FeedbackController::class, 'show']);

    // ========================
    // CHECK + REPORT
    // ========================
    Route::post('/check', [CheckController::class, 'check']);
    Route::post('/report', [ReportController::class, 'store']);
    Route::get('/report/history', [ReportController::class, 'history']);

    // ========================
    // REFERRAL
    // ========================
    Route::get('/referral/me', [ReferralController::class, 'myReferralData']);
    Route::post('/referral/apply-code', [ReferralController::class, 'applyReferralCode']);

    Route::post('/ai-analyze', [AiAnalyzeController::class, 'analyze']);

    Route::get('/document-support', [DocumentSupportController::class, 'index']);
    Route::post('/document-support', [DocumentSupportController::class, 'store']);
    Route::get('/document-support/{id}', [DocumentSupportController::class, 'show']);



    // ========================
    // ADMIN
    // ========================
    Route::prefix('admin')->group(function () {

        // ===== SERVICES =====
        Route::put('/external-services/{service}', [AdminExternalServiceController::class, 'update']);

        Route::get('/services', [AdminServiceController::class, 'index']);
        Route::post('/services', [AdminServiceController::class, 'store']);
        Route::get('/services/{service}', [AdminServiceController::class, 'show']);
        Route::put('/services/{service}', [AdminServiceController::class, 'update']);

        // ===== ORDERS =====
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::put('/orders/{order}', [AdminOrderController::class, 'update']);

        // ===== WALLET =====
        Route::get('/wallet/users', [AdminWalletController::class, 'users']);
        Route::get('/wallet/stats', [AdminWalletController::class, 'stats']);
        Route::post('/wallet/adjust', [AdminWalletController::class, 'adjust']);

        // ===== DASHBOARD =====
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/notifications', [AdminDashboardController::class, 'notifications']);
        Route::post('/notifications', [AdminDashboardController::class, 'storeNotification']);

        // ===== USERS =====
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);
        Route::patch('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        // ===== EMAIL =====
        Route::post('/email-notifications/send', [AdminEmailNotificationController::class, 'sendToAllUsers']);

        // ========================
        // ADMIN REPORT
        // ========================
        Route::get('/reports', [AdminReportController::class, 'index']);
        Route::get('/reports/{id}', [AdminReportController::class, 'show']);
        Route::patch('/reports/{id}/approve', [AdminReportController::class, 'approve']);
        Route::patch('/reports/{id}/reject', [AdminReportController::class, 'reject']);

        // ========================
        // ADMIN FEEDBACK
        // ========================
        Route::get('/feedback', [FeedbackController::class, 'index']);
        Route::patch('/feedback/{id}/status', [FeedbackController::class, 'updateStatus']);

        // ========================
        // AFFILIATE
        // ========================
        Route::get('/affiliate/overview', [AdminAffiliateController::class, 'overview']);
        Route::get('/affiliate/referrers', [AdminAffiliateController::class, 'referrers']);
        Route::get('/affiliate/referrals', [AdminAffiliateController::class, 'referrals']);
        Route::get('/affiliate/commissions', [AdminAffiliateController::class, 'commissions']);

        Route::get('/admin/ai-analyze', [AdminAiAnalyzeController::class, 'index']);

        Route::patch('/admin/document-support/{id}/status', [DocumentSupportController::class, 'updateStatus']);
        Route::delete('/admin/document-support/{id}', [DocumentSupportController::class, 'destroy']);
    });
});
