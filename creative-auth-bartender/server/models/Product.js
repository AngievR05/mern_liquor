import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
