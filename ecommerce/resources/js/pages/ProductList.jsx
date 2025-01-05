import React, { useState } from 'react';
import './ProductList.css';

const ProductList = ({ products, categories, onDelete, onAdd }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    images: { image1: null, image2: null, image3: null, image4: null },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewProduct({
      ...newProduct,
      images: { ...newProduct.images, [name]: files[0] },
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('category_id', newProduct.category_id);

    Object.keys(newProduct.images).forEach((key) => {
      if (newProduct.images[key]) {
        formData.append(key, newProduct.images[key]);
      }
    });

    onAdd(formData);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category_id: '',
      images: { image1: null, image2: null, image3: null, image4: null },
    });
  };

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
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
            <td>
  {product.images && product.images.length > 0 ? (
    <div className="product-image-container">
      <img
        src={product.images[0]?.url || product.images[0]} 
        alt={product.name}
        style={{ width: '100px' }}
      />
    </div>
  ) : (
    <div>No image available</div>
  )}
</td>

              <td>{product.name}</td>
              <td>{product.price} Ft</td>
              <td>{product.category?.name}</td>
              <td>{product.description}</td>
              <td>
                <button onClick={() => onDelete(product.id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Új Termék Hozzáadása</h3>
      <form onSubmit={handleAdd} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Termék neve"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Ár"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Leírás"
          value={newProduct.description}
          onChange={handleInputChange}
          required
        />
        <select
          name="category_id"
          value={newProduct.category_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Válassz kategóriát</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div>
          <label>Kép 1:</label>
          <input type="file" name="image1" onChange={handleFileChange} accept="image/*" />
        </div>
        <div>
          <label>Kép 2:</label>
          <input type="file" name="image2" onChange={handleFileChange} accept="image/*" />
        </div>
        <div>
          <label>Kép 3:</label>
          <input type="file" name="image3" onChange={handleFileChange} accept="image/*" />
        </div>
        <div>
          <label>Kép 4:</label>
          <input type="file" name="image4" onChange={handleFileChange} accept="image/*" />
        </div>
        <button type="submit">Hozzáadás</button>
      </form>
    </div>
  );
};

export default ProductList;
