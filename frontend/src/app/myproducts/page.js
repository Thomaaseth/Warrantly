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
      warrantyUnit: 'years',
      invoice: null
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);


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

  const handleWarrantyUnitChange = (e, isEditing = false) => {
    const { value } = e.target;
    if (isEditing) {
        setEditingProduct(prev => ({ ...prev, warrantyUnit: value }));
    } else {
        setNewProduct(prev => ({ ...prev, warrantyUnit: value }));
    }
  };

  const handleCreateProduct = async (e) => {
      e.preventDefault();
      try {
          await createProduct(newProduct);
          fetchProducts();
          setNewProduct({ name: '', dateBought: '', warrantyDuration: '', warrantyUnit: 'years', invoice: null});
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

      const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
    };

    const calculateWarrantyInfo = (dateBought, warrantyDuration, warrantyUnit) => {
      const boughtDate = new Date(dateBought);
      const duration = parseInt(warrantyDuration);
      if (isNaN(duration)) {
        return { expirationDate: 'Invalid warranty duration', daysLeft: 'N/A' };
      }
      
      let expirationDate = new Date(boughtDate);
      if (warrantyUnit === 'years') {
        expirationDate.setFullYear(expirationDate.getFullYear() + duration);
      } else {
        expirationDate.setMonth(expirationDate.getMonth() + duration);
      }
      
      const today = new Date();
      const timeDiff = expirationDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      return {
        expirationDate: expirationDate.toLocaleDateString(),
        daysLeft: daysLeft > 0 ? daysLeft : 0
      };
    };

    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    const handleEditClick = (product) => {
      setEditingProduct({
        ...product,
        dateBought: formatDateForInput(product.dateBought)
      });
    };

    return (
        <div className={styles.myProducts}>
            <h1>My Products</h1>
            
            <button onClick={toggleForm} className={styles.toggleFormButton}>
              {isFormVisible ? 'Hide Add Product Form' : 'Add New Product'}
          </button>

          {isFormVisible && (
              <form onSubmit={handleCreateProduct} className={styles.addProductForm}>
                  <div className={styles.formGroup}>
                      <label htmlFor="name">Product Name:</label>
                      <input
                          id="name"
                          type="text"
                          name="name"
                          value={newProduct.name}
                          onChange={handleInputChange}
                          required
                      />
                  </div>
                  <div className={styles.formGroup}>
                      <label htmlFor="dateBought">Date Bought:</label>
                      <input
                          id="dateBought"
                          type="date"
                          name="dateBought"
                          value={newProduct.dateBought}
                          onChange={handleInputChange}
                          required
                      />
                  </div>
                  <div className={styles.formGroup}>
                      <label htmlFor="warrantyDuration">Warranty Duration (years):</label>
                      <input
                          id="warrantyDuration"
                          type="number"
                          name="warrantyDuration"
                          value={newProduct.warrantyDuration}
                          onChange={handleInputChange}
                          min="0"
                          step="1"
                          placeholder="Enter duration"
                          required
                      />
                      <select
                      name="warrantyUnit"
                      value={newProduct.warrantyUnit}
                      onChange={(e) => handleWarrantyUnitChange(e)}
                      >
                        <option value="years">Years</option>
                        <option value="months">Months</option>
                      </select>
                  </div>
                  <div className={styles.formGroup}>
                      <label htmlFor="invoice">Invoice:</label>
                      <input
                          id="invoice"
                          type="file"
                          name="invoice"
                          onChange={handleFileChange}
                          accept=".pdf,.png,.jpg,.jpeg"
                      />
                  </div>
                  <button type="submit">Add Product</button>
              </form>
          )}

            <div className={styles.productList}>
              {products.map(product => {
                const { expirationDate, daysLeft } = calculateWarrantyInfo(product.dateBought, product.warrantyDuration, product.warrantyUnit);
                return (
                  <div key={product._id} className={styles.productCard}>
                    <div className={styles.productCardInner}>
                      <div className={styles.productCardFront}>
                        <h3>{product.name}</h3>
                        <p>Warranty Until: {expirationDate}</p>
                        <p>Days Left: <strong>{daysLeft}</strong></p>
                      </div>
                      <div className={styles.productCardBack}>
                        <p>Date Bought: {new Date(product.dateBought).toLocaleDateString()}</p>
                        <p>Warranty Duration: {product.warrantyDuration} {product.warrantyUnit === 'years' ? 
                          (product.warrantyDuration === '1' ? 'year' : 'years') : 
                          (product.warrantyDuration === '1' ? 'month' : 'months')}
                        </p>
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
                              <select
                              name="warrantyUnit"
                              value={editingProduct.warrantyUnit}
                              onChange={(e) => handleWarrantyUnitChange(e, true)}
                            >
                              <option value="years">Years</option>
                              <option value="months">Months</option>
                            </select>
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
                            <button onClick={() => handleEditClick(product)}>Edit</button>
                            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
      </div>
    )
}

export default MyProducts;