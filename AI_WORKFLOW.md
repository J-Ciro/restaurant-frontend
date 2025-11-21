# AI_WORKFLOW.md: Flujo de Trabajo y Metodología con IA

Este documento describe la metodología de trabajo para integrar herramientas de Inteligencia Artificial (IA) generativa (como GitHub Copilot o Cursor) en nuestro proceso de desarrollo de software.

## 🎯 1. Metodología de Desarrollo: "Prompt-Driven Refinement"

Nuestra metodología establece que la **IA** es el **"Junior Developer"** y el equipo humano (Arquitectos y Revisores) es el **"Arquitecto y Revisor"** principal.

| Etapa | Responsable | Descripción |
| :--- | :--- | :--- |
| **1.1 Diseño** | Arquitectos (con ayuda de IA) | Definición de las especificaciones técnicas completas: esquemas de datos, *endpoints* y rutas de comunicación (e.g., RabbitMQ). |
| **1.2 Generación** | IA | Utilización de **prompts detallados** para generar el *boilerplate* estructural y la lógica básica. |
| **1.3 Refinamiento y Pruebas** | Arquitectos y QA | El equipo humano refina el código generado, mejora el *prompt* dividiéndolo en problemas más pequeños, y el QA Engineer valida los criterios de aceptación y la seguridad. |
| **1.5 Integración** | Equipo | El código refinado se somete a **Pull Request (PR)** y a la revisión por un par antes de su aprobación. |

---

### 1.4 Contextualización para la IA

La IA **no adivina**, necesita leer. Antes de solicitar código, debemos asegurarnos de que la IA tenga acceso al **contexto** necesario:

1.  **Contratos de Datos:** Esquemas JSON para asegurar que *Backend* y *Frontend* utilicen el mismo lenguaje.
2.  **Estructura del Proyecto:** El árbol de carpetas actual.
3.  **Tecnologías:** Archivos `requirements.txt` o `package.json` para evitar el uso de librerías extrañas o inconsistentes.

---

## 🗣️ 2. Interacciones Clave (Prompts de Éxito)

La calidad del resultado de la IA depende de la calidad del *prompt*.

* **2.1. Generación de Código:** Usaremos *prompts* detallados que incluyan:
    * Contexto del microservicio o componente.
    * Especificaciones técnicas (lenguaje, *framework*, bibliotecas).
    * Ejemplos de código, si es necesario.
* **2.2. Refinamiento de Código:** Si el código inicial es inadecuado, lo **desglosamos en problemas más pequeños** y pedimos a la IA soluciones específicas, o mejoramos el *prompt* para ser más específicos.
* **2.3. Generación de Documentación:**
    * **Comentarios en el Código:** Usaremos la IA para crear *docstrings* y comentarios claros que expliquen las funciones.
    * **Documentación de Proyecto:** Mantendremos actualizado el archivo `README.md` con instrucciones exactas.
* **2.4. Generación de Pruebas:** El **QA Engineer** trabajará con la IA para generar **pruebas unitarias** y de **integración**.

---

## 📚 3. Documentos Clave y Contextualización

Para evitar que la IA genere código inconsistente, siempre debe recibir el siguiente **contexto del sistema**:

* **Especificación del Sistema:** Documento que describe los microservicios, sus responsabilidades y la comunicación entre ellos.
* **Diagramas de Arquitectura:** Diagramas (propios o generados con IA) para contextualizar la estructura del sistema.
* **Configuraciones de Docker:** Especificaciones de los contenedores para el despliegue.

---

## 👥 4. Dinámicas de Interacción y Roles

### Roles y Responsabilidades

| Rol en el Equipo | Tarea Central con la IA | Dinámica de Revisión Obligatoria |
| :--- | :--- | :--- |
| **Developer** (Backend/Frontend) | **Estrategia de Prompting:** Encargado de crear el *prompt* inicial y realizar el primer pase de **refinamiento** del código. | Siempre debe enviar el código generado junto con el **prompt original** en el Pull Request (PR) para que el par pueda evaluar la estrategia. |
| **QA Engineer** | **Revisión de Calidad y Seguridad:** Responsable de validar que el código cumpla con la lógica, seguridad y criterios de aceptación. | Utiliza *prompts* de auditoría (ej. "Busca vulnerabilidades comunes de inyección SQL") y ejecuta pruebas de estrés. |
| **Revisor** (Par) | **Aprobación de Código:** Verifica la implementación del *Git Flow* y la adherencia al `AI_WORKFLOW.md`. | **Ritual:** Ningún Pull Request se aprueba sin la revisión de un par. |

### 4.2. Flujo de Trabajo con IA

1.  Un desarrollador escribe un *prompt* detallado para una tarea.
2.  La IA genera el código.
3.  El desarrollador **revisa y prueba** el código.
4.  Si es necesario, se **itera** con la IA (refinamiento del *prompt*).
5.  Una vez aprobado por el desarrollador, se sube a la rama *feature* correspondiente.
6.  El QA Engineer **revisa y aprueba** el código (seguridad y calidad).

### 4.3. Roles en la Interacción con IA

* **Developers:** Generan *prompts* y revisan el código generado.
* **QA Engineer:** Genera *prompts* para pruebas y valida la seguridad y estrés del código.