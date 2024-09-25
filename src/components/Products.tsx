import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
  FIND_PRODUCTS,
  FIND_PRODUCT_BY_ID,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ACTIVATE_PRODUCT,
  DEACTIVATE_PRODUCT,
} from '../graphql/products';

const Products: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(FIND_PRODUCTS);
  const [loadProductById, { loading: searchLoading, data: searchData, error: searchError }] = useLazyQuery(FIND_PRODUCT_BY_ID);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [activateProduct] = useMutation(ACTIVATE_PRODUCT);
  const [deactivateProduct] = useMutation(DEACTIVATE_PRODUCT);

  const role = localStorage.getItem('role');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchId, setSearchId] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>(null);

  // Estados para la edición
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDescription, setEditDescription] = useState<string>('');

  React.useEffect(() => {
    if (searchData) {
      const data = searchData.findProductById;
      if (data.__typename === 'Product') {
        setSearchResult(data);
        setMessage('¡Producto encontrado!');
        setErrorMsg(null);
      } else if (data.__typename === 'Error') {
        setErrorMsg(`Error al buscar el producto: ${data.message}`);
        setSearchResult(null);
      } else {
        setErrorMsg('Error al buscar el producto.');
        setSearchResult(null);
      }
    }
    if (searchError) {
      console.error('Error buscando el producto:', searchError);
      setErrorMsg('Error al buscar el producto.');
      setSearchResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, searchError]);

  // Función para generar un ID único sin usar 'uuid'
  const generateId = () => {
    return 'prod_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
  };

  const handleCreateProduct = async () => {
    try {
      const product = {
        id: generateId(),
        price: 10.0,
        translations: [
          {
            language: 'en',
            description: 'Descripción del producto',
          },
        ],
      };

      const result = await createProduct({ variables: { product } });
      const createProductData = result.data.createProduct;

      if (createProductData.__typename === 'Product') {
        setMessage('¡Producto creado exitosamente!');
        refetch();
      } else if (createProductData.__typename === 'Error') {
        setErrorMsg(`Error al crear el producto: ${createProductData.message}`);
      } else {
        setErrorMsg('Error al crear el producto.');
      }
    } catch (err: any) {
      console.error('Error creando el producto:', err);
      setErrorMsg('Error al crear el producto.');
    }
  };

  const startEditingProduct = (product: any) => {
    setEditingProductId(product.id);
    setEditPrice(product.price);
    setEditDescription(product.translations[0]?.description || '');
  };

  const handleUpdateProduct = async () => {
    if (editingProductId === null) return;
    try {
      const product = {
        price: editPrice,
        translations: [
          {
            language: 'en',
            description: editDescription,
          },
        ],
      };

      const result = await updateProduct({ variables: { id: editingProductId, product } });
      const updateProductData = result.data.updateProduct;

      if (updateProductData.__typename === 'Product') {
        setMessage('¡Producto actualizado exitosamente!');
        setEditingProductId(null);
        refetch();
      } else if (updateProductData.__typename === 'Error') {
        setErrorMsg(`Error al actualizar el producto: ${updateProductData.message}`);
      } else {
        setErrorMsg('Error al actualizar el producto.');
      }
    } catch (err: any) {
      console.error('Error actualizando el producto:', err);
      setErrorMsg('Error al actualizar el producto.');
    }
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditPrice(0);
    setEditDescription('');
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const result = await deleteProduct({ variables: { id } });
      const deleteProductData = result.data.deleteProduct;

      if (deleteProductData.__typename === 'Product') {
        setMessage('¡Producto eliminado exitosamente!');
        refetch();
      } else if (deleteProductData.__typename === 'Error') {
        setErrorMsg(`Error al eliminar el producto: ${deleteProductData.message}`);
      } else {
        setErrorMsg('Error al eliminar el producto.');
      }
    } catch (err: any) {
      console.error('Error eliminando el producto:', err);
      setErrorMsg('Error al eliminar el producto.');
    }
  };

  const handleActivateProduct = async (id: string) => {
    try {
      const result = await activateProduct({ variables: { id } });
      const activateProductData = result.data.activateProduct;

      if (activateProductData.__typename === 'Product') {
        setMessage('¡Producto activado exitosamente!');
        refetch();
      } else if (activateProductData.__typename === 'Error') {
        setErrorMsg(`Error al activar el producto: ${activateProductData.message}`);
      } else {
        setErrorMsg('Error al activar el producto.');
      }
    } catch (err: any) {
      console.error('Error activando el producto:', err);
      setErrorMsg('Error al activar el producto.');
    }
  };

  const handleDeactivateProduct = async (id: string) => {
    try {
      const result = await deactivateProduct({ variables: { id } });
      const deactivateProductData = result.data.deactivateProduct;

      if (deactivateProductData.__typename === 'Product') {
        setMessage('¡Producto desactivado exitosamente!');
        refetch();
      } else if (deactivateProductData.__typename === 'Error') {
        setErrorMsg(`Error al desactivar el producto: ${deactivateProductData.message}`);
      } else {
        setErrorMsg('Error al desactivar el producto.');
      }
    } catch (err: any) {
      console.error('Error desactivando el producto:', err);
      setErrorMsg('Error al desactivar el producto.');
    }
  };

  const handleSearchProduct = () => {
    loadProductById({ variables: { id: searchId } });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      {message && <p className="text-green-500">{message}</p>}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {role === 'ADMIN' && (
        <div className="mb-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleCreateProduct}>
            Crear Producto
          </button>
        </div>
      )}

      {/* Buscador de productos */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto por ID"
          className="p-2 border border-gray-300 rounded mr-2"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleSearchProduct}>
          Buscar
        </button>
      </div>

      {/* Mostrar resultado de búsqueda */}
      {searchLoading && <p>Cargando producto...</p>}
      {searchResult && (
        <div className="mb-4 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-bold mb-2">Resultado de la búsqueda:</h2>
          {editingProductId === searchResult.id ? (
            <div>
              <p>Editar Producto ID: {searchResult.id}</p>
              <div>
                <label>
                  Precio:
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                    className="p-1 border border-gray-300 rounded ml-2"
                  />
                </label>
              </div>
              <div>
                <label>
                  Descripción:
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="p-1 border border-gray-300 rounded ml-2"
                  />
                </label>
              </div>
              <button
                className="bg-green-500 text-white py-1 px-2 rounded mr-2 mt-2"
                onClick={handleUpdateProduct}
              >
                Guardar
              </button>
              <button
                className="bg-gray-500 text-white py-1 px-2 rounded mt-2"
                onClick={cancelEdit}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <p>
                ID: {searchResult.id} - Precio: ${searchResult.price} - Activo:{' '}
                {searchResult.isActive ? 'Sí' : 'No'}
              </p>
              <ul>
                {searchResult.translations.map((translation: any, index: number) => (
                  <li key={index}>
                    <strong>Idioma:</strong> {translation.language} -{' '}
                    <strong>Descripción:</strong> {translation.description}
                  </li>
                ))}
              </ul>
              {role === 'ADMIN' && (
                <div className="mt-2">
                  <button
                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                    onClick={() => startEditingProduct(searchResult)}
                  >
                    Editar
                  </button>
                  {searchResult.isActive ? (
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded mr-2"
                      onClick={() => handleDeactivateProduct(searchResult.id)}
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                      onClick={() => handleActivateProduct(searchResult.id)}
                    >
                      Activar
                    </button>
                  )}
                  <button
                    className="bg-red-700 text-white py-1 px-2 rounded"
                    onClick={() => handleDeleteProduct(searchResult.id)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ul className="mt-4">
        {data.findProducts.map((product: any) => (
          <li key={product.id} className="p-2 border-b border-gray-200">
            {editingProductId === product.id ? (
              <div>
                <p>Editar Producto ID: {product.id}</p>
                <div>
                  <label>
                    Precio:
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                      className="p-1 border border-gray-300 rounded ml-2"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Descripción:
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="p-1 border border-gray-300 rounded ml-2"
                    />
                  </label>
                </div>
                <button
                  className="bg-green-500 text-white py-1 px-2 rounded mr-2 mt-2"
                  onClick={handleUpdateProduct}
                >
                  Guardar
                </button>
                <button
                  className="bg-gray-500 text-white py-1 px-2 rounded mt-2"
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                <p>
                  ID: {product.id} - Precio: ${product.price} - Activo: {product.isActive ? 'Sí' : 'No'}
                </p>
                <ul>
                  {product.translations.map((translation: any, index: number) => (
                    <li key={index}>
                      <strong>Idioma:</strong> {translation.language} -{' '}
                      <strong>Descripción:</strong> {translation.description}
                    </li>
                  ))}
                </ul>
                {role === 'ADMIN' && (
                  <div className="mt-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                      onClick={() => startEditingProduct(product)}
                    >
                      Editar
                    </button>
                    {product.isActive ? (
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded mr-2"
                        onClick={() => handleDeactivateProduct(product.id)}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                        onClick={() => handleActivateProduct(product.id)}
                      >
                        Activar
                      </button>
                    )}
                    <button
                      className="bg-red-700 text-white py-1 px-2 rounded"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;