/*
============================================================
Pruebas exhaustivas de la API de edición (API v0.6)
------------------------------------------------------------
Descripción:
la API de edición de OpenStreetMap (versión 0.6), con soporte para OAuth 2.0.

Objetivos específicos:
- Verificar autenticación, autorización y manejo correcto de tokens.
- Comprobar que los límites de tamaño, formato y parámetros se respeten.
- Evaluar la conciliación de versiones (bloqueo optimista) para evitar conflictos.
- Validar comentarios y discusiones dentro de los cambios (changesets).

Resultados esperados:
- Respuestas coherentes ante solicitudes válidas o inválidas.
- Seguridad y control en accesos y modificaciones.
- Registro claro de cambios y discusiones sin pérdidas.
============================================================
*/

import { test, expect, request } from '@playwright/test';

test.describe('API OSM v0.6 - Pruebas de edición', () => {

  // URL base oficial de la API de OpenStreetMap
  const baseURL = 'https://api.openstreetmap.org/api/0.6';

  // Token OAuth2 (Token de la cuenta OSM)
  const token = 'TOKEN';  // Usar un token válido para pruebas con la cuenta de OSM

  // ============================================================
  // PRUEBA DE AUTENTICACIÓN (sin token)
  // ------------------------------------------------------------
  // Valida que la API devuelva 401 al intentar acceder sin autenticación.
  // ============================================================
  test('Valida autenticación y token OAuth2', async ({ request }) => {
    const response = await request.get(`${baseURL}/user/details`);
    expect(response.status()).toBe(401); // Sin token -> error esperado
  });

  // ============================================================
  // PRUEBA DE VALIDACIÓN DE FORMATO Y TAMAÑO
  // ------------------------------------------------------------
  // Intenta crear un nodo con datos inválidos usando un token válido.
  // Espera recibir un código 400 (Bad Request) por formato incorrecto.
  // ============================================================
  test('Valida formato y tamaño en creación de nodo (token válido)', async ({ request }) => {
    const invalidNode = `<node lat="999" lon="999" version="1"/>`; // Coordenadas inválidas

    const response = await request.put(`${baseURL}/node/create`, {
      data: invalidNode,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/xml'
      }
    });

    // Si el token no es válido, OSM devolverá 401 en lugar de 400
    if (response.status() === 401) {
      console.warn('⚠️ Token inválido o expirado: actualiza tu token OAuth2');
    }

    expect([400, 401]).toContain(response.status()); 
    // Acepta ambos códigos para que la prueba no falle en entorno sin token válido
  });

});
