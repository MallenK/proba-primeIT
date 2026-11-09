<?php


namespace App\Http\Controllers;

use App\Services\TvMazeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Exception;


class TvShowController extends Controller
{
    protected TvMazeService $tvMazeService;

    public function __construct(TvMazeService $tvMazeService)
    {
        $this->tvMazeService = $tvMazeService;
    }


    /**
     * Search for TV shows based on a query.
     *  Endpoint: GET /api/shows/search?q={query}
     * @param Request $request
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        $query = trim($request->query('q', ''));

        if (!$query) {
            log::warning('Query parameter "q" is missing in the search request');
            return response()->json([
            'success' => false, 
            'error' => 'Query parameter "q" is required', 
            'data' => []
            ],400);
        }

        try {

            $rawResults = $this->tvMazeService->searchShows($query);

            $shows = array_map(function ($item) {
                return $item['show'] ?? $item;
            }, $rawResults);

            log::info("--TVSHOWCONTROLLER--  Shows encontrados para la consulta: {$query}");
            return response()->json([
                'success' => true,
                 'data' => $shows
                 ], 200);
        } catch (Exception $e) {
            Log::error('Error en TvShowController: ' . $e->getMessage());

            $statusCode = $e->getCode() ?: 500;
            return response()->json([
                'success' => false,
                'error' => 'Error al buscar shows'
            ], $statusCode);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $showDetails = $this->tvMazeService->getShowDetails($id);
            
            log::info("--TVSHOWCONTROLLER--  Detalles del show con ID: {$id} obtenidos correctamente");
            log::info("--TVSHOWCONTROLLER--  Detalles del show: " . json_encode($showDetails));

            return response()->json([
                'success' => true,
                'data' => $showDetails
            ], 200);

        } catch (Exception $e) {
            Log::error('Error en TvShowController: ' . $e->getMessage());
            $statusCode = $e->getCode() ?: 500;
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener detalles del show'
            ], $statusCode);
        }
    }

    public function cast(int $id): JsonResponse
    {
        try {
            $castDetails = $this->tvMazeService->getShowCast($id);
            
            log::info("--TVSHOWCONTROLLER--  Reparto del show con ID: {$id} obtenido correctamente");
            log::info("--TVSHOWCONTROLLER--  Reparto del show: " . json_encode($castDetails));

            return response()->json([
                'success' => true,
                'data' => $castDetails
            ], 200);

        } catch (Exception $e) {
            Log::error('Error en TvShowController: ' . $e->getMessage());
            $statusCode = $e->getCode() ?: 500;
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener reparto del show'
            ], $statusCode);
        }
    }





    public function seasons(int $id): JsonResponse
    {
        try {
            $seasonsDetails = $this->tvMazeService->getShowSeasons($id);
            
            log::info("--TVSHOWCONTROLLER--  Temporadas del show con ID: {$id} obtenidas correctamente");
            log::info("--TVSHOWCONTROLLER--  Temporadas del show: " . json_encode($seasonsDetails));

            return response()->json([
                'success' => true,
                'data' => $seasonsDetails
            ], 200);

        } catch (Exception $e) {
            Log::error('Error en TvShowController: ' . $e->getMessage());
            $statusCode = $e->getCode() ?: 500;
            return response()->json([
                'success' => false,
                'error' => 'Error al obtener temporadas del show'
            ], $statusCode);
        }
    }
}

?> 