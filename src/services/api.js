/**
 * Servicio API para comunicación con el backend
 * Base URL: http://localhost:3001 (Order Service)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Mapea los estados del backend a los estados del frontend
 * @param {string} status - Estado del backend (PENDING, PREPARING, READY, DELIVERED, CANCELLED)
 * @returns {string} Estado del frontend (pending, cooking, ready, delivered, cancelled)
 */
function mapOrderStatus(status) {
  const statusMap = {
    'PENDING': 'pending',
    'PREPARING': 'cooking',
    'READY': 'ready',
    'DELIVERED': 'delivered',
    'CANCELLED': 'cancelled',
    // También aceptar estados en minúsculas por si acaso
    'pending': 'pending',
    'preparing': 'cooking',
    'cooking': 'cooking',
    'ready': 'ready',
    'delivered': 'delivered',
    'cancelled': 'cancelled'
  };
  return statusMap[status?.toUpperCase()] || status || 'pending';
}

/**
 * Normaliza los datos del pedido del backend al formato esperado por el frontend
 * @param {Object} orderData - Datos del pedido del backend
 * @returns {Object} Datos del pedido normalizados
 */
function normalizeOrderData(orderData) {
  // El backend puede devolver { order: {...} } o directamente el objeto
  const order = orderData.order || orderData;
  
  return {
    ...order,
    // Mapear campos del backend al formato del frontend
    orderId: order._id || order.id || order.orderId,
    orderNumber: order.orderNumber,
    customer: order.customerName || order.customer,
    customerName: order.customerName || order.customer,
    status: mapOrderStatus(order.status),
    items: order.items || [],
    total: order.total || 0,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}

/**
 * Obtiene el estado de un pedido específico
 * @param {string} orderId - ID del pedido
 * @returns {Promise<Object>} Datos del pedido normalizados
 */
export async function getOrderStatus(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el estado del pedido: ${response.statusText}`);
    }

    const data = await response.json();
    return normalizeOrderData(data);
  } catch (error) {
    console.error('Error en getOrderStatus:', error);
    throw error;
  }
}

/**
 * Obtiene los pedidos de cocina
 * @returns {Promise<Array>} Lista de pedidos en cocina
 */
export async function getKitchenOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/kitchen/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los pedidos de cocina: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getKitchenOrders:', error);
    throw error;
  }
}

/**
 * Crea un nuevo pedido
 * @param {Object} orderData - Datos del pedido (items, customerName, etc.)
 * @returns {Promise<Object>} Datos del pedido creado normalizados
 */
export async function createOrder(orderData) {
  try {
    // Normalizar los datos para el backend
    const backendData = {
      customerName: orderData.customerName || orderData.customer,
      items: orderData.items || []
    };

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error(`Error al crear el pedido: ${response.statusText}`);
    }

    const data = await response.json();
    // El backend devuelve { message, order: {...} }
    return normalizeOrderData(data);
  } catch (error) {
    console.error('Error en createOrder:', error);
    throw error;
  }
}