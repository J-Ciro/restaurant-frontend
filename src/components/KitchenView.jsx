import { useState, useEffect, useCallback } from 'react';
import { 
  getKitchenOrders, 
  startPreparingOrder, 
  markOrderAsReady 
} from '../services/api';

/**
 * Formatea el tiempo transcurrido desde una fecha
 * @param {string} dateString - Fecha en formato ISO 8601
 * @returns {string} Tiempo formateado (ej: "2 min ago" o "40 sec ago")
 */
function formatTimeAgo(dateString) {
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
function getStatusBadgeColor(status) {
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
 * Obtiene el texto del estado en español
 * @param {string} status - Estado del pedido
 * @returns {string} Texto del estado
 */
function getStatusText(status) {
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
function getReferenceTime(order) {
  if (order.readyAt) return order.readyAt;
  if (order.preparingAt) return order.preparingAt;
  return order.receivedAt;
}

/**
 * Componente para mostrar los pedidos en cocina
 */
function KitchenView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // '', 'RECEIVED', 'PREPARING', 'READY'
  const [processing, setProcessing] = useState(new Set());

  // Cargar pedidos
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKitchenOrders(filter || undefined);
      setOrders(data || []);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      
      // Mensaje de error más descriptivo
      let errorMessage = err.message || 'Error al cargar los pedidos';
      
      // Si es un 404, dar instrucciones más claras
      if (err.status === 404 || errorMessage.includes('404')) {
        errorMessage = 'Endpoint no encontrado. Verifica que el API Gateway esté corriendo en http://localhost:3000 y que el endpoint /kitchen/orders esté disponible.';
      } else if (errorMessage.includes('conexión') || errorMessage.includes('fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el API Gateway esté corriendo en http://localhost:3000';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Cargar pedidos al montar y cuando cambia el filtro
  useEffect(() => {
    loadOrders();
    
    // Actualizar cada 10 segundos
    const interval = setInterval(loadOrders, 10000);
    
    return () => clearInterval(interval);
  }, [loadOrders]);

  // Manejar inicio de preparación
  const handleStartPreparing = async (orderId) => {
    if (processing.has(orderId)) return;
    
    try {
      setProcessing(prev => new Set(prev).add(orderId));
      await startPreparingOrder(orderId);
      await loadOrders(); // Recargar lista
    } catch (err) {
      alert(err.message || 'Error al iniciar la preparación');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Manejar marcar como listo
  const handleMarkAsReady = async (orderId) => {
    if (processing.has(orderId)) return;
    
    try {
      setProcessing(prev => new Set(prev).add(orderId));
      await markOrderAsReady(orderId);
      await loadOrders(); // Recargar lista
    } catch (err) {
      alert(err.message || 'Error al marcar como listo');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          {/* Kitchen Icon */}
          <div className="p-2">
            <svg 
              className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              {/* Fork */}
              <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Kitchen Dashboard</h1>

          {/* Refresh Icon */}
          <button 
            onClick={loadOrders}
            disabled={loading}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg 
              className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-700 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
          <button
            onClick={() => setFilter('')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              filter === ''
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('RECEIVED')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              filter === 'RECEIVED'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setFilter('PREPARING')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              filter === 'PREPARING'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setFilter('READY')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              filter === 'READY'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ready
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {orders.map((order) => {
              const referenceTime = getReferenceTime(order);
              const timeAgo = formatTimeAgo(referenceTime);
              const isProcessing = processing.has(order.orderId);

              return (
                <div
                  key={order._id || order.orderId}
                  className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow flex flex-col min-h-[280px] sm:min-h-[300px]"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4 flex-shrink-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                        Order #{order.orderId ? String(order.orderId).slice(-4) : 'N/A'}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">
                        {order.customerName || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs sm:text-sm ml-2 flex-shrink-0">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="whitespace-nowrap">{timeAgo}</span>
                    </div>
                  </div>

                  {/* Items - Scrollable area with fixed height */}
                  <div className="mb-3 sm:mb-4 flex-1 min-h-0 overflow-y-auto max-h-[120px] sm:max-h-[140px]">
                    <ul className="space-y-1">
                      {order.items?.map((item, idx) => {
                        const itemTotal = item.price ? (item.price * item.quantity).toFixed(2) : null;
                        return (
                          <li key={idx} className="text-gray-700 text-xs sm:text-sm flex justify-between items-start">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            {item.price && (
                              <span className="text-gray-600 ml-2 whitespace-nowrap">
                                ${itemTotal}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  {/* Total Price */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-3 sm:mb-4 pt-2 border-t border-gray-100 flex-shrink-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-semibold text-gray-900">Total:</span>
                        <span className="text-sm sm:text-base font-bold text-gray-900">
                          ${order.items.reduce((sum, item) => {
                            return sum + (item.price ? item.price * item.quantity : 0);
                          }, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status and Action */}
                  <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0">
                    <span
                      className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>

                    {order.status === 'RECEIVED' && (
                      <button
                        onClick={() => handleStartPreparing(order.orderId)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isProcessing ? 'Processing...' : 'Start Cooking'}
                      </button>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => handleMarkAsReady(order.orderId)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isProcessing ? 'Processing...' : 'Mark as Ready'}
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        disabled
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed whitespace-nowrap"
                      >
                        Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default KitchenView;
