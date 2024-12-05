/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TRPCClientErrorBase } from "@trpc/client";
import type { DefaultErrorShape } from "@trpc/server";
import Image from "next/image";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";
import noFoundImg from "../assets/404.svg";

type TRPCErrorComponentProps = {
  error: TRPCClientErrorBase<DefaultErrorShape> | undefined | null;
  title?: string;
};

const TRPCErrorComponent: FC<TRPCErrorComponentProps> = ({ error, title }) => {
  title ||= "Oops there was an error!";

  const [count, setCount] = useState(5);

  const router = useRouter();

  const isUnauthorized = error?.data?.code === "UNAUTHORIZED";

  switch (error?.data?.code) {
    case "UNAUTHORIZED":
      title = "You are not authorized to view this page";
      break;
    case "NOT_FOUND":
      title = "Page not found";
      break;
    case "TIMEOUT":
      title = "Page took too long to load";
      break;
    default:
      break;
  }

  useEffect(() => {
    if (isUnauthorized) {
      const interval = setInterval(() => {
        if (count === 0) {
          void router.replace("/auth/signin");
        }
        setCount((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [count, isUnauthorized, router]);

  return (
    <div className="m-auto flex flex-col items-center justify-center">
      <Image src={noFoundImg} alt="404" className="h-[380px] w-full" />
      <h1 className="mt-6 text-2xl font-bold text-white">{title}</h1>
      {error?.message && (
        <p className="mt-4 rounded-medium  bg-red-dark px-4 py-2 text-xl text-red-lighter">
          {error?.message}
        </p>
      )}
      {isUnauthorized && count > -1 && (
        <p className="mt-4 text-xl ">
          You will be redirected to the login page in {count} seconds.
        </p>
      )}
    </div>
  );
};

export default TRPCErrorComponent;
