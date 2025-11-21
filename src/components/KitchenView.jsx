import { useState, useEffect, useCallback } from 'react';
import { 
  getKitchenOrders, 
  startPreparingOrder, 
  markOrderAsReady 
} from '../services/api';
import KitchenHeader from './kitchen/KitchenHeader';
import KitchenFilters from './kitchen/KitchenFilters';
import OrderCard from './kitchen/OrderCard';

/**
 * Componente principal para mostrar los pedidos en cocina
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
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <KitchenHeader onRefresh={loadOrders} loading={loading} />
        <KitchenFilters filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Content Section */}
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
            {orders.map((order) => (
              <OrderCard
                key={order._id || order.orderId}
                order={order}
                isProcessing={processing.has(order.orderId)}
                onStartPreparing={handleStartPreparing}
                onMarkAsReady={handleMarkAsReady}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KitchenView;
