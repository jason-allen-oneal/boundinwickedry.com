import * as paypal from "@/lib/paypal";

const BuyNow = ({ item }: Item) => {
  const handleClick = async () => {
    const data = {
      description: "BoundInWickedry.com - " + item?.name,
      amount: {
        currency_code: "USD",
        value: item?.price + 10,
        breakdown: {
          item_total: {
            currency_code: "USD",
            value: item?.price,
          },
          shipping: {
            currency_code: "USD",
            value: "10",
          },
        },
      },
    };

    try {
      const orderData = await paypal.createOrder(data);
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <button className="btn btn-secondary" onClick={handleClick}>
      Buy Now
    </button>
  );
};

export default BuyNow;
