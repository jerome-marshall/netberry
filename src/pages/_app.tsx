import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { api } from "../utils/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { DefaultSeo } from "next-seo";
import { brand } from "../common/utils";
import ChangelogModal from "../components/ChangelogModal";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <DefaultSeo
        description="NetBerry is Starberry's netlify manager. It allows you to manage multiple netlify accounts and sites and their deploys."
        defaultTitle={brand}
        titleTemplate={`%s | ${brand}`}
      />
      {getLayout(<Component {...pageProps} />)}
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer theme="dark" toastClassName={"toastify-toast"} />
      <ChangelogModal />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
