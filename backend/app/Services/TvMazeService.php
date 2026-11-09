<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;


class TvMazeService
{
    protected string $baseUrl = 'https://api.tvmaze.com';
    
    /** 
     * Aislamos la logica de cominicacion con la API de TVMaze en un servicio para mantener el controlador limpio.
     * Endpoint: GET /search/shows?q={query}
     * 
     * @param string $query
     * @return array
     * @throws Exception
     */

    public function searchShows(string $query): array
    {
        log::info("--TVMAZESERVICES--  Buscando shows en TVMaze con query: {$query}");
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/search/shows", [
                'q' => $query,
            ]);

            if ($response->failed()) {
                throw new Exception('Error al comunicarse con la API de TVMaze');
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Error en TvMazeService: ' . $e->getMessage());
            throw new Exception('Error al buscar shows en TVMaze');
        }
    }



    /**
     * Obtiene los detalles de un show específico por su ID.
     * Endpoint: GET /api/shows/{id}
     * 
     * @param int $id
     * @return array
     * @throws Exception
     */
    public function getShowDetails(int $id): array
    {
        log::info("--TVMAZESERVICES--  Obteniendo detalles del show con ID: {$id}");

        $response = Http::timeout(5)->get("{$this->baseUrl}/shows/{$id}");
        
        if ($response->notFound()) {
            log::error("--TVMAZESERVICES--  Error al obtener detalles del show con ID: {$id}");
            throw new Exception('Error al comunicarse con la API de TVMaze');
        }

        if ($response->failed()) {
            log::error("--TVMAZESERVICES--  Error al obtener detalles del show con ID: {$id}");
            throw new Exception('Error al comunicarse con la API de TVMaze');
        }

        return $response->json();
    }
    

    public function getShowCast(int $id): array
    {
        log::info("--TVMAZESERVICES--  Obteniendo reparto del show con ID: {$id}");

        $response = Http::timeout(5)->get("{$this->baseUrl}/shows/{$id}/cast");
        
        if ($response->notFound()) {
            log::error("--TVMAZESERVICES--  Error al obtener reparto del show con ID: {$id}");
            throw new Exception('Error al comunicarse con la API de TVMaze');
        }

        if ($response->failed()) {
            log::error("--TVMAZESERVICES--  Error al obtener reparto del show con ID: {$id}");
            throw new Exception('Error al comunicarse con la API de TVMaze');
        }

        return $response->json();
    }



    public function getShowSeasons(int $id): array
    {
        log::info("--TVMAZESERVICES--  Obteniendo temporadas del show con ID: {$id}");

        $response = Http::timeout(5)->get("{$this->baseUrl}/shows/{$id}/seasons");
        
        if ($response->notFound()) {
            log::error("--TVMAZESERVICES--  Error al obtener temporadas del show con ID: {$id}");
            throw new Exception('Error al comunicarse con la API de TVMaze');
        }

        if ($response->failed()) {
            log::error("--TVMAZESERVICES--  Error al obtener temporadas del show con ID: {$id}");
            throw new Exception('Error al comunicarse con la API de TVMaze');
        }

        return $response->json();


    }

}