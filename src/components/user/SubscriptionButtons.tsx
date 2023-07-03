import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

type Props = {
  setFormComplete: (complete: boolean) => void;
  nameIsSet: boolean;
  plan: string;
};

const SubscriptionButtons = ({ setFormComplete, nameIsSet, plan }: Props) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: "USD",
      },
    });
  }, [dispatch, options]);

  return (
    <>
      <PayPalButtons
        style={{
          shape: "pill",
          color: "black",
          layout: "vertical",
          label: "subscribe",
        }}
        disabled={false}
        forceReRender={["USD"]}
        fundingSource={undefined}
        onInit={(data, actions) => {
          actions.disable();
          if (nameIsSet) {
            actions.enable();
          }
        }}
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: plan,
          });
        }}
        onApprove={async (data, actions) => {
          setFormComplete(true);
        }}
      />
    </>
  );
};

export default SubscriptionButtons;
