const lista = document.getElementById('lista');

// Cargar historial al entrar (sin duplicados)
fetch('/historial')
  .then(res => res.json())
  .then(data => {
    lista.innerHTML = ''; // ← Limpiar antes de mostrar historial
    data.forEach(entry => agregarEntrada(entry.timestamp));
  });

// WebSocket para recibir actualizaciones en tiempo real
const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => console.log('WebSocket conectado');

ws.onmessage = (event) => {
  const { timestamp } = JSON.parse(event.data);
  agregarEntrada(timestamp);
};

// Función para agregar entrada al DOM
function agregarEntrada(timestamp) {
  const li = document.createElement('li');
  const fecha = new Date(timestamp);
  const hora = fecha.toLocaleTimeString('es-VE', { hour12: false });
  const dia = fecha.toLocaleDateString('es-VE');
li.textContent = `Acceso registrado: ${hora} - ${dia}`;
  lista.prepend(li);
}