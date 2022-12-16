import React, { useState, useEffect } from "reactn";
import { Alert, Button } from "react-bootstrap";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useApiGet } from "../../hooks/useApi";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SetupForm = ({ buttonLabel, redirectUrl, onComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const getRedirectUrl = () => {
    if (redirectUrl) {
      return redirectUrl;
    }

    switch (true) {
      case /\.local/g.test(process.env.REACT_APP_API_URL):
        return "http://app.mananahealth.local/find-help/payment";
      case /app\.dev\.mananahealth\.com/g.test(process.env.REACT_APP_API_URL):
        return "https://app.dev.mananahealth.com/find-help/payment";
      default:
        return "https://www.mananahealth.com/find-help/payment";
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "setup_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      "setup_intent_client_secret"
    );

    if (!clientSecret) {
      setIsReady(true);
      return;
    }

    stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
      // Inspect the SetupIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (setupIntent.status) {
        case "processing":
          setErrorMessage(
            "Processing payment details. We'll update you when processing is complete."
          );
          break;

        case "requires_payment_method":
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setErrorMessage(
            "Failed to process payment details. Please try another payment method."
          );
          break;

        case "succeeded":
        default:
          // success
          onComplete(setupIntent);
      }
    });
  }, [stripe]);

  const onSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: getRedirectUrl(),
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (e.g., payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {errorMessage ? <Alert variant="danger">{errorMessage}</Alert> : null}
      {isReady ? <PaymentElement /> : <p>Confirming Request...</p>}

      <br />
      <Button
        type="submit"
        variant="primary"
        className="w-100"
        disabled={!stripe || !elements || !isReady}
      >
        {buttonLabel}
      </Button>
    </form>
  );
};

const CreditCardForm = ({
  buttonLabel = "Save Details",
  queryParams,
  redirectUrl,
  onComplete,
}) => {
  const { isLoading, data, isError, error } = useApiGet(
    "customerSetupIntent",
    "/payments/setup-intent",
    null,
    { staleTime: 1000 }
  );

  if (isLoading) {
    return <p>Setting up...</p>;
  } else if (isError) {
    return (
      <Alert variant="danger">
        Could not setup your account. Please refresh the page and try again.
        <br />
        {error.message}
      </Alert>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: data.clientSecret,
      }}
    >
      <SetupForm
        buttonLabel={buttonLabel}
        redirectUrl={redirectUrl}
        onComplete={onComplete}
      />
    </Elements>
  );
};

export default CreditCardForm;
