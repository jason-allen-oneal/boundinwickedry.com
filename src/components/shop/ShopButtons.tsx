import {
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import Link from "next/link";
import AddToCart from "./AddToCart";
import BuyNow from "./BuyNow";

type Props = {
  item: Item;
  view: string;
};

const ShopButtons = ({ item, view }: Props) => {
  console.log("env", JSON.stringify(process.env));
  const ppOpts: ReactPayPalScriptOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
    currency: "USD",
    components: "buttons",
  };

  return (
    <>
      <PayPalScriptProvider options={ppOpts}>
        <div className="grid grid-1 gap-2">
          {view == "category" && (
            <div>
              <Link
                href={`/shop/item/${item.id}/${item.slug}`}
                className="btn btn-secondary"
                role="button"
              >
                View
              </Link>
            </div>
          )}
          <div>
            <BuyNow item={item} currency="USD" showSpinner={false} />
          </div>
          <div>
            <AddToCart item={item} />
          </div>
        </div>
      </PayPalScriptProvider>
    </>
  );
};

export default ShopButtons;
