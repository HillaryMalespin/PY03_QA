# Pruebas Playwright - OpenStreetMap Vector Tiles

## Descripción
Este proyecto implementa un conjunto de **pruebas automatizadas con Playwright** para verificar la integración, rendimiento y edición de datos utilizando la **API de OpenStreetMap (OSM)**.  
Incluye validaciones sobre tiles vectoriales, autenticación OAuth2 y pruebas de rendimiento.

---

## 1. Inicializa el proyecto

Si aún no tienes un archivo `package.json`, inicializa el proyecto con:

```bash
npm init -y
```

## 2. Instala Playwright y dependencias necesarias

```bash
npm install -D @playwright/test
npx playwright install
```

## 3. Para ejecutar los test se debe ejecutar los siguientes comandos

Para levantar la api:
```bash
npx http-server . -p 8080
```  

y para ejecutar los archivos de prueba el siguiente comando el la terminal:

npx playwright test test/nombre del archivo.test.js
ejemplo:
```bash
npx playwright test test/vectorTilesOSM.test.js
```




