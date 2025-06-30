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

