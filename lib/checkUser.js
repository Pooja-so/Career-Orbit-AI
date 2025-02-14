import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    /*1. if user is already stored in the database then 
     there is no need to store it hence return */
    if (loggedInUser) {
      return loggedInUser;
    }

    /*2. if user is not tored in the database then 
    create new user hence return  it*/
    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
