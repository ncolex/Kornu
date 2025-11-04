# Kornu ❤️ / 💔

Kornu es una aplicación web progresiva diseñada para crear un índice de reputación social. Permite a los usuarios verificar y dejar reseñas sobre personas (parejas, amigos, etc.) utilizando identificadores como nombres de usuario de Instagram, nombres completos o números de teléfono. El objetivo es proporcionar una herramienta de precaución y transparencia en las relaciones interpersonales.

---

## Funcionalidades Principales

### 1. Verificación de Reputación (Página de Inicio)
La función central de Kornu.
- **Búsqueda Universal:** Permite buscar a una persona usando su nombre de usuario de Instagram, nombre y apellido, o número de teléfono.
- **Resultados Detallados:** Al realizar una búsqueda, la aplicación presenta un perfil completo que incluye:
    - **Semáforo de Reputación:** Un sistema visual e intuitivo que clasifica la reputación en tres niveles:
        - 🟢 **Confiable:** Puntuación positiva, indica buenas experiencias.
        - 🟡 **Alerta:** Puntuación ligeramente negativa, sugiere precaución.
        - 🔴 **Riesgo Alto:** Puntuación muy negativa, indica problemas serios reportados.
    - **Resumen y Estadísticas:** Muestra la puntuación total, el número de reseñas, y un desglose de reportes positivos vs. negativos.
    - **Reseñas de la Comunidad:** Lista de todas las reseñas enviadas por otros usuarios.

### 2. Creación de Reseñas (Reportar)
Los usuarios pueden contribuir anónimamente a la base de datos.
- **Formulario Completo:** Para crear una reseña, se debe especificar el identificador de la persona, su país, una categoría, y un texto descriptivo.
- **Categorías Predefinidas:** Las reseñas se clasifican en categorías claras con una puntuación predefinida:
    - `💔 Infidelidad`
    - `💰 Robo`
    - `🔪 Traición`
    - `☢️ Toxicidad`
    - `💖 Positivo`
- **Aporte de Evidencia:** Se pueden adjuntar pruebas visuales (imágenes) para respaldar la reseña. Estas solo son visibles para usuarios registrados.
- **Verificación de Contacto:** Aunque el autor de la reseña es anónimo en la plataforma, se requiere información de contacto (email, Instagram, teléfono) para fines de verificación interna y para evitar abusos. **Esta información no es pública**.

### 3. Rankings de la Comunidad
Una sección que muestra los perfiles con las puntuaciones más altas y más bajas.
- **Top 5 Negativos:** Lista de los perfiles con la peor reputación en la plataforma.
- **Top 5 Positivos:** Lista de los perfiles mejor valorados por la comunidad.

### 4. Perfiles de Usuario y Autenticación
- **Registro e Inicio de Sesión:** Los usuarios pueden crear una cuenta usando su número de teléfono y una contraseña, o a través de proveedores sociales como Google, Facebook e Instagram.
- **Funcionalidad "Recordarme":** Al iniciar sesión, los usuarios pueden optar por mantener su sesión activa de forma persistente.
- **Página de Perfil:** Los usuarios registrados tienen un perfil personal donde pueden ver su "Puntuación de Contribuidor" y gestionar las reseñas que han publicado.

---

## Funcionalidades Específicas y Avanzadas

### 1. Investigación Web Automática (IA)
Al buscar un perfil, Kornu realiza una búsqueda automática en la web para encontrar presencia en otras plataformas.
- **Búsqueda en Redes Sociales:** Verifica perfiles en Google, Facebook, TikTok, etc.
- **Búsqueda en Sitios de Citas:** Simula búsquedas en plataformas como Badoo y Tinder para detectar posibles perfiles.
- **Búsqueda Especializada:** Incluye verificaciones en sitios como Skokka, OnlyFans y Cafecito.app.

### 2. Búsqueda de Perfiles de Instagram
Si no se encuentra un perfil en la base de datos de Kornu, la aplicación busca activamente en Instagram para encontrar posibles coincidencias, mostrando sus fotos de perfil y nombres de usuario para que el usuario pueda verificar.

### 3. Integración con IA (Google Gemini)
Kornu utiliza la IA de Google para potenciar varias de sus características.
- **Generador de Contenido (Página de IA):** Una herramienta que permite buscar noticias o eventos públicos en la web (ej: "rupturas de famosos 2024"). La IA analiza los resultados y genera borradores de reseñas, extrayendo el nombre, país, un resumen del hecho y una categoría sugerida. Estas sugerencias pueden ser añadidas a la plataforma con un solo clic.
- **Generación de Avatares:** Las fotos de perfil de los usuarios registrados son generadas por IA (modelo Imagen) para crear un avatar único y abstracto basado en sus iniciales, protegiendo su privacidad.

### 4. Sistema de Notificaciones
Un centro de notificaciones en tiempo real para mantener a los usuarios informados.
- **Alertas:** Notifica sobre nuevas reseñas de perfiles relevantes o actualizaciones importantes.
- **Gestión:** Permite marcar notificaciones como leídas, borrarlas, y navegar directamente al contenido relacionado.

### 5. Tema Oscuro / Claro
La interfaz cuenta con un selector de tema para que los usuarios puedan elegir entre un modo claro y uno oscuro, adaptándose a sus preferencias y mejorando la accesibilidad visual.
