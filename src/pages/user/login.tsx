import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "@/components/Layout";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { useNotification } from "@/lib/contexts/notification";

type PageProps = {
  callbackUrl?: string;
};

const Login: NextPage<PageProps> = (props) => {
  const router = useRouter();
  const { toast } = useNotification();
  const redirect = props.callbackUrl;

  const { handleSubmit, control, reset, register } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
      callbackUrl: redirect || "/",
    },
  });

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        await signIn("credentials", { ...data });
        reset();
      } catch (err) {
        console.log("Login error:", err);
        toast("error", JSON.stringify(err));
      }
    },
    [reset, redirect]
  );

  const data = {
    title: "Login",
    description: "Login to your account.",
  };

  return (
    <Layout data={data}>
      <div className="conatiner border border-secondary p-4">
    <div className="max-w-lg mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Sign in</h2>
          </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label className="block mb-2 font-extrabold" htmlFor="">Email</label>
          <input className="input input-bordered border-secondary w-full max-w-xs my-2" type="email" placeholder="email" {...register('email')} />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-extrabold" htmlFor="">Password</label>
          <input className="input input-bordered border-secondary w-full max-w-xs my-2" type="password" placeholder="**********" {...register('password')} />
        </div>
        <div className="flex flex-wrap -mx-4 mb-6 items-center justify-between">
          <div className="w-full lg:w-auto px-4 mb-4 lg:mb-0">
            <label htmlFor="">
              <input type="checkbox" />
              <span className="ml-1 font-extrabold">Remember me</span>
            </label>
          </div>
          <div className="w-full lg:w-auto px-4"><a className="inline-block font-extrabold hover:underline" href="#">Forgot your password?</a></div>
        </div>
        <button className="btn btn-primary">Sign in</button>
        <p className="text-center font-extrabold">Don&rsquo;t have an account? <a className="hover:underline" href="#">Sign up</a></p>
      </form>
    </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { callbackUrl } = context.query;
  return {
    props: {
      callbackUrl: callbackUrl == undefined ? "/" : callbackUrl,
    },
  };
}

export default Login;
