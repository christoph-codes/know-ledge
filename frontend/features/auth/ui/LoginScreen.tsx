"use client";
import { CompanyLogo } from "@/shared/ui/CompanyLogo";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { loginUser } from "@/features/auth/server/auth.actions";
import { useRouter } from "next/dist/client/components/navigation";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    await loginUser(email, password);
    router.push("/resource");
  };
  return (
    <>
      <div className={"flex flex-col items-center justify-center xh-screen"}>
        <CompanyLogo />

        <h1 className={"text-3xl font-bold my-4"}>Join Method Know</h1>
        <p className={"text-center text-xl text-gray-600"}>
          Share and discover valuable learning resources
        </p>
        <div className={"border rounded-2xl w-lg mt-6"}>
          <div className={"flex flex-col gap-4 p-6"}>
            <p className={""}>Login</p>

            <div className={"flex flex-col"}>
              <label className={"font-semibold text-sm"}>Email</label>
              <Input type="text" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className={"flex flex-col"}>
              <label className={"font-semibold text-sm"}>Password</label>
              <Input
                type="text"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmit} className={"w-full mt-4"}>
              Login
            </Button>

            <div className={"flex items-center justify-center gap-x-2"}>
              <p className={"text-sm text-gray-600 "}>
                Don&#39;t have an account?
              </p>
              <a className={"underline"} href={"/signup"}>
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
