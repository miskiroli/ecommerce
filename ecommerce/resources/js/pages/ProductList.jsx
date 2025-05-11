import React from 'react';
import './ProductList.css';

const ProductList = ({ products, onDelete, onEdit }) => {
  return (
    <div className="product-list">
      <h2>Termékek Listája</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Kép</th>
            <th>Név</th>
            <th>Ár</th>
            <th>Kategória</th>
            <th>Leírás</th>
            <th>Készlet</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: '100px' }}
                  />
                ) : (
                  <div>No image available</div>
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.price} Ft</td>
              <td>{product.category?.name}</td>
              <td>{product.description}</td>
              <td>{product.stock}</td> {/* Készlet megjelenítése */}
              <td>
                <button onClick={() => onEdit(product)}>Szerkesztés</button>
                <button onClick={() => onDelete(product.id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
