import { auth } from "@clerk/nextjs/server";

const adminIds = ["user_2dGb6YEarBAQHrNYoB5dMtISRWK"];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return adminIds.includes(userId);
};
