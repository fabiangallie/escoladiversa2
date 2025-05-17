let alumnos = [];

function mostrarTab(id) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelector(`.tab-btn[onclick="mostrarTab('${id}')"]`).classList.add('active');
  if (id === 'editar') cargarGruposRemotos();
}

function añadirAlumno() {
  const input = document.getElementById("alumno");
  const nombre = input.value.trim();
  if (nombre) {
    alumnos.push(nombre);
    input.value = "";
    actualizarListaAlumnos();
  }
}

function actualizarListaAlumnos() {
  const lista = document.getElementById("lista-alumnos");
  lista.innerHTML = "";
  alumnos.forEach(nombre => {
    const li = document.createElement("li");
    li.textContent = nombre;
    lista.appendChild(li);
  });
}

document.getElementById("grupo-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const curso = document.getElementById("curso").value.trim();
  const fecha = document.getElementById("fecha").value;
  if (!curso || !fecha || alumnos.length === 0) {
    alert("Completa todos los campos y añade al menos un alumno.");
    return;
  }

  const clave = `${curso} - ${fecha}`;
  const grupo = { clave, curso, fecha, alumnos };

  try {
    const res = await fetch("guardar_grupo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(grupo)
    });
    const resultado = await res.json();
    if (resultado.estado === "ok") {
      alert("Grupo guardado correctamente.");
      this.reset();
      alumnos = [];
      actualizarListaAlumnos();
    } else {
      alert("Error al guardar el grupo.");
    }
  } catch (err) {
    alert("No se pudo conectar con el servidor.");
  }
});

async function cargarGruposRemotos() {
  const select = document.getElementById("grupo-select");
  select.innerHTML = `<option value="">-- Elegir grupo --</option>`;
  try {
    const res = await fetch("cargar_grupos.php");
    const grupos = await res.json();

    Object.keys(grupos).forEach(clave => {
      const option = document.createElement("option");
      option.value = clave;
      option.textContent = clave;
      select.appendChild(option);
    });
  } catch (err) {
    alert("No se pudieron cargar los grupos.");
  }
}

async function cargarGrupoSeleccionado() {
  const clave = document.getElementById("grupo-select").value;
  if (!clave) return;
  const res = await fetch("cargar_grupos.php");
  const grupos = await res.json();
  const grupo = grupos[clave];
  if (!grupo) return;

  document.getElementById("grupo-editable").innerHTML = `
    <form class="form-edit">
      <label>Curso:</label>
      <input type="text" id="edit-curso" value="${grupo.curso}" />
      <label>Fecha:</label>
      <input type="date" id="edit-fecha" value="${grupo.fecha}" />
      <label>Añadir alumno:</label>
      <input type="text" id="nuevo-alumno" placeholder="Nuevo alumno" />
      <button type="button" class="btn" onclick="añadirAlumnoEditado('${clave}')">Añadir</button>
      <h4>Alumnos:</h4>
      <div class="edit-alumnos-container">
        <ul class="alumnos-lista" id="edit-lista">
          ${grupo.alumnos.map((nombre, i) => `
            <li>${nombre}
              <span class="btn-eliminar" onclick="eliminarAlumnoEditado(${i}, '${clave}')">x</span>
            </li>`).join("")}
        </ul>
      </div>
      <button type="button" class="btn" onclick="guardarCambiosGrupo('${clave}')">Guardar cambios</button>
    </form>
  `;
}

async function añadirAlumnoEditado(clave) {
  const input = document.getElementById("nuevo-alumno");
  const nuevo = input.value.trim();
  if (!nuevo) return;
  const res = await fetch("cargar_grupos.php");
  const grupos = await res.json();
  const grupo = grupos[clave];
  grupo.alumnos.push(nuevo);
  await guardarGrupoRemoto(grupo);
  cargarGrupoSeleccionado();
}

async function eliminarAlumnoEditado(index, clave) {
  const res = await fetch("cargar_grupos.php");
  const grupos = await res.json();
  const grupo = grupos[clave];
  grupo.alumnos.splice(index, 1);
  await guardarGrupoRemoto(grupo);
  cargarGrupoSeleccionado();
}

async function guardarCambiosGrupo(claveAnterior) {
  const nuevoCurso = document.getElementById("edit-curso").value.trim();
  const nuevaFecha = document.getElementById("edit-fecha").value;
  if (!nuevoCurso || !nuevaFecha) return alert("Rellena todos los campos.");
  const nuevoClave = `${nuevoCurso} - ${nuevaFecha}`;
  const res = await fetch("cargar_grupos.php");
  const grupos = await res.json();
  const grupo = grupos[claveAnterior];
  grupo.curso = nuevoCurso;
  grupo.fecha = nuevaFecha;
  grupo.clave = nuevoClave;
  await guardarGrupoRemoto(grupo);
  alert("Grupo actualizado.");
  cargarGruposRemotos();
  cargarGrupoSeleccionado();
}

async function guardarGrupoRemoto(grupo) {
  await fetch("guardar_grupo.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(grupo)
  });
}

