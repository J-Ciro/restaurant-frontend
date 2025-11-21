import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';

// Menú de items disponibles (precios en pesos colombianos)
const MENU_ITEMS = [
  { id: 1, name: 'Classic Margherita Pizza', price: 28000, icon: 'local_pizza' },
  { id: 2, name: 'Cheeseburger', price: 20000, icon: 'lunch_dining' },
  { id: 3, name: 'Creamy Carbonara', price: 30000, icon: 'restaurant_menu' },
  { id: 4, name: 'Caesar Salad', price: 18000, icon: 'restaurant' },
  { id: 5, name: 'Soft Drink', price: 6000, icon: 'local_cafe' },
];

export default function OrderForm() {
  const navigate = useNavigate();
  
  // Estado del formulario
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [quantities, setQuantities] = useState(
    MENU_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );
  
  // Estados de UI
  const [showModal, setShowModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false });

  // Incrementar cantidad de un item
  const increment = (itemId) => {
    setQuantities(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  // Decrementar cantidad de un item
  const decrement = (itemId) => {
    setQuantities(prev => ({ 
      ...prev, 
      [itemId]: Math.max(0, prev[itemId] - 1) 
    }));
  };

  // Calcular total del pedido
  const calculateTotal = () => {
    return MENU_ITEMS.reduce((total, item) => {
      return total + (item.price * quantities[item.id]);
    }, 0);
  };

  // Validar formulario
  const isFormValid = () => {
    const hasItems = Object.values(quantities).some(qty => qty > 0);
    const hasName = customerName.trim().length > 0;
    const hasEmail = customerEmail.trim().length > 0;
    return hasItems && hasName && hasEmail;
  };

  // Enviar pedido
  const handleSubmit = async () => {
    // Marcar campos como tocados al intentar enviar
    setTouched({ name: true, email: true });
    
    if (!isFormValid()) {
      setError('Please enter your name, email, and select at least one item');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Preparar items del pedido
      const items = MENU_ITEMS
        .filter(item => quantities[item.id] > 0)
        .map(item => ({
          name: item.name,
          quantity: quantities[item.id],
          price: item.price,
        }));

      // Crear pedido
      const orderData = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        items,
        notes: notes.trim() || undefined,
      };

      const response = await createOrder(orderData);
      
      // Guardar datos del pedido
      setOrderNumber(response.orderNumber);
      setOrderId(response.orderId);
      
      // Mostrar modal de éxito
      setShowModal(true);
    } catch (err) {
      setError('Error creating the order. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar modal y redireccionar
  const handleModalClose = () => {
    setShowModal(false);
    navigate(`/orders/${orderId}`);
  };

  const total = calculateTotal();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-32">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <div className="text-[#181311] dark:text-white flex size-12 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined text-3xl">restaurant</span>
        </div>
        <h2 className="text-[#181311] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1">
          Delicious Kitchen
        </h2>
      </div>

      <main className="flex flex-col gap-4">
        {/* Sección de detalles del cliente */}
        <div className="bg-white dark:bg-background-dark pt-5">
          <h2 className="text-[#181311] dark:text-white tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3">
            Your Details
          </h2>
          
          <div className="flex flex-col gap-4 px-4 py-3">
            {/* Campo Nombre */}
            <label className="flex flex-col">
              <p className="text-[#181311] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Your Name *
              </p>
              <input
                type="text"
                className={`form-input flex w-full resize-none overflow-hidden rounded-lg text-[#181311] dark:text-white focus:outline-0 focus:ring-0 border ${
                  touched.name && customerName.trim().length === 0
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-[#e6dfdb] dark:border-gray-600'
                } bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#896f61] p-[15px] text-base font-normal leading-normal`}
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
              />
              {touched.name && customerName.trim().length === 0 && (
                <p className="text-red-500 text-sm mt-1">Name is required</p>
              )}
            </label>

            {/* Campo Email */}
            <label className="flex flex-col">
              <p className="text-[#181311] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Your Email *
              </p>
              <input
                type="email"
                className={`form-input flex w-full resize-none overflow-hidden rounded-lg text-[#181311] dark:text-white focus:outline-0 focus:ring-0 border ${
                  touched.email && customerEmail.trim().length === 0
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-[#e6dfdb] dark:border-gray-600'
                } bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#896f61] p-[15px] text-base font-normal leading-normal`}
                placeholder="your@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              />
              {touched.email && customerEmail.trim().length === 0 && (
                <p className="text-red-500 text-sm mt-1">Email is required</p>
              )}
            </label>

            {/* Campo Notas */}
            <label className="flex flex-col">
              <p className="text-[#181311] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Special Notes (optional)
              </p>
              <textarea
                className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#181311] dark:text-white focus:outline-0 focus:ring-0 border border-[#e6dfdb] dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary placeholder:text-[#896f61] p-[15px] text-base font-normal leading-normal"
                placeholder="Allergies, preferences, special instructions..."
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Sección del menú */}
        <div className="bg-white dark:bg-background-dark pt-5">
          <h2 className="text-[#181311] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">
            What are you craving?
          </h2>

          {/* Lista de items del menú */}
          {MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-[72px] py-2 justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-12">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    {item.icon}
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[#181311] dark:text-white text-base font-medium leading-normal line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-[#896f61] dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
                    ${item.price.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>

              {/* Controles de cantidad */}
              <div className="shrink-0">
                <div className="flex items-center gap-2 text-[#181311] dark:text-white">
                  <button
                    onClick={() => decrement(item.id)}
                    className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-background-light dark:bg-gray-700 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    disabled={quantities[item.id] === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="text-base font-medium leading-normal w-4 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    value={quantities[item.id]}
                    readOnly
                  />
                  <button
                    onClick={() => increment(item.id)}
                    className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-background-light dark:bg-gray-700 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="px-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}
      </main>

      {/* Footer fijo con resumen y botón */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
            <span className="text-2xl font-bold text-[#181311] dark:text-white">
              ${total.toLocaleString('es-CO')}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading}
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed w-48 transition-colors"
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>

      {/* Modal de éxito */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-background-dark w-full max-w-sm rounded-xl shadow-lg p-6 text-center flex flex-col items-center animate-fadeIn">
            <div className="flex items-center justify-center size-16 bg-green-100 rounded-full mb-4">
              <span className="material-symbols-outlined text-4xl text-green-600">
                check_circle
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#181311] dark:text-white mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your order is being prepared.
            </p>
            <div className="bg-background-light dark:bg-gray-800 rounded-lg p-3 w-full">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Your Order Number
              </span>
              <p className="text-lg font-mono font-bold text-[#181311] dark:text-white tracking-wider">
                {orderNumber}
              </p>
            </div>
            <button
              onClick={handleModalClose}
              className="mt-6 bg-primary text-white font-bold py-3 px-6 rounded-lg w-full hover:bg-primary/90 transition-colors"
            >
              View Order Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}