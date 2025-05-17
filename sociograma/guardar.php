<?php
// obtener el JSON enviado por fetch()
$datos = file_get_contents('php://input');
if (!$datos) {
  http_response_code(400);
  echo "Sin datos";
  exit;
}

// decodificar y redecodificar para validar
$json = json_decode($datos, true);
if (json_last_error() !== JSON_ERROR_NONE) {
  http_response_code(400);
  echo "JSON inválido";
  exit;
}

// archivo donde acumularemos todas las respuestas
$archivo = 'respuestas.json';
$todo = [];

// si ya existe, leemos lo anterior
if (file_exists($archivo)) {
  $todo = json_decode(file_get_contents($archivo), true) ?? [];
}

// añadimos el nuevo
$todo[] = $json;

// guardamos de nuevo
file_put_contents($archivo, json_encode($todo, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "OK";
