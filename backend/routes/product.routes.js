const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all products for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.status(200).json({
      message: `Successfully retrieved ${products.length} product(s)`,
      data: products
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.toString() });
  }
});

// Create a new product
router.post('/', isAuthenticated, upload.single('invoice'), async (req, res) => {
  try {
    const { name, dateBought, warrantyDuration, warrantyUnit } = req.body;
    const invoiceUrl = req.file ? req.file.path : null;

    if (!name || !dateBought || !warrantyDuration || !warrantyUnit) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const newProduct = new Product({
      name,
      dateBought,
      warrantyDuration,
      warrantyUnit,
      invoiceUrl,
      user: req.user._id
    });
    await newProduct.save();
    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.toString() });
  }
});

// Update a product
router.put('/:id', isAuthenticated, upload.single('invoice'), async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const { name, dateBought, warrantyDuration, warrantyUnit } = req.body;
    const updateData = { name, dateBought, warrantyDuration, warrantyUnit };

    if (req.file) {
      updateData.invoiceUrl = req.file.path;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.toString() });
  }
});

// Delete a product
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error: error.toString() });
  }
});

module.exports = router;