<?php

use App\Http\Controllers\TvShowController;
use Illuminate\Support\Facades\Route;

Route::prefix('shows')->group(function () {
    Route::get('/search', [TvShowController::class, 'search']); // Endpoint de búsqueda por texto (?q=nombre)
    Route::get('/{id}', [TvShowController::class, 'show']);       // Endpoint de detalle por ID numérico
    Route::get('/{id}/cast', [TvShowController::class, 'cast']);   // Endpoint de reparto por ID numérico
    Route::get('/{id}/seasons', [TvShowController::class, 'seasons']); // Endpoint de temporadas por ID numérico
});