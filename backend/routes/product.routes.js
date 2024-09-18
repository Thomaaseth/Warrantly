const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all products for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find({ user: req.payload.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Create a new product
router.post('/', isAuthenticated, upload.single('invoice'), async (req, res) => {
  try {
    const { name, dateBought, warrantyDuration } = req.body;
    const invoiceUrl = req.file ? req.file.path : null;
    const newProduct = new Product({
      name,
      dateBought,
      warrantyDuration,
      invoiceUrl,
      user: req.payload.id
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
});

// Update a product
router.put('/:id', isAuthenticated, upload.single('invoice'), async (req, res) => {
  try {
    const { name, dateBought, warrantyDuration } = req.body;
    const updateData = { name, dateBought, warrantyDuration };
    if (req.file) {
      updateData.invoiceUrl = req.file.path;
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.payload.id },
      updateData,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
});

// Delete a product
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, user: req.payload.id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error });
  }
});

module.exports = router;