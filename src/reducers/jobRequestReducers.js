import { addReducer } from "reactn";

addReducer("progressJobRequest", (global, dispatch, job) => {
  let jobRequest = global.jobRequest
    ? { ...global.jobRequest, ...job }
    : { ...job };

  window.localStorage.setItem("jobRequest", JSON.stringify(jobRequest));

  return { ...global, jobRequest };
});

addReducer("clearJobRequest", (global, dispatch, job) => {
  window.localStorage.removeItem("jobRequest");

  return { ...global, jobRequest: null };
});
