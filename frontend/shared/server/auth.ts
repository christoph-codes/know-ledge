import "server-only";
import { ResultType, User } from "@know-ledge/shared";

type SessionPayload = {
  userId: number;
  email: string;
  name: string;
};

const sampleUser: User = {
  id: 1,
  email: "JohnnyTest@example.com",
  created_at: new Date().toISOString(),
  name: "Johnny Test",
};

export const getCurrentUser = async (): Promise<ResultType<User>> => {
  //TODO: Get user information from session token, return null if not valid or not found
  // const cookieStore = await cookies();
  // const token = cookieStore.get('session')?.value
  // if (!token) return {ok: false, error: 'No session token found'}
  //
  // const results = await verifySession(token) // throws or returns null
  // if (!results.ok) return {ok: false, error: 'Invalid session token'}

  return {
    ok: true,
    data: sampleUser,
  };
};

export async function verifySession(
  token: string
): Promise<ResultType<SessionPayload>> {
  // 1) verify signature / decrypt token OR
  // 2) look up session in DB/Redis
  // return payload if valid, else null
  console.log(token);
  return { ok: true };
}
