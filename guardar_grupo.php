<?php
$ruta = __DIR__ . "/datos";
if (!file_exists($ruta)) mkdir($ruta, 0777, true);

$datos = json_decode(file_get_contents("php://input"), true);
if (!isset($datos["curso"], $datos["fecha"], $datos["alumnos"])) {
  echo json_encode(["status"=>"error", "mensaje"=>"Faltan datos"]); exit;
}

$clave   = $datos["curso"] . " - " . $datos["fecha"];
$archivo = "$ruta/grupos.json";

$grupos = file_exists($archivo) ? json_decode(file_get_contents($archivo), true) : [];
$grupos[$clave] = $datos;

file_put_contents($archivo, json_encode($grupos, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
echo json_encode(["status"=>"ok"]);
?>

