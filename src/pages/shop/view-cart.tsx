import type { NextPage } from "next";
import Layout from "@/components/Layout";
import CartItem from "@/components/shop/CartItem";
import { useCart } from "@/lib/contexts/cart";
import * as paypal from "@/lib/paypal";
import { formatPrice } from "@/lib/utils";
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";

export const getServerSideProps = async (ctx: any) => {
  return {
    props: {
      session: await getServerSession(ctx.req, ctx.res, nextAuthOptions),
    },
  };
};

const ShopCartPage: NextPage = () => {
  const { data: session } = useSession();
  const { cart, itemCount, setCart } = useCart();
  const data = {
    title: "View Cart",
    description: "Buy your secrets.",
  };

  let total = 0;

  if (cart.length > 0) {
    for (const item of cart) {
      total += item.unit_amount.value;
    }

    total += 10;
  }

  const handleClear = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const handleCheckout = async () => {
    try {
      const orderData = await paypal.createOrder(cart);

      console.log("returned orderData", JSON.stringify(orderData));

      window.location.href = orderData.links[1].href;
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <Layout data={data}>
      <h1>My Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-4">
        {cart && cart.length ? (
          cart.map((item: Item, index: number) => (
            <CartItem key={index} item={item} />
          ))
        ) : (
          <p>There are no items in your cart.</p>
        )}
      </div>
      <div>&nbsp;</div>
      <div className="grid grid-cols-3 gap-4 pt-6">
        <div>
          Cart total:{" "}
          {formatPrice(
            total as unknown as string,
            session?.user.subtype as number
          )}
        </div>
        <div>
          <button
            className="btn btn-secondary btn-outline"
            onClick={handleClear}
          >
            Clear Cart
          </button>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ShopCartPage;
