import { useState, useEffect } from 'react';
import { getOrderStatus } from '../services/api';
import { useParams } from 'react-router-dom';

/**
 * Componente para mostrar el estado de un pedido específico
 * @param {Function} onOrderLoad - Callback que se ejecuta cuando se carga el pedido
 */
function OrderStatus({ onOrderLoad }) {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const orderData = await getOrderStatus(orderId);
        setOrder(orderData);
        // Notificar al componente padre cuando se carga el pedido
        if (onOrderLoad) {
          onOrderLoad(orderData);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el estado del pedido');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderStatus();
    }
  }, [orderId, onOrderLoad]);

  // Función para obtener el icono según el nombre del item
  const getItemIcon = (itemName) => {
    const name = itemName.toLowerCase();
    if (name.includes('burger') || name.includes('hamburguesa')) {
      return 'lunch_dining';
    } else if (name.includes('fries') || name.includes('papas') || name.includes('patatas')) {
      return 'bakery_dining';
    } else if (name.includes('drink') || name.includes('bebida') || name.includes('shake') || name.includes('milkshake')) {
      return 'local_cafe';
    } else if (name.includes('pizza')) {
      return 'local_pizza';
    } else if (name.includes('salad') || name.includes('ensalada')) {
      return 'restaurant';
    } else {
      return 'restaurant_menu';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-subtext-light dark:text-subtext-dark">Cargando estado del pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div className="text-red-600 dark:text-red-400 mb-2">
          <span className="material-symbols-outlined text-5xl">error</span>
        </div>
        <h3 className="text-red-800 dark:text-red-300 font-semibold text-lg mb-2">Error</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 text-center">
        <p className="text-subtext-light dark:text-subtext-dark">No se encontró el pedido</p>
      </div>
    );
  }

  // Obtener el número de pedido o ID para mostrar
  const displayOrderId = order.orderNumber || order.orderId || order._id || 'N/A';
  const customerName = order.customerName || order.customer || 'Cliente';

  // Determinar estados del timeline basado en el status normalizado
  const isOrderReceived = true; // Siempre completado una vez que se carga
  const isBeingPrepared = order.status === 'cooking' || order.status === 'ready' || order.status === 'delivered';
  const isReadyForPickup = order.status === 'ready' || order.status === 'delivered';

  return (
    <>
      {/* Headline Text */}
      <h1 className="text-center text-[32px] font-bold leading-tight tracking-tight text-text-light dark:text-text-dark">
        Order #{displayOrderId}
      </h1>
      <p className="pt-1 text-center text-base font-normal leading-normal text-subtext-light dark:text-subtext-dark">
        For: {customerName}
      </p>

      {/* Timeline / Status Stepper */}
      <div className="mt-8 rounded-xl bg-card-light dark:bg-card-dark p-6 shadow-sm">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
          {/* Step 1: Order Received */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined">check</span>
            </div>
            <p className="text-xs font-medium text-text-light dark:text-text-dark">Order Received</p>
          </div>
          {/* Connector 1 */}
          <div className={`h-1 flex-grow rounded-full ${isBeingPrepared ? 'bg-primary' : 'bg-border-light dark:bg-border-dark'}`}></div>
          {/* Step 2: Being Prepared */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className={`relative flex h-10 w-10 items-center justify-center rounded-full ${isBeingPrepared ? 'bg-primary text-white' : 'bg-border-light dark:bg-border-dark text-subtext-light dark:text-subtext-dark'}`}>
              <span className="material-symbols-outlined">{isReadyForPickup ? 'check' : 'soup_kitchen'}</span>
              {(order.status === 'cooking' || order.status === 'preparing') && (
                <div className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-50"></div>
              )}
            </div>
            <p className={`text-xs font-medium ${isBeingPrepared ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`}>
              Being Prepared
            </p>
          </div>
          {/* Connector 2 */}
          <div className={`h-1 flex-grow rounded-full ${isReadyForPickup ? 'bg-primary' : 'bg-border-light dark:bg-border-dark'}`}></div>
          {/* Step 3: Ready for Pickup */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isReadyForPickup ? 'bg-primary text-white' : 'bg-border-light dark:bg-border-dark text-subtext-light dark:text-subtext-dark'}`}>
              <span className="material-symbols-outlined">{isReadyForPickup ? 'check' : 'shopping_bag'}</span>
            </div>
            <p className={`text-xs font-medium ${isReadyForPickup ? 'text-primary' : 'text-subtext-light dark:text-subtext-dark'}`}>
              Ready for Pickup
            </p>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <h3 className="px-0 pb-2 pt-8 text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">
        Your Order
      </h3>

      {/* Order Items List */}
      {order.items && order.items.length > 0 ? (
        <div className="flex flex-col gap-3">
          {order.items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 rounded-lg bg-card-light dark:bg-card-dark p-4 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-3xl">{getItemIcon(item.name)}</span>
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-text-light dark:text-text-dark">
                  {item.quantity}x {item.name}
                </p>
                {item.notes && (
                  <p className="text-sm text-subtext-light dark:text-subtext-dark">{item.notes}</p>
                )}
              </div>
              {item.price && (
                <p className="font-bold text-text-light dark:text-text-dark">
                  ${item.price.toFixed(2)}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-card-light dark:bg-card-dark p-4 shadow-sm">
          <p className="text-subtext-light dark:text-subtext-dark text-center">No hay items en este pedido</p>
        </div>
      )}
    </>
  );
}

export default OrderStatus;

