const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// UserCart schema
const UserCartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserCart', UserCartSchema);
