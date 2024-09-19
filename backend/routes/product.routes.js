const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all products for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  console.log('Auth middleware passed');
  console.log('req.user:', req.user);
  try {
    const products = await Product.find({ user: req.user._id });
    console.log('Products found:', products);
    res.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.toString() });
  }
});
// Create a new product
router.post('/', isAuthenticated, upload.single('invoice'), async (req, res) => {
  try {
    const { name, dateBought, warrantyDuration } = req.body;
    const invoiceUrl = req.file ? req.file.path : null;
    console.log('Received product data:', { name, dateBought, warrantyDuration, invoiceUrl });
    console.log('User ID:', req.user); 

    if (!name || !dateBought || !warrantyDuration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!req.user || !req.user._id) {
      console.log('Authentication failed. req.user:', req.user);
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const newProduct = new Product({
      name,
      dateBought,
      warrantyDuration,
      invoiceUrl,
      user: req.user._id
    });
    await newProduct.save();
    console.log(newProduct)
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error in product creation:', error);
    res.status(400).json({ message: 'Error creating product', error });
  }
});

// Update a product
router.put('/:id', isAuthenticated, upload.single('invoice'), async (req, res) => {
  console.log('PUT request received');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  try {

    if (!req.params.id) {
      return res.status(400).json({ message: 'Product ID is required'});
    }

    const { name, dateBought, warrantyDuration } = req.body;
    const updateData = { name, dateBought, warrantyDuration };

    if (req.file) {
      updateData.invoiceUrl = req.file.path;
    }

    console.log('Update data:', updateData);

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );
    if (!updatedProduct) {
      console.log('Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Updated product:', updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error in product update:', error);

    res.status(400).json({ message: 'Error updating product', error });
  }
});

// Delete a product
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error });
  }
});

module.exports = router;