import { addReducer } from "reactn";
import moment from "moment-timezone";
import { setCookie } from "../lib/cookies";

const getCookieOpts = () => {
  const base = {
    maxAge: 60 * 60 * 24 * 14, // 2 weeks
    secure: !["app.mananahealth.local", "localhost"].includes(
      window.location.hostname
    ),
    httpOnly: false,
    path: "/",
  };

  /**
   * On localhost the domain parameter HAS TO BE excluded
   * altogether from the parameters.
   */
  if (window.location.hostname !== "localhost") {
    base.domain = window.location.hostname;
  }

  return base;
};

addReducer("login", (global, dispatch, verificationToken) => {
  const opts = { ...getCookieOpts(), maxAge: 60 * 14 };

  setCookie("verificationToken", verificationToken, opts);

  return { ...global, verificationToken };
});

addReducer("verified", (global, dispatch, userObj) => {
  const opts = getCookieOpts();

  const user = { ...userObj };
  const token = user._token;

  delete user._token;

  window.localStorage.setItem("user", JSON.stringify({ ...user }));
  setCookie("token", token, opts);
  setCookie("verificationToken", null, { ...opts, maxAge: 0 });

  moment.tz.setDefault(userObj.settings.timezone);

  return { ...global, user, token, verificationToken: null };
});

addReducer("logout", (global, dispatch) => {
  const opts = getCookieOpts();

  opts.maxAge = 0;

  window.localStorage.clear();
  setCookie("token", null, opts);

  return { ...global, user: null, token: null };
});

addReducer("updateUser", (global, dispatch, updates) => {
  let user = { ...global.user, ...updates };

  window.localStorage.setItem("user", JSON.stringify(user));

  moment.tz.setDefault(user.settings.timezone);

  return { ...global, user };
});
