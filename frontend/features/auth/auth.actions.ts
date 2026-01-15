"use server";

import {ResultType, User} from "@know-ledge/shared";
// import {cookies} from "next/headers";


const sampleUser: User = {
  id: 1,
  email: 'JohnnyTest@example.com',
  created_at: new Date().toISOString(),
  name: 'Johnny Test',
};

export const userSignUp = async (name: string, email: string, pass: string): Promise<ResultType<User>> => {
  console.log(name, email, pass);



  return {
    ok: true,
    data: sampleUser,
  };

};

export const loginUser = async (email: string, pass: string): Promise<ResultType<User>> => {
  console.log(email, pass);
  // const cookieStore = await cookies();
  // cookieStore.set('userId', sampleUser.id.toString()  , {
  //   httpOnly: true,
  //   secure: true, //process.env.NODE_ENV === 'production',
  //   sameSite: 'lax',
  //   path: '/',
  //   maxAge: 60 * 60 * 24 * 7,
  // })
  return {
    ok: true,
    data: sampleUser,
  };
};
