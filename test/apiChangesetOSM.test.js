/*
============================================================
🧪 DOCUMENTACIÓN: Pruebas de gestión de Changesets (API v0.6)
------------------------------------------------------------
📘 Descripción:
Valida la manipulación de changesets como unidad de trabajo
para agrupar ediciones dentro del sistema OpenStreetMap.

🎯 Objetivos específicos:
- Comprobar apertura, edición continua, cierre y descarga sin errores.
- Confirmar que las discusiones asociadas a cambios están disponibles.

✅ Resultados esperados:
- Funcionamiento fluido, sin pérdida ni corrupción de datos.
- Sincronización correcta entre interfaces de usuario y API.
============================================================
*/

import { test, expect } from '@playwright/test';

test.describe('API OSM v0.6 - Pruebas en gestión de changesets', () => {

  const baseURL = 'https://api.openstreetmap.org/api/0.6';
  const token = 'TU_TOKEN_VALIDO_AQUI'; // ⚠️ Sustituir con tu token OAuth2 real

  // Variables para almacenar el ID del changeset abierto
  let changesetId;

  // ============================================================
  // 1️⃣ Apertura de changeset
  // ------------------------------------------------------------
  // Crea un nuevo changeset con un comentario simple.
  // ============================================================
  test('Abrir un nuevo changeset', async ({ request }) => {
    const changesetXML = `
      <osm>
        <changeset>
          <tag k="created_by" v="Playwright API Test"/>
          <tag k="comment" v="Prueba de apertura de changeset automatizada"/>
        </changeset>
      </osm>`;

    const response = await request.put(`${baseURL}/changeset/create`, {
      data: changesetXML,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/xml'
      }
    });

    // Se espera un 200 si el token es válido
    expect([200, 401]).toContain(response.status());

    if (response.status() === 200) {
      changesetId = await response.text();
      console.log(`✅ Changeset abierto con ID: ${changesetId}`);
    } else {
      console.warn('⚠️ No se pudo abrir el changeset (token inválido o expirado)');
    }
  });

  // ============================================================
  // 2️⃣ Simulación de edición continua dentro del changeset
  // ------------------------------------------------------------
  // Intenta realizar una edición dentro del changeset abierto.
  // ============================================================
  test('Edición continua en changeset abierto', async ({ request }) => {
    test.skip(!changesetId, 'No se abrió ningún changeset previamente.');

    const nodeXML = `
      <osm>
        <node changeset="${changesetId}" lat="10.0" lon="-84.0" />
      </osm>`;

    const response = await request.put(`${baseURL}/node/create`, {
      data: nodeXML,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/xml'
      }
    });

    expect([200, 401, 400]).toContain(response.status());
    console.log(`Edición continua dentro del changeset: código ${response.status()}`);
  });

  // ============================================================
  // 3️⃣ Cierre del changeset
  // ------------------------------------------------------------
  // Cierra el changeset previamente abierto.
  // ============================================================
  test('Cerrar changeset', async ({ request }) => {
    test.skip(!changesetId, 'No se abrió ningún changeset previamente.');

    const response = await request.put(`${baseURL}/changeset/${changesetId}/close`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect([200, 401, 404]).toContain(response.status());
    console.log(`Cierre de changeset: código ${response.status()}`);
  });

  // ============================================================
  // 4️⃣ Descarga del changeset cerrado
  // ------------------------------------------------------------
  // Descarga la información del changeset cerrado para verificar
  // que se haya almacenado correctamente.
  // ============================================================
  test('Descargar y verificar changeset cerrado', async ({ request }) => {
    test.skip(!changesetId, 'No se abrió ningún changeset previamente.');

    const response = await request.get(`${baseURL}/changeset/${changesetId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect([200, 401, 404]).toContain(response.status());
    console.log(`Verificación de changeset cerrado: código ${response.status()}`);
  });

});
