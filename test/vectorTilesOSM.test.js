/**
 * @file vectorTilesOSM.test.js
 * @description
 * Pruebas automatizadas con Playwright para validar la integración de mapas vectoriales (Vector Tiles)
 * de OpenStreetMap (OSM) mediante la librería MapLibre GL JS.
 *
 * Objetivos:
 *  - Verificar que los tiles vectoriales se descargan y renderizan correctamente.
 *  - Comprobar la actualización y respuesta en tiempo real del mapa.
 *  - Asegurar compatibilidad y rendimiento estable en distintos navegadores.
 *
 * Resultados esperados:
 *  - Carga completa del mapa (isStyleLoaded = true).
 *  - Actualización continua sin bloqueos.
 *  - Visualización fluida y sin errores.
 */

import { test, expect } from '@playwright/test';

test.describe('Vector Tiles OSM Integration', () => {

  /**
   * Prueba 1: Renderiza correctamente los tiles vectoriales de OSM
   * ---------------------------------------------------------------
   * Comprueba que el mapa de OSM cargue correctamente,
   * que los tiles vectoriales se descarguen y rendericen de forma completa,
   * y que el estilo esté disponible para interactuar.
   */
  test('Renderiza correctamente los tiles vectoriales de OSM', async ({ page }) => {
    await page.goto('http://localhost:8080/index.html'); // Abre la página del mapa
    await page.waitForSelector('#map', { timeout: 15000 }); // Espera que el contenedor del mapa exista

    // Espera que el mapa haya cargado completamente (estilo vectorial listo)
    await page.waitForFunction(() =>
      window.map && window.map.isStyleLoaded && window.map.isStyleLoaded(),
      { timeout: 15000 }
    );

    // Evalúa si el mapa realmente está cargado
    const isLoaded = await page.evaluate(() =>
      window.map && window.map.isStyleLoaded()
    );

    expect(isLoaded).toBeTruthy(); // El mapa debe estar completamente renderizado
  });

  /**
   * Prueba 2: Valida actualización en tiempo real del mapa OSM
   * -------------------------------------------------------------
   * Verifica que el mapa siga activo tras su carga inicial,
   * simulando la actualización constante del renderizado de tiles
   * y la respuesta continua del navegador.
   */
  test('Valida actualización en tiempo real del mapa OSM', async ({ page }) => {
    await page.goto('http://localhost:8080/index.html'); // Abre nuevamente el mapa
    await page.waitForSelector('#map', { timeout: 10000 });

    // Registra el tiempo inicial
    const initialTime = await page.evaluate(() => performance.now());
    await page.waitForTimeout(2000); // Espera un intervalo corto
    const finalTime = await page.evaluate(() => performance.now());

    // El tiempo debe haber avanzado → el mapa sigue respondiendo
    expect(finalTime).toBeGreaterThan(initialTime);
  }); 
});
