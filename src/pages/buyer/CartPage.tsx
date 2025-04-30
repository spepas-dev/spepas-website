import CartList from '@/components/buyer/CartList';

export default function CartPage() {
  return (
    <div className="max-w-4xl w-[80%] mx-auto p-4 pt-20">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>
      <CartList />
    </div>
  );
}
