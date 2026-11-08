# Guía para Mónica: tu web, en tus manos

Esta guía te lleva paso a paso para que la web de Cultuñol sea **tuya**: tu código, tu cuenta y tu publicación, sin pagar hosting y sin depender de nadie. Ve despacio, un paso cada día si quieres. Si algo falla, abre Claude Code y pregúntale: él puede leer esta guía.

Coste final: **0 €** de hosting. Solo pagas lo que ya pagas (dominio y Google Workspace) y Claude Pro (20 USD/mes) en lugar de ChatGPT Plus.

---

## Paso 1. Cambia ChatGPT Plus por Claude Pro

1. En ChatGPT: **Configuración → Cuenta → Gestionar suscripción → Cancelar**. Seguirá activo hasta el final del mes pagado y después pasarás al plan gratuito (puedes seguir creando algunas imágenes al día).
2. Entra en **claude.ai**, crea una cuenta con `info@cultunol.com` y suscríbete al plan **Pro**. Ese plan incluye **Claude Code**, la herramienta que usarás para cambiar tu web hablando en español.

## Paso 2. Instala Linux dentro de Windows (WSL)

1. Pulsa la tecla Windows, escribe **PowerShell**, clic derecho → **Ejecutar como administrador**.
2. Escribe y pulsa Enter:
   ```powershell
   wsl --install
   ```
3. **Reinicia** el ordenador.
4. Se abrirá **Ubuntu** solo. Te pedirá un nombre de usuario (en minúsculas, por ejemplo `monica`) y una contraseña. **Apúntala**: la necesitarás a veces. Al escribirla no se ve nada; es normal.

A partir de aquí, todos los comandos se escriben en **Ubuntu** (búscalo en el menú de Windows).

## Paso 3. Crea tu cuenta de GitHub

1. Entra en **github.com → Sign up** con `info@cultunol.com`. Elige un nombre de usuario corto, por ejemplo `cultunol`.
2. Activa la verificación en dos pasos cuando te lo pida.

## Paso 4. Conecta tu ordenador con GitHub (clave SSH)

En Ubuntu, copia estos comandos uno a uno (cambia el nombre si quieres):

```bash
sudo apt update && sudo apt install -y git curl
git config --global user.name "Mónica Fiestas"
git config --global user.email "info@cultunol.com"
ssh-keygen -t ed25519 -C "info@cultunol.com"
```

Pulsa **Enter** a todas las preguntas del último comando. Después:

```bash
cat ~/.ssh/id_ed25519.pub
```

Copia la línea entera que aparece (empieza por `ssh-ed25519`). En GitHub: **foto de perfil → Settings → SSH and GPG keys → New SSH key**, pégala y guarda. Comprueba que funciona:

```bash
ssh -T git@github.com
```

Escribe `yes` si pregunta. Debe decir *"Hi … You've successfully authenticated"*.

## Paso 5. Recibe el código de tu web

1. En GitHub: **+ (arriba a la derecha) → New repository**. Nombre: `cultunol`. Visibilidad: **Public** (necesario para el hosting gratis; todo lo que contiene ya es público en tu web). **No** marques ninguna casilla. Crear.
2. **Settings → Collaborators → Add people** y añade a Braga. Avísale: él subirá el código.
3. Cuando Braga te diga que ya está, en Ubuntu:
   ```bash
   cd ~
   git clone git@github.com:TU-USUARIO/cultunol.git
   cd cultunol
   ```

## Paso 6. Instala las herramientas y Claude Code

```bash
curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
source ~/.bashrc
cd ~/cultunol && mise trust && mise install
curl -fsSL https://claude.ai/install.sh | bash
```

Cierra y abre Ubuntu. Para ver tu web en tu ordenador:

```bash
cd ~/cultunol
mise run dev
```

Abre **http://localhost:1313** en tu navegador de Windows. Para pararlo: `Ctrl + C`.

Para hablar con Claude Code, en otra ventana de Ubuntu:

```bash
cd ~/cultunol
claude
```

La primera vez te pedirá iniciar sesión con tu cuenta de Claude. Después puedes pedirle cosas en español, por ejemplo: *"Cambia el precio del curso de principiantes a 350 €"* o *"Añade una pregunta frecuente a la página de cursos"*.

## Paso 7. Publica la web gratis (GitHub Pages)

1. En tu repositorio de GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Ve a la pestaña **Actions**: verás "Publicar web". Cuando termine en verde, tu web estará en `https://TU-USUARIO.github.io/cultunol/` (provisional).
3. Desde ahora, **cada vez que guardes cambios y hagas `git push`, la web se publica sola** en un par de minutos. Claude Code puede hacer el `git push` por ti si se lo pides.

## Paso 8. Conecta los formularios con Systeme

Tu newsletter, el lead magnet y el seguimiento de suscriptores **se quedan en Systeme** (plan gratuito). Solo hay que conectar los formularios de la web nueva:

1. En Systeme, busca tu formulario de suscripción y copia su **código para insertar** (embed) o la URL a la que envía los datos.
2. En Systeme, configura que después de suscribirse la persona vaya a `https://www.cultunol.com/2suscripcionmochila` y, tras confirmar, a `https://www.cultunol.com/suscrito`.
3. Abre `claude` en tu carpeta y dile: *"Conecta los formularios de /suscribirse y /bundle con este formulario de Systeme"* y pega el código. Pídele que lo pruebe.
4. Haz una suscripción de prueba con otro correo y comprueba que aparece en Systeme.

**No pases al Paso 9 hasta que esto funcione**, o perderías suscriptores.

## Paso 9. Apunta tu dominio a la web nueva (Namecheap)

1. En GitHub: **Settings → Pages → Custom domain**: escribe `www.cultunol.com` y guarda.
2. En Namecheap: **Domain List → cultunol.com → Manage → Advanced DNS**.
3. **Borra** solo estos registros (son los de Systeme):
   - Los registros **A** con host `@`
   - El registro **CNAME** con host `www`
4. **Añade**:

   | Tipo | Host | Valor |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | TU-USUARIO.github.io. |

5. **No toques nada más.** Los registros **MX** y **TXT** (los de Google, SPF, DKIM y DMARC) hacen que funcione tu correo `info@cultunol.com`.
6. Espera entre 15 minutos y unas horas. Luego en GitHub, **Settings → Pages**, marca **Enforce HTTPS**.
7. En Systeme, quita el dominio `cultunol.com` de la web/funnels si te lo pide, pero **mantén** tu cuenta, tus listas y tus campañas.

**Si algo sale mal:** vuelve a poner en Namecheap los registros que borraste (haz una captura de pantalla antes de empezar el Paso 9) y todo vuelve a estar como antes.

## Paso 10. Tu día a día

```bash
cd ~/cultunol
claude
```

Pídele lo que necesites en español. Cuando estés contenta con el cambio, dile *"publica los cambios"*. Eso es todo.

Ideas para usar Claude más allá de la web: preparar la newsletter semanal, crear historias TPRS para tus clases, escribir propuestas para empresas o analizar quién es tu cliente ideal a partir de tus suscriptores.
