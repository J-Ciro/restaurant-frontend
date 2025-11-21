/**
 * Utilidades para el módulo de cocina
 */

/**
 * Formatea el tiempo transcurrido desde una fecha
 * @param {string} dateString - Fecha en formato ISO 8601
 * @returns {string} Tiempo formateado (ej: "2 min ago" o "40 sec ago")
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return '';
  
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  
  if (diffMins > 0) {
    return `${diffMins} min ago`;
  }
  return `${diffSecs} sec ago`;
}

/**
 * Obtiene el color del badge según el estado
 * @param {string} status - Estado del pedido
 * @returns {string} Clases de Tailwind para el badge
 */
export function getStatusBadgeColor(status) {
  switch (status) {
    case 'RECEIVED':
      return 'bg-purple-100 text-purple-800';
    case 'PREPARING':
      return 'bg-yellow-100 text-yellow-800';
    case 'READY':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Obtiene el texto del estado
 * @param {string} status - Estado del pedido
 * @returns {string} Texto del estado
 */
export function getStatusText(status) {
  switch (status) {
    case 'RECEIVED':
      return 'New order';
    case 'PREPARING':
      return 'Cooking';
    case 'READY':
      return 'Ready';
    default:
      return status;
  }
}

/**
 * Obtiene el tiempo de referencia para mostrar
 * @param {Object} order - Pedido
 * @returns {string} Fecha de referencia
 */
export function getReferenceTime(order) {
  if (order.readyAt) return order.readyAt;
  if (order.preparingAt) return order.preparingAt;
  return order.receivedAt;
}

/**
 * Calcula el total de un pedido
 * @param {Array} items - Array de items del pedido
 * @returns {number} Total del pedido
 */
export function calculateOrderTotal(items) {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => {
    return sum + (item.price ? item.price * item.quantity : 0);
  }, 0);
}

