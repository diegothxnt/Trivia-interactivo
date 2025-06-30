# Trivia-interactivo

Aplicación web **interactiva** que simula un juego de trivia para practicar **programación asíncrona** usando **HTML**, **CSS** y **JavaScript**, consumiendo la **API externa Open Trivia Database**.

---

## 🚀 Funcionalidades principales

✅ **Configuración inicial:**
- Permite al jugador ingresar su **nombre** (2 a 20 caracteres).
- Selección de la **cantidad de preguntas** (mínimo 5, máximo 20).
- Elección de **nivel de dificultad**: fácil, medio o difícil.
- Elección de **categoría**: mixtas o específicas.

✅ **Obtención de preguntas:**
- Se conecta a [Open Trivia Database](https://opentdb.com/).
- Petición **asíncrona** con `fetch()`.
- Indicador de **carga** mientras se obtienen preguntas.
- Manejo de errores de conexión.

✅ **Juego interactivo:**
- Muestra pregunta actual y **contador de progreso**.
- Opciones de respuesta como **botones**.
- Temporizador visual con **20 segundos** por pregunta.
- Feedback visual (respuesta correcta o incorrecta).
- Indicador cuando quedan menos de 5 segundos.

✅ **Sistema de puntuación:**
- +10 puntos por respuesta correcta.
- 0 puntos por respuesta incorrecta o tiempo agotado.
- Registro de número de respuestas correctas e incorrectas.

✅ **Pantalla de resultados:**
- Nombre del jugador.
- Puntuación total.
- Total de aciertos.
- Porcentaje de éxito.
- Tiempo promedio por pregunta.
- Botones para **reiniciar juego** o **cambiar configuración**.
