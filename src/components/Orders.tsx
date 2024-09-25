import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
  FIND_ORDERS,
  FIND_ORDER_BY_ID,
  CREATE_ORDER,
  MARK_ORDER_AS_RECEIVED,
  CANCEL_ORDER,
} from '../graphql/orders';
import { FIND_PRODUCTS } from '../graphql/products';

const Orders: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(FIND_ORDERS);
  const { loading: productsLoading, error: productsError, data: productsData } = useQuery(FIND_PRODUCTS);
  const [createOrder] = useMutation(CREATE_ORDER);
  const [markOrderAsReceived] = useMutation(MARK_ORDER_AS_RECEIVED);
  const [cancelOrder] = useMutation(CANCEL_ORDER);
  const [searchOrderById, { data: searchData, loading: searchLoading, error: searchError }] = useLazyQuery(FIND_ORDER_BY_ID);

  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderProductId, setOrderProductId] = useState<string>('');
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>(null);

  React.useEffect(() => {
    if (searchData) {
      const data = searchData.findOrderById;
      if (data.__typename === 'Order') {
        setSearchResult(data);
        setMessage('¡Orden encontrada!');
        setErrorMsg(null);
      } else if (data.__typename === 'Error') {
        setErrorMsg(`Error al buscar la orden: ${data.message}`);
        setSearchResult(null);
      } else {
        setErrorMsg('Error al buscar la orden.');
        setSearchResult(null);
      }
    }
    if (searchError) {
      console.error('Error buscando la orden:', searchError);
      setErrorMsg('Error al buscar la orden.');
      setSearchResult(null);
    }
  }, [searchData, searchError]);

  if (loading || productsLoading) return <p>Cargando...</p>;
  if (error || productsError) return <p>Error: {error?.message || productsError?.message}</p>;

  const handleCreateOrder = async () => {
    try {
      if (!orderProductId) {
        setErrorMsg('Por favor, selecciona un producto.');
        return;
      }

      const order = {
        productId: orderProductId,
        quantity: orderQuantity,
      };

      const result = await createOrder({ variables: { order } });
      const createOrderData = result.data.createOrder;

      if (createOrderData.__typename === 'Order') {
        setMessage('¡Orden creada exitosamente!');
        setErrorMsg(null);
        refetch();
      } else if (createOrderData.__typename === 'Error') {
        setErrorMsg(`Error al crear la orden: ${createOrderData.message}`);
      } else {
        setErrorMsg('Error al crear la orden.');
      }
    } catch (err: any) {
      console.error('Error creando la orden:', err);
      setErrorMsg('Error al crear la orden.');
    }
  };

  const handleMarkOrderAsReceived = async (id: string) => {
    try {
      const result = await markOrderAsReceived({ variables: { id } });
      const data = result.data.markOrderAsReceived;

      if (data.__typename === 'Order') {
        setMessage('¡Orden marcada como recibida!');
        setErrorMsg(null);
        refetch();
      } else if (data.__typename === 'Error') {
        setErrorMsg(`Error al actualizar la orden: ${data.message}`);
      } else {
        setErrorMsg('Error al actualizar la orden.');
      }
    } catch (err: any) {
      console.error('Error actualizando la orden:', err);
      setErrorMsg('Error al actualizar la orden.');
    }
  };

  const handleCancelOrder = async (id: string) => {
    try {
      const result = await cancelOrder({ variables: { id } });
      const data = result.data.cancelOrder;

      if (data.__typename === 'Order') {
        setMessage('¡Orden cancelada!');
        setErrorMsg(null);
        refetch();
      } else if (data.__typename === 'Error') {
        setErrorMsg(`Error al cancelar la orden: ${data.message}`);
      } else {
        setErrorMsg('Error al cancelar la orden.');
      }
    } catch (err: any) {
      console.error('Error cancelando la orden:', err);
      setErrorMsg('Error al cancelar la orden.');
    }
  };

  const handleSearchOrder = () => {
    if (!searchOrderId) {
      setErrorMsg('Por favor, ingresa un ID de orden.');
      return;
    }
    searchOrderById({ variables: { id: searchOrderId } });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Órdenes</h1>

      {message && <p className="text-green-500">{message}</p>}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {/* Formulario para crear una nueva orden */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Crear Nueva Orden</h2>
        <div className="mb-2">
          <label className="block mb-1">Producto:</label>
          <select
            value={orderProductId}
            onChange={(e) => setOrderProductId(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="">Seleccione un producto</option>
            {productsData.findProducts.map((product: any) => (
              <option key={product.id} value={product.id}>
                {product.translations[0]?.description || 'Sin descripción'} (ID: {product.id})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Cantidad:</label>
          <input
            type="number"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
            min="1"
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
          onClick={handleCreateOrder}
        >
          Crear Orden
        </button>
      </div>

      {/* Buscador de órdenes */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Buscar Orden por ID</h2>
        <input
          type="text"
          placeholder="ID de la orden"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button
          className="bg-green-500 text-white py-2 px-4 rounded"
          onClick={handleSearchOrder}
        >
          Buscar
        </button>
      </div>

      {/* Mostrar resultado de búsqueda */}
      {searchLoading && <p>Cargando orden...</p>}
      {searchResult && (
        <div className="mb-4 p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-bold mb-2">Detalle de la Orden</h3>
          <p>
            ID: {searchResult.id} - Estado: {searchResult.status} - Cantidad: {searchResult.quantity} - Total: ${searchResult.total}
          </p>
          <p>
            Producto: {searchResult.product.translations[0]?.description || 'Sin descripción'} (ID: {searchResult.product.id})
          </p>
          <div className="mt-2">
            {searchResult.status === 'PENDING' && (
              <>
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                  onClick={() => handleMarkOrderAsReceived(searchResult.id)}
                >
                  Marcar como Recibida
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded"
                  onClick={() => handleCancelOrder(searchResult.id)}
                >
                  Cancelar Orden
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Lista de órdenes */}
      <h2 className="text-xl font-bold mb-2">Lista de Órdenes</h2>
      <ul className="mt-4">
        {data.findOrders.map((order: any) => (
          <li key={order.id} className="p-2 border-b border-gray-200">
            <p>
              Orden #{order.id} - Estado: {order.status} - Cantidad: {order.quantity} - Total: ${order.total}
            </p>
            <p>
              Producto: {order.product.translations[0]?.description || 'Sin descripción'} (ID: {order.product.id})
            </p>
            {order.status === 'PENDING' && (
              <div className="mt-2">
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                  onClick={() => handleMarkOrderAsReceived(order.id)}
                >
                  Marcar como Recibida
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancelar Orden
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;