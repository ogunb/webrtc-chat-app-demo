import { createDB, readDoc, insertDoc } from "./index";
import { user } from '../types/user';

const USER_DB_NAME = "users";
const userDB = createDB(USER_DB_NAME);

export async function createUser(user: { name: string }): Promise<user> {
  if (!user.name) {
    throw new Error("Username is required.");
  }

  const newUser = await insertDoc(userDB, {
    name: user.name,
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

(async function () {
  const { _id } = await createUser({ name: 'deneme' })
  console.log(await getUserByName('deneme'));
  console.log(await getUserById(_id));
}());