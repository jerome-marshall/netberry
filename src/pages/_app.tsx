import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "../utils/api";

import { ToastContainer } from "react-toastify";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { DefaultSeo } from "next-seo";
import { brand } from "../common/utils";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <DefaultSeo
        description="NetBerry is Starberry's netlify accounts manager. It allows you to manage multiple netlify accounts and sites."
        defaultTitle={brand}
        titleTemplate={`%s | ${brand}`}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer theme="dark" />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
