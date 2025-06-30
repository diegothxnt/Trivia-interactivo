const formulario = document.getElementById("formulario-configuracion");
const nombreJugadorInput = document.getElementById("nombre-jugador");
const cantidadPreguntasInput = document.getElementById("cantidad-preguntas");
const dificultadSelect = document.getElementById("dificultad");
const categoriaSelect = document.getElementById("categoria");

const seccionConfiguracion = document.getElementById("seccion-configuracion");
const seccionCarga = document.getElementById("seccion-carga");
const seccionJuego = document.getElementById("seccion-juego");
const seccionResultados = document.getElementById("seccion-resultados");

const progreso = document.getElementById("progreso");
const temporizadorDisplay = document.getElementById("temporizador");
const textoPregunta = document.getElementById("texto-pregunta");
const botonesRespuesta = document.getElementById("botones-respuesta");
const retroalimentacion = document.getElementById("retroalimentacion");
const resumenResultados = document.getElementById("resumen-resultados");
const botonReiniciar = document.getElementById("boton-reiniciar");
const botonNuevaConfiguracion = document.getElementById("boton-nueva-configuracion");

let preguntas = [],
    indiceActual = 0,
    puntaje = 0,
    aciertos = 0,
    tiempoTotal = 0,
    temporizador = null,
    tiempoRestante = 20,
    configuracion = {};

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = nombreJugadorInput.value.trim();
  const cantidad = parseInt(cantidadPreguntasInput.value);
  const dificultad = dificultadSelect.value;
  const categoria = categoriaSelect.value;

  if (nombre.length < 2 || nombre.length > 20 || cantidad < 5 || cantidad > 20) {
    alert("Por favor, completa los campos correctamente.");
    return;
  }

  configuracion = { nombre, cantidad, dificultad, categoria };
  seccionConfiguracion.classList.add("hidden");
  seccionCarga.classList.remove("hidden");

  try {
    let url = `https://opentdb.com/api.php?amount=${cantidad}&difficulty=${dificultad}&type=multiple`;
    if (categoria) url += `&category=${categoria}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.response_code !== 0) throw new Error("No se pudieron cargar preguntas.");

    preguntas = data.results;
    indiceActual = 0;
    puntaje = 0;
    aciertos = 0;
    tiempoTotal = 0;
    seccionCarga.classList.add("hidden");
    seccionJuego.classList.remove("hidden");
    mostrarPregunta();
  } catch (err) {
    alert("Error al obtener preguntas. Intenta nuevamente.");
    location.reload();
  }
});
function mostrarPregunta() {
  clearInterval(temporizador);
  retroalimentacion.textContent = "";
  tiempoRestante = 20;
  actualizarTemporizador();

  const p = preguntas[indiceActual];
  const respuestas = [...p.incorrect_answers, p.correct_answer];
  respuestas.sort(() => Math.random() - 0.5);

  progreso.textContent = `Pregunta ${indiceActual + 1} de ${preguntas.length}`;
  textoPregunta.innerHTML = decodificar(p.question);
  botonesRespuesta.innerHTML = "";

  respuestas.forEach((r) => {
    const btn = document.createElement("button");
    btn.innerHTML = decodificar(r);
    btn.addEventListener("click", () => seleccionarRespuesta(r === p.correct_answer, btn));
    botonesRespuesta.appendChild(btn);
  });

  temporizador = setInterval(() => {
    tiempoRestante--;
    actualizarTemporizador();
    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      tiempoTotal += 20;
      mostrarRetroalimentacion(false);
      setTimeout(siguientePregunta, 2000);
    }
  }, 1000);
}

function seleccionarRespuesta(correcta, boton) {
  clearInterval(temporizador);
  const botones = botonesRespuesta.querySelectorAll("button");
  botones.forEach((b) => b.disabled = true);
  if (correcta) {
    puntaje += 10;
    aciertos++;
    boton.classList.add("correcta");
  } else {
    boton.classList.add("incorrecta");
    const correcto = [...botones].find(b => b.innerHTML === decodificar(preguntas[indiceActual].correct_answer));
    if (correcto) correcto.classList.add("correcta");
  }
  tiempoTotal += (20 - tiempoRestante);
  setTimeout(siguientePregunta, 1500);
}

function siguientePregunta() {
  indiceActual++;
  if (indiceActual < preguntas.length) {
    mostrarPregunta();
  } else {
    mostrarResultados();
  }
}

function actualizarTemporizador() {
  temporizadorDisplay.textContent = `Tiempo: ${tiempoRestante}s`;
  if (tiempoRestante <= 5) {
    temporizadorDisplay.classList.add("tiempo-bajo");
  } else {
    temporizadorDisplay.classList.remove("tiempo-bajo");
  }
}

function mostrarRetroalimentacion(correcta) {
  retroalimentacion.textContent = correcta ? "¡Correcto!" : "Tiempo agotado o incorrecto.";
}

function mostrarResultados() {
  seccionJuego.classList.add("hidden");
  seccionResultados.classList.remove("hidden");

  const promedio = (tiempoTotal / preguntas.length).toFixed(2);
  const porcentaje = ((aciertos / preguntas.length) * 100).toFixed(1);

  resumenResultados.innerHTML = `
    <strong>${configuracion.nombre}</strong><br>
    Puntos: <strong>${puntaje}</strong><br>
    Aciertos: <strong>${aciertos}</strong> de ${preguntas.length}<br>
    Porcentaje: <strong>${porcentaje}%</strong><br>
    Tiempo promedio: <strong>${promedio}s</strong>
  `;
}

botonReiniciar.addEventListener("click", () => {
  seccionResultados.classList.add("hidden");
  seccionJuego.classList.remove("hidden");
  indiceActual = 0;
  puntaje = 0;
  aciertos = 0;
  tiempoTotal = 0;
  mostrarPregunta();
});

botonNuevaConfiguracion.addEventListener("click", () => {
  seccionResultados.classList.add("hidden");
  seccionConfiguracion.classList.remove("hidden");
});

function decodificar(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

