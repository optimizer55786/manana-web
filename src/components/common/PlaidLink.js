import React, { useCallback, useEffect } from "reactn";
import PropTypes from "prop-types";
import { usePlaidLink } from "react-plaid-link";

const PlaidLink = ({ linkToken, onConnect, onUserExit }) => {
  const onSuccess = useCallback(
    (public_token, metadata) => {
      if (onConnect) {
        onConnect(public_token, metadata);
      }
    },
    [onConnect]
  );

  const onExit = useCallback(
    (err, metadata) => {
      if (onUserExit) {
        onUserExit();
      }
    },
    [onUserExit]
  );

  const { open, ready, error } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  });

  useEffect(() => {
    if (!ready) {
      return;
    }
    open();
  }, [ready, open]);

  return error ? <p>{error.message}</p> : null;
};

PlaidLink.propTypes = {
  linkToken: PropTypes.string.isRequired,
  onConnect: PropTypes.func,
  onUserExit: PropTypes.func,
};

export default PlaidLink;
