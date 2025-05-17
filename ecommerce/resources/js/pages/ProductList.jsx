import React from 'react';
import './ProductList.css';
import Swal from 'sweetalert2';

const ProductList = ({ products, onDelete, onEdit, currentPage, totalPages, onPageChange }) => {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this product?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await onDelete(id);
        Swal.fire({
          title: 'Successful Deletion!',
          text: 'The product has been deleted.',
          icon: 'success',
          confirmButtonColor: '#ff0000',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete the product.',
          icon: 'error',
          confirmButtonColor: '#ff0000',
        });
      }
    }
  };

  return (
    <div className="product-list">
      <h2>Products List</h2>
      {products.length === 0 ? (
        <div className="no-products">No results found for the search.</div>
      ) : (
        <>
          {/* Desktop nézetben táblázat, mobil nézetben kártyák */}
          <div className="product-table">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-card-image">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div>No image available</div>
                  )}
                </div>
                <div className="product-card-details">
                  <div className="product-card-row">
                    <span className="product-card-label">Name:</span>
                    <span className="product-card-value">{product.name}</span>
                  </div>
                  <div className="product-card-row">
                    <span className="product-card-label">Price:</span>
                    <span className="product-card-value">{product.price} USD</span>
                  </div>
                  <div className="product-card-row">
                    <span className="product-card-label">Category:</span>
                    <span className="product-card-value">{product.category?.name || 'No category'}</span>
                  </div>
                  <div className="product-card-row">
                    <span className="product-card-label">Description:</span>
                    <span className="product-card-value">{product.description}</span>
                  </div>
                  <div className="product-card-row">
                    <span className="product-card-label">Stock:</span>
                    <span className="product-card-value">{product.stock}</span>
                  </div>
                </div>
                <div className="product-card-actions">
                  <button onClick={() => onEdit(product)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {/* Táblázat desktop nézethez */}
            <table className="product-table-desktop">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Stock</th>
                  <th>Actions</th>
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
                    <td>{product.price} USD</td>
                    <td>{product.category?.name || 'No category'}</td>
                    <td>{product.description}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button onClick={() => onEdit(product)} className="edit-button">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="delete-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;