import { Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export const useAlert = () => {
  const history = useHistory();

  const clearAlert = () => {
    window.localStorage.removeItem("_alert");
  };

  const hasAlert = () => {
    const alert = window.localStorage.getItem("_alert") || null;
    return alert !== null;
  };

  const getAlert = () => {
    let alert = window.localStorage.getItem("_alert") || null;

    if (!alert) {
      return null;
    }

    alert = JSON.parse(alert);

    const resp = <Alert variant={alert.variant}>{alert.msg}</Alert>;
    clearAlert();

    return resp;
  };

  const setNewAlert = (msg, variant = "danger") => {
    window.localStorage.setItem(
      "_alert",
      JSON.stringify({
        msg,
        variant,
      })
    );
  };

  const redirectWithAlert = (redirectTo, msg, variant) => {
    setNewAlert(msg, variant);
    history.push(redirectTo);
  };

  return { hasAlert, getAlert, setNewAlert, clearAlert, redirectWithAlert };
};
