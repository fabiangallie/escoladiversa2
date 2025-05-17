const compañeros = [
  "Ana", "Luis", "Pedro", "Carla", "Hugo",
  "Marta", "Iván", "Lucía", "Daniel", "Sara"
];

window.onload = () => {
  const lista = document.getElementById("lista-nombres");
  compañeros.forEach(nombre => {
    const item = document.createElement("div");
    item.className = "draggable";
    item.draggable = true;
    item.textContent = nombre;

    const img = document.createElement("img");
    img.src = "silueta1.png";
    img.alt = "icono";

    item.prepend(img);
    item.addEventListener("dragstart", dragStart);
    lista.appendChild(item);
  });

  const caja = document.getElementById("seleccionados");
  caja.addEventListener("dragover", e => e.preventDefault());
  caja.addEventListener("drop", drop);
};

function dragStart(e) {
  e.dataTransfer.setData("text", e.target.textContent);
  e.dataTransfer.setData("html", e.target.outerHTML);
}

function drop(e) {
  e.preventDefault();
  const html = e.dataTransfer.getData("html");

  const container = document.getElementById("seleccionados");
  if (container.children.length >= 5) return;

  const temp = document.createElement("div");
  temp.innerHTML = html;
  const nombre = temp.firstChild.textContent.trim();

  const yaSeleccionado = Array.from(container.children).some(
    li => li.textContent.trim() === nombre
  );
  if (!yaSeleccionado) {
    const li = document.createElement("li");
    li.innerHTML = html;
    container.appendChild(li);
  }
}

function guardarYContinuar() {
  const seleccionados = Array.from(document.getElementById("seleccionados").children).map(li =>
    li.textContent.trim()
  );

  // Aquí se guardaría en localStorage o se enviaría al backend
  localStorage.setItem("respuesta1", JSON.stringify(seleccionados));
  window.location.href = "pregunta2.html";
}
