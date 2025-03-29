import { motion } from 'framer-motion';
import { FavouriteIcon } from 'hugeicons-react';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  discount?: number;
}

export const ProductCard = ({ name, description, price, image, discount }: ProductCardProps) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="relative bg-background rounded-[--radius] shadow-sm overflow-hidden group">
      <div className="relative aspect-square">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <FavouriteIcon className="w-5 h-5 text-secondary" />
        </button>
        {discount && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-[--radius] text-sm font-medium">
            {discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">GH₵ {price.toLocaleString()}</span>
            {discount && (
              <span className="ml-2 text-sm text-muted-foreground line-through">GH₵ {(price * (1 + discount / 100)).toLocaleString()}</span>
            )}
          </div>
          <button className="bg-secondary text-secondary-foreground px-3 py-1 rounded-[--radius] text-sm hover:bg-secondary-dark transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};
