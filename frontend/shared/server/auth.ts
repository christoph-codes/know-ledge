import "server-only";
import {
  RESPONSE_STATUS,
  ResponseStatus,
  ResultType,
  User,
} from "@know-ledge/shared";
import { createSupabaseServerClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";
import fetchRender from "../lib/fetchRender";

/**
 * CRITICAL: Get the currently authenticated user from Supabase session
 *
 * This function:
 * 1. Creates a server-side Supabase client with cookie handling
 * 2. Retrieves the current user from the session
 * 3. Returns user data or null if not authenticated
 *
 * LEARNING: This is your primary way to check authentication in Server Components.
 * Use this at the top of any page or server action that requires authentication.
 *
 * Example usage in a Server Component:
 * ```
 * const { data: user } = await getCurrentUser();
 * if (!user) redirect('/login');
 * ```
 */
export const getCurrentUser = async (): Promise<ResultType<User | null>> => {
  const supabase = await createSupabaseServerClient();

  // CRITICAL: getUser() validates the JWT and fetches user from Supabase
  // Unlike getSession(), this always hits the database to verify the user exists
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      status: RESPONSE_STATUS.ERROR as ResponseStatus,
      message: error?.message ?? "No authenticated user",
      data: null,
    };
  }

  // LEARNING: Map Supabase user to your app's User type
  // Supabase stores user metadata in user_metadata field
  // const appUser: User = {
  //   id: user.id as any, // Supabase uses UUID (string), convert if needed
  //   email: user.email!,
  //   created_at: user.created_at,
  //   name: user.user_metadata?.name || user.email!.split("@")[0],
  // };

  const userDetails = await fetchRender(`/users/${user.id}`);

  if (!userDetails) {
    throw new Error("Failed to get user by auth_id");
  }

  return {
    status: RESPONSE_STATUS.SUCCESS as ResponseStatus,
    message: "User fetched successfully",
    data: userDetails as User,
  };
};

/**
 * CRITICAL: Sign in with email and password
 *
 * LEARNING: Supabase handles password hashing, session creation, and cookie management.
 * After successful sign in, the session cookie is automatically set.
 */
export async function signIn(
  email: string,
  password: string
): Promise<ResultType<User>> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      status: RESPONSE_STATUS.ERROR as ResponseStatus,
      message: error?.message ?? "Sign in failed",
      data: null as any,
    };
  }

  const appUser: User = {
    id: data.user.id as any,
    email: data.user.email!,
    created_at: data.user.created_at,
    name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
  };

  return {
    status: RESPONSE_STATUS.SUCCESS as ResponseStatus,
    message: "Signed in successfully",
    data: appUser,
  };
}

/**
 * CRITICAL: Sign up a new user with email and password
 *
 * LEARNING:
 * - user_metadata is used to store additional user info (like name)
 * - Supabase may require email confirmation depending on your project settings
 * - Check your Supabase dashboard -> Authentication -> Settings -> Email Auth
 */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<ResultType<User>> {
  const supabase = await createSupabaseServerClient();

  // writing to the authentication table
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // LEARNING: Store additional user data in user_metadata
      // This is different from the public 'users' table in your database
      data: {
        name,
      },
    },
  });

  if (error || !data.user) {
    return {
      status: RESPONSE_STATUS.ERROR as ResponseStatus,
      message: error?.message ?? "Sign up failed",
      data: null as any,
    };
  }

  const userDetails: User = {
    email: data.user.email!,
    created_at: data.user.created_at,
    name: name,
    auth_id: data.user.id,
  };
  await fetchRender("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userDetails,
    }),
  });

  return {
    status: RESPONSE_STATUS.SUCCESS as ResponseStatus,
    message: "Signed up successfully",
  };
}

/**
 * CRITICAL: Sign out the current user
 *
 * LEARNING: This removes the session cookie and invalidates the JWT.
 * After sign out, redirect to login page.
 */
export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
