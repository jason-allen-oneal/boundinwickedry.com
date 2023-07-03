import { useCart } from "@/lib/contexts/cart";
import { useNotification } from "@/lib/contexts/notification";

const AddToCart = ({ item }: Item) => {
  const { cart, setCart, setItemCount, itemCount } = useCart();
  const { toast } = useNotification();

  const handleClick = () => {
    const newItem = {
      name: item?.name,
      quantity: 1,
      category: "PHYSICAL_GOODS",
      sku: item?.id,
      unit_amount: {
        currency_code: "USD",
        value: item?.price,
      },
    };

    const items = [...cart, newItem];
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(cart));
    setItemCount(itemCount + 1);

    // toast success
    toast("success", "Added to cart!");
  };

  return (
    <button className="btn btn-outline btn-secondary" onClick={handleClick}>
      Add To Cart
    </button>
  );
};

export default AddToCart;
