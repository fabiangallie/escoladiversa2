<?php
// Establecer cabecera de respuesta como JSON
header("Content-Type: application/json");

// Obtener los datos JSON enviados desde el frontend
$datos = json_decode(file_get_contents("php://input"), true);

// Verificar que llegaron correctamente los campos necesarios
if (!isset($datos['grupo']) || !isset($datos['alumno']) || !isset($datos['elecciones'])) {
    echo json_encode(["status" => "error", "mensaje" => "Faltan datos."]);
    exit;
}

// Crear carpeta resultados si no existe
if (!file_exists("resultados")) {
    mkdir("resultados", 0777, true);
}

// Crear nombre de archivo único por fecha y hora
$nombreArchivo = "resultados/respuestas_" . date("Ymd_His") . ".json";

// Guardar los datos en archivo JSON
file_put_contents($nombreArchivo, json_encode($datos, JSON_PRETTY_PRINT));

// Actualizar o crear el índice de resultados
$indexFile = "index_resultados.json";
$indice = [];

if (file_exists($indexFile)) {
    $indice = json_decode(file_get_contents($indexFile), true);
}

$indice[] = $nombreArchivo;
file_put_contents($indexFile, json_encode($indice, JSON_PRETTY_PRINT));

// Devolver respuesta al frontend
echo json_encode(["status" => "ok", "archivo" => $nombreArchivo]);
?>
