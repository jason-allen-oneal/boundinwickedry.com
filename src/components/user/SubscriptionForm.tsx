import Script from 'next/script';
import { useState } from "react";
import { PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import SubscriptionButtons from './SubscriptionButtons';

type Props = {
  payload: {
    subtype: number;
    fullname: string;
    setFullname: (name: string) => void;
    setFormComplete: (complete: boolean) => void;
    nameSet: boolean;
    setNameSet: (isSet: boolean) => void;
  }
}

const ppOpts = {
  "client-id": "AZnh8Q8TSrEWDdCj7cRxguPwIbJjOcAFzyDfnQwluMe6wgEUW8rzre_HljIPxKGFj9_gcaqVh6PTfRNH",
  intent: "subscription",
  vault: true,
  currency: "USD",
  components: "buttons"
};

const SubscriptionForm = ({ payload }: Props) => {
  const handleNameChange = (e: any) => {
    if(e.target.value.length > 3) {
      payload.setNameSet(true);
      payload.setFullname(e.target.value);
    }
  };
  
  let plan = '';
  
  switch(payload.subtype){
    case 2:
      plan = 'P-82G21342EF0514046ME7JQCQ';
    break;
    
    case 1:
      plan = 'P-5Y172406XD901071MME7JPII';
    break;
    
    default:
    case 0:
      plan = 'P-4EV36524K44685123MFVQDTA';
    break;
  }
  
  return (
    <>
      <input
        onChange={handleNameChange}
        className="form-control"
        id="paymentName"
        type="text"
        placeholder="Enter your full name"
        aria-label="Enter your full name"
      />
      <div className="ppbutton">
        <PayPalScriptProvider options={ppOpts}>
          <SubscriptionButtons
            nameIsSet={payload.nameSet}
            plan={plan}
            setFormComplete={payload.setFormComplete}
          />
        </PayPalScriptProvider>
      </div>
    </>
  );
}

export default SubscriptionForm;