import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { api } from "../utils/api";

import "../styles/globals.css";
import Layout from "../components/Layout";
import { ToastContainer } from "react-toastify";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer theme="dark" />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
