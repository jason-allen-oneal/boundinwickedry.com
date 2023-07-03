import "@/styles/globals.css";
import "nprogress/nprogress.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import type { NextComponentType } from 'next';
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { NotificationContextProvider } from "@/lib/contexts/notification";
import { CartContextProvider } from "@/lib/contexts/cart";
import * as React from "react";
import dynamic from "next/dynamic";

interface CustomAppProp extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps["pageProps"];
}

type CustomAppProps = CustomAppProp & {
  Component: NextComponentType & {auth?: boolean}
}

const TopProgressBar = dynamic(
  () => {
    return import("@/components/TopProgressBar");
  },
  {
    ssr: false,
  }
);

const CustomApp = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <NotificationContextProvider>
        <CartContextProvider>
          <TopProgressBar />
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
          <ToastContainer
            newestOnTop={true}
            draggable={false}
          />
        </CartContextProvider>
      </NotificationContextProvider>
    </SessionProvider>
  );
};

function Auth({ children }: any) {
  const { status } = useSession({ required: true });
  
  if (status === "loading") {
    return <div>Loading...</div>
  }

  return children
}

export default CustomApp;
