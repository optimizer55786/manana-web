import { setGlobal } from "reactn";
import { getCookie } from "./lib/cookies";

export async function init() {
  let u = window.localStorage.getItem("user") || null;
  if (u) {
    u = JSON.parse(u);
  }

  let jobRequest = window.localStorage.getItem("jobRequest") || null;
  if (jobRequest) {
    jobRequest = JSON.parse(jobRequest);
  }

  setGlobal({
    user: u,
    token: getCookie("token") || null,
    verificationToken: getCookie("verificationToken") || null,
    alert: { msg: null, variant: "danger" },
    jobRequest,
  });
}
