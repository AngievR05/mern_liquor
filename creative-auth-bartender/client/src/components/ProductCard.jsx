import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-2xl shadow-md p-4 hover:shadow-lg transition">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-xl mb-3" />
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-primary font-bold text-lg">${product.price}</span>
        <Link to={`/product/${product._id}`} className="text-sm text-blue-500 hover:underline">
          View Details
        </Link>
      </div>
      {product.stock !== undefined && (
        <p className="text-xs mt-1 text-gray-500">Stock: {product.stock}</p>
      )}
      {product.rating && (
        <p className="text-xs mt-1 text-yellow-500">⭐ {product.rating}/5</p>
      )}
    </div>
  );
};

export default ProductCard;
