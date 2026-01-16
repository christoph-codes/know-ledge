"use server";

import { RESPONSE_STATUS, ResultType, User } from "@know-ledge/shared";
import { signIn, signUp, signOut } from "@/shared/server/auth";
import { redirect } from "next/navigation";

/**
 * CRITICAL: Server Action for user sign up
 *
 * LEARNING: Server Actions (functions with "use server") let you call server-side
 * code directly from forms and client components without creating API routes.
 *
 * This is called from the SignupScreen component.
 * After successful signup, redirect to the main app.
 */
export const userSignUp = async (
  name: string,
  email: string,
  pass: string
): Promise<ResultType<User>> => {
  const result = await signUp(email, pass, name);

  if (result.status === RESPONSE_STATUS.SUCCESS) {
    // LEARNING: After successful auth, redirect to protected area
    // redirect() throws an error to break out of the current render
    redirect("/resource");
  }

  return result;
};

export const loginUser = async (
  email: string,
  pass: string
): Promise<ResultType<User>> => {
  const result = await signIn(email, pass);

  if (result.status === RESPONSE_STATUS.SUCCESS) {
    redirect("/resource");
  }

  return result;
};

export const logoutUser = async (): Promise<void> => {
  await signOut();
};
