const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.mob-link, .nav-link');
const form = document.getElementById('contact-form');
const successMessage = document.getElementById('form-success');

const themeKey = 'preferredTheme';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const applyTheme = (theme) => {
  const isLight = theme === 'light';
  body.classList.toggle('light-theme', isLight);
  themeToggle.textContent = isLight ? '🌙' : '☀️';
  themeToggle.setAttribute('aria-label', `Cambiar a ${isLight ? 'modo oscuro' : 'modo claro'}`);
  localStorage.setItem(themeKey, theme);
};

const storedTheme = localStorage.getItem(themeKey);
if (storedTheme) {
  applyTheme(storedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  applyTheme(body.classList.contains('light-theme') ? 'dark' : 'light');
});

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú móvil' : 'Abrir menú móvil');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-label', 'Abrir menú móvil');
    }
  });
});

const fields = [
  { input: document.getElementById('nombre'), error: document.getElementById('error-nombre'), validator: (value) => value.trim().length > 0, message: 'Por favor ingresa tu nombre.' },
  { input: document.getElementById('email'), error: document.getElementById('error-email'), validator: (value) => emailPattern.test(value), message: 'Ingresa un correo válido.' },
  { input: document.getElementById('asunto'), error: document.getElementById('error-asunto'), validator: (value) => value.trim().length > 0, message: 'Por favor ingresa un asunto.' },
  { input: document.getElementById('mensaje'), error: document.getElementById('error-mensaje'), validator: (value) => value.trim().length > 0, message: 'El mensaje no puede estar vacío.' },
];

const clearErrors = () => {
  fields.forEach(({ input, error }) => {
    input.classList.remove('invalid');
    error.textContent = '';
  });
  successMessage.textContent = '';
};

fields.forEach(({ input, error }) => {
  input.addEventListener('input', () => {
    input.classList.remove('invalid');
    error.textContent = '';
    successMessage.textContent = '';
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  let isValid = true;
  fields.forEach(({ input, error, validator, message }) => {
    if (!validator(input.value)) {
      isValid = false;
      input.classList.add('invalid');
      error.textContent = message;
    }
  });

  if (!isValid) {
    return;
  }

  const name = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('asunto').value.trim();
  const message = document.getElementById('mensaje').value.trim();
  const mailto = `mailto:emiliocruzleal@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\nAsunto: ${subject}\n\nMensaje:\n${message}`)}`;

  window.location.href = mailto;
  successMessage.textContent = 'Se abrirá tu cliente de correo para enviar el mensaje a emiliocruzleal@gmail.com.';
  form.reset();
});
