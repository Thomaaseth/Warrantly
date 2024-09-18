const mongoose = require('mongoose');

const ProductModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dateBought: {
        type: Date,
        required: true
    },
    warrantyDuration: {
        type: String,
        required: true
    },
    invoiceUrl: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Product', ProductModel);