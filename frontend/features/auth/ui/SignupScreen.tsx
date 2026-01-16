"use client";
import { CompanyLogo } from "@/shared/ui/CompanyLogo";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { userSignUp } from "@/features/auth/auth.actions";
import { useRouter } from "next/dist/client/components/navigation";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    await userSignUp(fullName, email, password);
    router.push("/resource");
  };
  return (
    <div className={"flex flex-col items-center justify-center xh-screen"}>
      <CompanyLogo />

      <h1 className={"text-3xl font-bold my-4"}>Join Method Know</h1>
      <p className={"text-center text-xl text-gray-600"}>
        Share and discover valuable learning resources
      </p>
      <div className={"border rounded-2xl w-lg mt-6"}>
        <div className={"flex flex-col gap-4 p-6"}>
          <p className={""}>Create Account</p>

          <div className={"flex flex-col"}>
            <label htmlFor="fullName" className={"font-semibold telabel"}>
              Full Name
            </label>
            <Input
              type="text"
              id="fullName"
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className={"flex flex-col"}>
            <label htmlFor="email" className={"font-semibold tlabelm"}>
              Email
            </label>
            <Input
              type="text"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={"flex flex-col"}>
            <label htmlFor="password" className={"font-semibold text-sm"}>
              Password
            </label>
            <Input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className={"w-full mt-4"}>
            Sign Up
          </Button>

          <div className={"flex items-center justify-center gap-x-2"}>
            <p className={"text-sm text-gray-600 "}>Already have an account?</p>
            <a className={"underline"} href={"/login"}>
              Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
