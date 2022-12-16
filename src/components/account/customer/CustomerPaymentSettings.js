import React, { useGlobal, useDispatch, useState } from "reactn";
import { Modal, Badge, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AddCircle from "@material-ui/icons/AddCircle";
import Delete from "@material-ui/icons/Delete";
import Star from "@material-ui/icons/Star";

import SubInternalLayout from "../../layout/SubInternalLayout";
import CreditCardForm from "../../common/CreditCardForm";
import { useFormData } from "../../../hooks/useFormData";
import { useApiGet, useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";

const CustomerPaymentSettings = () => {
  const [user] = useGlobal("user");
  const [showCC, setShowCC] = useState(false);
  const { formData, hasChanged, onChange } = useFormData({});
  const history = useHistory();

  const updateUser = useDispatch("updateUser");

  const { isLoading, data, error } = useApiGet(
    "customerPaymentMethods",
    "/payments/payment-methods",
    null,
    {
      staleTime: 1000,
    }
  );

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    history.push("/account/recipient-payment-settings", {
      alert: {
        msg: "Your changes have been successfully saved.",
        variant: "success",
      },
    });
  });

  return (
    <SubInternalLayout
      alertMutate={save}
      error={error}
      title={`Payment Settings`}
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {data.map((method, methodIndex) => {
            const isDefault = method.id === user.billing.paymentMethod;

            return (
              <div className="field-list-item" key={methodIndex}>
                <div className="float-end">
                  {isDefault ? null : (
                    <Button
                      size="sm"
                      variant="link"
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        console.log("make default");
                      }}
                      title="Make Default"
                    >
                      <Star />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="link"
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      if (data.length === 1) {
                        alert(
                          "You cannot delete your only payment method. Please add a replacement and try again."
                        );
                        return;
                      }

                      if (
                        window.confirm(
                          "Are you sure you want to delete this payment method?"
                        )
                      ) {
                        save.mutate(method.id);
                      }
                    }}
                  >
                    <Delete />
                  </Button>
                </div>
                <p className="body2 mb-1">
                  {method.brand.toUpperCase()} Ending In {method.last4}
                  {isDefault ? (
                    <Badge bg="secondary" className="ms-3">
                      DEFAULT
                    </Badge>
                  ) : null}
                </p>
                <p className="body1 text-muted mb-0">
                  Exp: {method.exp_month}/{method.exp_year}
                </p>
              </div>
            );
          })}
        </>
      )}
      <Button
        variant="link"
        onClick={() => setShowCC(true)}
        style={{ textDecoration: "none" }}
        className="ps-0"
      >
        <AddCircle /> ADD A PAYMENT METHOD
      </Button>

      <br />
      <br />

      <Modal show={showCC} onHide={() => setShowCC(false)}>
        <Modal.Body>
          <CreditCardForm
            buttonLabel="Save Payment Method"
            redirectUrl="/account/recipient-payment-settings"
            onComplete={(details) => console.log("DETAILS: ", details)}
          />
        </Modal.Body>
      </Modal>
    </SubInternalLayout>
  );
};

export default CustomerPaymentSettings;
