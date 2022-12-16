import { getGlobal } from "reactn";

export const getProfileById = (profileId) => {
  const user = getGlobal().user;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const profile = user.customer.profiles.find((p) => p._id === profileId);

  if (!profile) {
    throw new Error("Could not find the selected profile.");
  }

  return profile;
};

export const getProfileUpdatePayload = (profileId, updates) => {
  const user = getGlobal().user;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const payload = {
    "customer.profiles": [...user.customer.profiles],
  };

  // get the profile currently selected by id
  let index = 0;
  let p = payload["customer.profiles"].find((pro, i) => {
    if (pro._id === profileId) {
      index = i;
      return true;
    }
    return false;
  });

  if (!p) {
    throw new Error("Could not find the requested profile.");
  }

  // update the record from the spread above - we use the index here
  // instead of just changing the var above because the ...p below will
  // lose the reference
  payload["customer.profiles"][index] = { ...p, ...updates };

  return payload;
};
