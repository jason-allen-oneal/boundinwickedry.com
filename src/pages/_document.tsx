import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import { useState, useEffect, useContext } from "react";
import { useCart } from "@/lib/contexts/cart";

export default function Document() {
  const { cart, setCart, itemCount, setItemCount } = useCart();

  useEffect(() => {
    const cartData = JSON.parse(
      localStorage.getItem("cart") as unknown as string
    );
    if (cartData) {
      setCart(cartData);
      setItemCount(cart.length);
    }
  }, [setCart, setItemCount, cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <Html lang="en-us" data-theme="business">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Shadows+Into+Light&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
