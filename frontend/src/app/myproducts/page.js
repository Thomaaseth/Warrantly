"use client"

import React, { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../lib/api'
import styles from './Products.module.css'

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        dateBought: '',
        warrantyDuration: '',
        invoice: null
    });

useEffect(() => {
    fetchProducts();
}, []);

const fetchProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
};

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewProduct(prev => ({ ...prev, invoice: e.target.files[0] }));
  };


const handleCreateProduct = async (e) => {
    e.preventDefault();
    await createProduct(newProduct);
    fetchProducts();
    setNewProduct({ name: '', dateBought: '', warrantyDuration: '', invoice: null});
};

const handleUpdateProduct = async (id, updatedData) => {
    await updateProduct(id, updateProduct);
    fetchProducts();
}

const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    fetchProducts();
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
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <div className={styles.productList}>
        {products.map(product => (
          <div key={product.id} className={styles.productCard}>
            <h3>{product.name}</h3>
            <p>Date Bought: {product.dateBought}</p>
            <p>Warranty: {product.warrantyDuration}</p>
            <button onClick={() => handleUpdateProduct(product.id, { ...product })}>Update</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
)

}

export default MyProducts;