// enviar.js
function recopilarDatosSociograma() {
  const nombre = localStorage.getItem("nombreAlumno") || "Desconocido";
  const respuestas = {
    alumno: nombre,
    pregunta1: JSON.parse(localStorage.getItem("respuesta1") || "[]"),
    pregunta2: JSON.parse(localStorage.getItem("respuesta2") || "[]"),
    pregunta3: JSON.parse(localStorage.getItem("respuesta3") || "[]"),
    pregunta4: JSON.parse(localStorage.getItem("respuesta4") || "[]"),
    timestamp: new Date().toISOString()
  };

  console.log("Respuestas recopiladas:", respuestas);

  // Ejemplo para enviar a servidor (comenta si no usas backend aún)
  /*
fetch("../guardar_respuesta.php", {

    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(respuestas)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Envío exitoso:", data);
  })
  .catch(err => {
    console.error("Error al enviar datos:", err);
  });
  */
}
