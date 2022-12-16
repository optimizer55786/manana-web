import React, { useGlobal, useDispatch, useState } from "reactn";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import get from "lodash.get";

import AddCircle from "@material-ui/icons/AddCircle";
import MoreHoriz from "@material-ui/icons/MoreHoriz";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useFieldToggle } from "../../../hooks/useFieldToggle";
import { useApiPut, useApiPost } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import { TextLabel } from "../../common/labels";
import PlaidLink from "../../common/PlaidLink";
import { ucwords } from "../../../lib/stringHelpers";

const PaymentSettings = () => {
  const [user] = useGlobal("user");
  const [linkToken, setLinkToken] = useState(null);
  const { formData, hasChanged, onChange } = useFormData({
    standard: get(user, "helper.hourlyRates.standard") || "",
    specialized: get(user, "helper.hourlyRates.specialized") || "",
    overnight: get(user, "helper.hourlyRates.overnight") || "",
  });
  const { isToggled, toggleBtn } = useFieldToggle({
    standard: formData.standard === "",
    specialized: formData.specialized === "",
    overnight: formData.overnight === "",
  });
  const hasAccounts =
    user.helper.directDepositAccounts &&
    user.helper.directDepositAccounts.length > 0;
  const history = useHistory();

  const updateUser = useDispatch("updateUser");

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    history.push("/account", {
      alert: {
        msg: "Your changes have been successfully saved.",
        variant: "success",
      },
    });
  });

  const apiPlaidLink = useApiPost(
    "/payments/create-bank-link",
    (resp) => {
      setLinkToken(resp.link_token);
    },
    {
      onError: (err) => {
        alert(err.message);
      },
    }
  );

  const apiCompleteBankLink = useApiPost(
    "/payments/complete-bank-link",
    (resp) => {
      updateUser(resp);
      history.push("/account/payment-settings", {
        alert: {
          msg: "Your direct deposit account was successfully added.",
          variant: "success",
        },
      });
    },
    {
      onError: (err) => {
        alert(err.message);
      },
    }
  );

  return (
    <SubInternalLayout alertMutate={save} title={`Payment Settings`}>
      {hasAccounts ? (
        <p className="subtitle-2">DIRECT DEPOSIT ACCOUNTS</p>
      ) : null}
      {user.helper.directDepositAccounts
        ? user.helper.directDepositAccounts.map((acct, i) => {
            return (
              <div key={i} className="field-list-item">
                <div className="float-end">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => alert("CLICKED")}
                  >
                    <MoreHoriz />
                  </Button>
                </div>
                <p className="body2">
                  {acct.bankName}{" "}
                  {acct.isDefault ? (
                    <label
                      className="ms-3 label"
                      style={{
                        background: "#ffc8b4",
                        borderRadius: "4px",
                        padding: "4px 8px",
                      }}
                    >
                      DEFAULT
                    </label>
                  ) : null}
                </p>
                <p className="body1 text-muted">
                  {ucwords(acct.accountType)}...{acct.last4}
                </p>
              </div>
            );
          })
        : null}
      <div
        className="field-list-item"
        style={{ cursor: "pointer" }}
        onClick={() => apiPlaidLink.mutate()}
        disabled={apiPlaidLink.isLoading || apiCompleteBankLink.isLoading}
      >
        <div
          className="float-end"
          style={{
            color: "var(--primary-color)",
            fontSize: "1.15rem",
            padding: "0 0.75rem",
          }}
        >
          <AddCircle />
        </div>
        <h5
          style={{
            color: "var(--text-color)",
            fontSize: "1.15rem",
            fontWeight: 700,
          }}
        >
          Set up direct deposit
        </h5>
        {linkToken ? (
          <PlaidLink
            linkToken={linkToken}
            onConnect={(public_token, metadata) => {
              apiCompleteBankLink.mutate(
                {
                  publicToken: public_token,
                  accountId: metadata.account.id,
                  meta: {
                    last4: metadata.account.mask,
                    accountType: metadata.account.subtype,
                    bankName: metadata.institution.name,
                  },
                },
                {
                  onError: (err) => alert(err.message),
                }
              );
            }}
          />
        ) : null}
      </div>
      <div className="field-list-item">
        <Form.Group>
          {toggleBtn("standard")}
          <Form.Label>Rate for everyday tasks</Form.Label>
          {!isToggled("standard") ? (
            <TextLabel val={`$${formData.standard}`} />
          ) : (
            <Form.Control
              type="number"
              name="standard"
              placeholder="0.00"
              onChange={onChange}
              value={formData.standard}
            />
          )}
        </Form.Group>
      </div>
      <div className="field-list-item">
        <Form.Group>
          {toggleBtn("specialized")}
          <Form.Label>Rate for specialized tasks</Form.Label>
          {!isToggled("specialized") ? (
            <TextLabel val={`$${formData.specialized}`} />
          ) : (
            <Form.Control
              type="number"
              name="specialized"
              placeholder="0.00"
              onChange={onChange}
              value={formData.specialized}
            />
          )}
        </Form.Group>
      </div>
      <div className="field-list-item">
        <Form.Group>
          {toggleBtn("overnight")}
          <Form.Label>Rate for overnight tasks</Form.Label>
          {!isToggled("overnight") ? (
            <TextLabel val={`$${formData.overnight || "-"}`} />
          ) : (
            <Form.Control
              type="number"
              name="overnight"
              placeholder="0.00"
              onChange={onChange}
              value={formData.overnight}
            />
          )}
        </Form.Group>
      </div>

      <div className="text-end mt-3">
        <Button
          type="button"
          onClick={() =>
            save.mutate({
              "helper.hourlyRates.standard": formData.standard,
              "helper.hourlyRates.specialized": formData.specialized,
              "helper.hourlyRates.overnight": formData.overnight,
            })
          }
          disabled={!hasChanged || save.isLoading}
        >
          {save.isLoading ? <SpinIcon /> : "Save Changes"}
        </Button>
      </div>

      <br />
      <br />
    </SubInternalLayout>
  );
};

export default PaymentSettings;
