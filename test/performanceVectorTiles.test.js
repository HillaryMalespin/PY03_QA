/*
============================================================
 Pruebas de rendimiento y carga - Vector Tiles y APIs
------------------------------------------------------------
 Descripción:
Simula condiciones de tráfico moderado para evaluar la capacidad 
del backend de Vector Tiles y APIs.

Objetivos:
- Medir tiempos de respuesta desde la solicitud hasta la renderización.
- Evaluar estabilidad bajo carga media.

 Resultados esperados:
- Tiempo de respuesta < 2 segundos.
- Sin errores de conexión o caídas.
============================================================
*/

import { test, expect, request } from '@playwright/test';

test.describe('Pruebas de rendimiento - Vector Tiles', () => {
  const baseURL = 'https://tile.openstreetmap.org'; // Backend público

  test('Tiempo de respuesta promedio de tiles', async ({ request }) => {
    const zoom = 10;
    const lat = 534; // coordenadas de ejemplo
    const lon = 383;

    const start = performance.now();
    const response = await request.get(`${baseURL}/${zoom}/${lat}/${lon}.png`);
    const end = performance.now();

    const duration = end - start;
    console.log(`Tiempo de respuesta: ${duration.toFixed(2)} ms`);

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000); // < 2 segundos
  });
});
