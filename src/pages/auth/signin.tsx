/* eslint-disable @typescript-eslint/no-misused-promises */
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerAuthSession } from "../../server/auth";
import netberryLogo from "../../assets/netberry.png";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { NextSeo } from "next-seo";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex h-full min-h-screen w-full items-center">
      <div className="card m-auto flex w-fit flex-col items-center rounded-medium bg-background-secondary py-6 px-10 ring ring-background-active">
        <NextSeo title="SignIn" />
        <Image
          src={netberryLogo}
          alt="site-img"
          height={160}
          width={160}
          className="h-22 w-24"
        />
        <p className="mt-4 text-sm">Please sign in to continue</p>
        {Object.values(providers).map(
          (provider) =>
            provider.name === "Google" && (
              <div key={provider.name} className="mt-6">
                <button
                  type="button"
                  onClick={() => signIn(provider.id)}
                  className="flex items-center gap-2 rounded-medium bg-background-primary py-3 px-4 ring ring-background-active_hover hover:bg-background-active_hover"
                >
                  <FcGoogle className="mr-1 h-6 w-6" />
                  Sign in with Google
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
