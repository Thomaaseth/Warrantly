"use client"

import React, { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../lib/api'
import { toast } from "react-toastify";
import styles from './Products.module.css'
import { TOAST_MESSAGES } from "@/utils/toastMessage";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
      name: '',
      dateBought: '',
      warrantyDuration: '',
      invoice: null
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
      fetchProducts();
  }, []);

  const fetchProducts = async () => {
      try {
          const fetchedProducts = await getProducts();
          setProducts(fetchedProducts.data);
      } catch (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to fetch products. Please try again.");
      }
  };

  const handleInputChange = (e, isEditing = false) => {
      const { name, value } = e.target;
      if (isEditing) {
          setEditingProduct(prev => ({ ...prev, [name]: value }));
      } else {
          setNewProduct(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleFileChange = (e, isEditing = false) => {
      if (isEditing) {
          setEditingProduct(prev => ({ ...prev, invoice: e.target.files[0] }));
      } else {
          setNewProduct(prev => ({ ...prev, invoice: e.target.files[0] }));
      }
  };

  const handleCreateProduct = async (e) => {
      e.preventDefault();
      try {
          await createProduct(newProduct);
          fetchProducts();
          setNewProduct({ name: '', dateBought: '', warrantyDuration: '', invoice: null});
          toast.success(TOAST_MESSAGES.PRODUCT_CREATED_SUCCESS);
      } catch (error) {
          console.error("Error creating product:", error);
          toast.error(TOAST_MESSAGES.PRODUCT_CREATED_FAIL);
      }
  };

  const handleUpdateProduct = async (e) => {
      e.preventDefault();
      try {
          await updateProduct(editingProduct._id, editingProduct);
          fetchProducts();
          setEditingProduct(null);
          toast.success(TOAST_MESSAGES.PRODUCT_UPDATE_SUCCESS);
      } catch (error) {
          console.error("Error updating product:", error);
          toast.error(TOAST_MESSAGES.PRODUCT_UPDATE_FAIL);
      }
  };

  const handleDeleteProduct = async (id) => {
      try {
          await deleteProduct(id);
          fetchProducts();
          toast.success(TOAST_MESSAGES.PRODUCT_DELETE_SUCCESS);
      } catch (error) {
          console.error("Error deleting product:", error);
          toast.error(TOAST_MESSAGES.PRODUCT_DELETE_FAIL);
      }
  };

    return (
        <div className={styles.myProducts}>
            <h1>My Products</h1>
            
            <form onSubmit={handleCreateProduct}>
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    required
                />
                <input
                    type="date"
                    name="dateBought"
                    value={newProduct.dateBought}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="warrantyDuration"
                    value={newProduct.warrantyDuration}
                    onChange={handleInputChange}
                    placeholder="Warranty Duration"
                    required
                />
                <input
                    type="file"
                    name="invoice"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg"
                />
                <button type="submit">Add Product</button>
            </form>

            <div className={styles.productList}>
                {products.map(product => (
                    <div key={product._id} className={styles.productCard}>
                        {editingProduct && editingProduct._id === product._id ? (
                            <form onSubmit={handleUpdateProduct}>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingProduct.name}
                                    onChange={(e) => handleInputChange(e, true)}
                                    required
                                />
                                <input
                                    type="date"
                                    name="dateBought"
                                    value={editingProduct.dateBought}
                                    onChange={(e) => handleInputChange(e, true)}
                                    required
                                />
                                <input
                                    type="text"
                                    name="warrantyDuration"
                                    value={editingProduct.warrantyDuration}
                                    onChange={(e) => handleInputChange(e, true)}
                                    required
                                />
                                <input
                                    type="file"
                                    name="invoice"
                                    onChange={(e) => handleFileChange(e, true)}
                                    accept=".pdf,.png,.jpg,.jpeg"
                                />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <h3>{product.name}</h3>
                                <p>Date Bought: {new Date(product.dateBought).toLocaleDateString()}</p>
                                <p>Warranty: {product.warrantyDuration}</p>
                                <button onClick={() => setEditingProduct(product)}>Edit</button>
                                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyProducts;