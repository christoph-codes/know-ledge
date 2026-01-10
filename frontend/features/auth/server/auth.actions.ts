"use server";

export const userSignUp = async (name: string, email: string, pass: string) => {
  console.log(name, email, pass);
};

export const loginUser = async (email: string, pass: string) => {
  console.log(email, pass);
};
