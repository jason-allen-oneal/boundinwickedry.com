import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/contexts/cart";
import Link from "next/link";

const CartItem = ({ item }: { item: Item }) => {
  const { data: session } = useSession();
  const { cart, setCart, setItemCount, itemCount } = useCart();
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [itemData, setItemData] = useState<Item>(null);

  useEffect(() => {
    fetch("/api/shop/item/" + item.sku)
      .then((res) => res.json())
      .then((itm) => {
        setItemData(itm.result);
        setPrice(qty * itemData.price);
      });
  }, [item, setItemData, itemData, setPrice, qty]);

  const handleQty = (e: any) => {
    const quantity = e.target.value;

    setQty(quantity);
    setPrice(quantity * itemData.price);
  };

  const removeItem = (id: number) => {
    const remaining = cart.filter((cart) => cart.sku != id);
    setCart(remaining);
    setItemCount(itemCount - 1);
  };

  let subtype = 3;
  if (session) {
    subtype = session?.user.subtype;
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="grid grid-cols-1 gap-1">
        <div>
          <Image
            className="shop-item-image"
            src={itemData.image}
            width={100}
            height={100}
            alt={itemData.name}
          />
        </div>
        <div>
          <Link href={`/shop/item/${itemData.id}/${itemData.slug}/`}>
            {itemData.name}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <div>
          Qty:{" "}
          <select value={qty} onChange={handleQty}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <div>Price: {formatPrice(price as unknown as string, subtype)}</div>
      </div>
      <div>
        <button
          className="btn btn-outine btn-secondary"
          onClick={() => removeItem(itemData.sku)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
