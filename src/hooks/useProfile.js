import { getGlobal } from "reactn";

export const useProfile = (profileId) => {
  const user = getGlobal().user;

  if (user.helper) {
    return user.helper.profile;
  }

  if (!profileId) {
    return null;
  }

  if (!user.customer.profiles) {
    return null;
  }

  const profile = user.customer.profiles.find((p) => p._id === profileId);

  return profile || null;
};
