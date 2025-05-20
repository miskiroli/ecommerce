import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ProductList from "./ProductList";
import UserList from "./UserList";
import OrderList from "./OrderList";
import './AdminDashboard.css';
import Swal from 'sweetalert2';
import { API } from "../api";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
    stock: 0,
    images: [null, null, null, null],
  });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API.ADMIN_PRODUCTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setNotification({ message: "Failed to fetch products", type: "error" });
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API.CATEGORIES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setNotification({ message: "Failed to fetch categories", type: "error" });
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API.ADMIN_USERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setNotification({ message: "Failed to fetch users", type: "error" });
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API.ADMIN_ORDERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setNotification({ message: "Failed to fetch orders", type: "error" });
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUsers();
    fetchOrders();
  }, [fetchProducts, fetchCategories, fetchUsers, fetchOrders]);

  // Termékek szűrése keresés és kategória alapján
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all"
      ? true
      : product.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Lapozás logika
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleEditProduct = (product) => {
    let existingImages = [];

    if (product.images) {
      if (typeof product.images === "string") {
        try {
          existingImages = JSON.parse(product.images);
        } catch (error) {
          console.error("Error parsing images as JSON, treating as single URL:", error);
          existingImages = [product.images];
        }
      } else if (Array.isArray(product.images)) {
        existingImages = product.images;
      } else {
        console.error("Unexpected images format:", product.images);
      }
    }

    if (!Array.isArray(existingImages)) {
      existingImages = [];
    }
    
    existingImages = existingImages.slice(0, 4);

    const paddingLength = Math.max(0, 4 - existingImages.length);
    const paddedImages = [...existingImages, ...Array(paddingLength).fill(null)];

    const formattedImages = paddedImages.map(img => 
      img 
        ? (img.startsWith("http") ? img : `http://shopzone.miskiroland.com/storage/${img}`)
        : null
    );

    setEditingProduct({
      ...product,
      existingImages: formattedImages,
      newImages: [null, null, null, null],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API.ADMIN_PRODUCT_DELETE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      setNotification({ message: "Product deleted successfully!", type: "success" });
    } catch (error) {
      console.error("Error deleting product:", error);
      setNotification({ message: "Error deleting product!", type: "error" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "price" || name === "stock" 
      ? (value === "" ? "" : Number(value)) 
      : value;
    
    if (editingProduct) {
      setEditingProduct((prev) => ({ ...prev, [name]: updatedValue }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: updatedValue }));
    }
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (editingProduct) {
      setEditingProduct((prev) => {
        const updatedNewImages = [...prev.newImages];
        updatedNewImages[index] = file;
        return { ...prev, newImages: updatedNewImages };
      });
    } else {
      setNewProduct((prev) => {
        const updatedImages = [...prev.images];
        updatedImages[index] = file;
        return { ...prev, images: updatedImages };
      });
    }
  };

  const handleRemoveExistingImage = (index) => {
    if (editingProduct) {
      setEditingProduct((prev) => {
        const updatedExistingImages = [...prev.existingImages];
        updatedExistingImages[index] = null;
        return { ...prev, existingImages: updatedExistingImages };
      });
    }
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    setLoading(true);

    const product = editingProduct || newProduct;

    if (!product.name || !product.price || !product.stock || !product.category_id || !product.description) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out all required fields!',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      if (editingProduct) {
        formData.append("_method", "PUT");
        
        product.existingImages.forEach((image, index) => {
          if (image && typeof image === "string") {
            formData.append(
              `existing_images[${index}]`,
              image.replace("http://shopzone.miskiroland.com/storage/", "")
            );
          }
        });

        product.newImages.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`new_images[${index}]`, image);
          }
        });
      } else {
        product.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      const fields = ['name', 'price', 'description', 'category_id', 'stock'];
      fields.forEach(key => {
        if (product[key] !== null && product[key] !== undefined) {
          formData.append(key, product[key]);
        }
      });

      const url = editingProduct
        ? API.PRODUCT_DETAIL
        : API.PRODUCTS;

      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: 'Success!',
        text: editingProduct ? 'Product updated!' : 'Product created successfully!',
        icon: 'success',
        confirmButtonColor: '#ff0000',
      });
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'An error occurred while saving the product!',
        icon: 'error',
        confirmButtonColor: '#ff0000',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      price: "",
      description: "",
      category_id: "",
      stock: 0,
      images: [null, null, null, null],
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="content">
        <h1>Admin Dashboard</h1>
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="tabs">
          <button
            onClick={() => setActiveTab("products")}
            className={activeTab === "products" ? "active" : ""}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={activeTab === "users" ? "active" : ""}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "active" : ""}
          >
            Orders
          </button>
        </div>

        {activeTab === "products" && (
          <>
            {/* Desktop: kategóriák gombként */}
            <div className="categories-filter">
              <span
                className={`category ${selectedCategory === 'all' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
              >
                All
              </span>
              {categories.map((category) => (
                <span
                  key={category.id}
                  className={`category ${selectedCategory === category.id.toString() ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category.id.toString());
                    setCurrentPage(1);
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>

            {/* Mobil: kategóriák legördülő menüben */}
            <div className="mobile-category-select">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-and-pagination">
              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setCurrentPage(1);
                    }
                  }}
                />
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? 'active' : ''}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitProduct} className="product-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Product name"
                  value={editingProduct?.name || newProduct.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={editingProduct?.price || newProduct.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={editingProduct?.stock || newProduct.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
                <select
                  name="category_id"
                  value={editingProduct?.category_id || newProduct.category_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editingProduct?.description || newProduct.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="image-upload-group">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="image-upload">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(index, e)}
                      accept="image/*"
                    />
                    {editingProduct && editingProduct.existingImages[index] && (
                      <div className="image-preview">
                        <img
                          src={editingProduct.existingImages[index]}
                          alt={`Product ${index}`}
                          style={{ maxWidth: "100px" }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {editingProduct && editingProduct.newImages[index] instanceof File && (
                      <div className="image-preview">
                        <img
                          src={URL.createObjectURL(editingProduct.newImages[index])}
                          alt={`New ${index}`}
                          style={{ maxWidth: "100px" }}
                        />
                      </div>
                    )}
                    {!editingProduct && newProduct.images[index] instanceof File && (
                      <div className="image-preview">
                        <img
                          src={URL.createObjectURL(newProduct.images[index])}
                          alt={`New ${index}`}
                          style={{ maxWidth: "100px" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </button>
                {(editingProduct || newProduct.name) && (
                  <button type="button" onClick={resetForm} disabled={loading}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <ProductList
              products={paginatedProducts}
              onDelete={handleDeleteProduct}
              onEdit={handleEditProduct}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
        {activeTab === "users" && <UserList users={users} onDelete={fetchUsers} />}
        {activeTab === "orders" && <OrderList orders={orders} />}
      </div>
    </div>
  );
};

export default AdminDashboard;