import { createDB, readDoc, insertDoc } from "../database/index";
import { user } from "./types/user";

const USER_DB_NAME = "users";
const userDB = createDB(USER_DB_NAME);

export async function createUser(user: { name: string, password: string }): Promise<user> {
  if (!user.name) {
    throw new Error("Username is required.");
  }

  const newUser = await insertDoc(userDB, {
    name: user.name,
    password: user.password // pretend it's secured
  });

  return newUser;
}

export async function getUserById(_id: string): Promise<user> {
  if (!_id) {
    return null;
  }

  const [user] = await readDoc(userDB, { _id });
  return user;
}

export async function getUserByName(name: string): Promise<user> {
  if (!name) {
    return null;
  }

  const [user] = await readDoc(userDB, { name });
  return user;
}

export async function getAllUsers(): Promise<user[]> {
  const users = await userDB.getAllData();
  return users;
}
