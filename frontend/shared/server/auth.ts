import "server-only";
import {
  RESPONSE_STATUS,
  ResponseStatus,
  ResultType,
  User,
} from "@know-ledge/shared";

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
  // if (!token) return {status: RESPONSE_STATUS.FAILURE, message: 'No session token found'}
  //
  // const results = await verifySession(token) // throws or returns null
  // if (results.status === RESPONSE_STATUS.FAILURE) return {status: RESPONSE_STATUS.FAILURE, message: 'Invalid session token'}

  return {
    status: RESPONSE_STATUS.SUCCESS as ResponseStatus,
    message: "User fetched successfully",
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
  return {
    status: RESPONSE_STATUS.SUCCESS as ResponseStatus,
    message: "Session verified successfully",
    data: { userId: 1, email: "JohnnyTest@example.com", name: "Johnny Test" },
  };
}
