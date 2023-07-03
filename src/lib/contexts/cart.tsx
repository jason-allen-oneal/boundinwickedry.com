import { createContext, PropsWithChildren, useContext, useState } from "react";

interface ICartContextProps {
  cart: Item[];
  setCart: (cart: Item[]) => void;
  itemCount: number;
  setItemCount: (count: number) => void;
}

const defaults = {
  cart: [],
  setCart: (cart: Item[]) => {},
  itemCount: 0,
  setItemCount: (count: number) => {},
};

export const CartContext = createContext<ICartContextProps>(defaults);

export const CartContextProvider = (props: PropsWithChildren) => {
  const [cart, setCart] = useState<Item[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);

  return (
    <CartContext.Provider
      value={{
        cart: cart,
        setCart: setCart,
        itemCount: itemCount,
        setItemCount: setItemCount,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export function useCart() {
  return useContext(CartContext);
}
