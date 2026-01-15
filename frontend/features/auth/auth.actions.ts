"use server";

import { RESPONSE_STATUS, ResultType, User } from "@know-ledge/shared";
// import {cookies} from "next/headers";

const sampleUser: User = {
  id: 1,
  email: "JohnnyTest@example.com",
  created_at: new Date().toISOString(),
  name: "Johnny Test",
};

export const userSignUp = async (
  name: string,
  email: string,
  pass: string
): Promise<ResultType<User>> => {
  console.log(name, email, pass);

  return {
    status: RESPONSE_STATUS.SUCCESS as keyof typeof RESPONSE_STATUS,
    message: "User signed up successfully",
    data: sampleUser,
  };
};

export const loginUser = async (
  email: string,
  pass: string
): Promise<ResultType<User>> => {
  console.log(email, pass);

  return {
    status: RESPONSE_STATUS.SUCCESS as keyof typeof RESPONSE_STATUS,
    message: "User logged in successfully",
    data: sampleUser,
  };
};
