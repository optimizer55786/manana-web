import React, { useGlobal, useDispatch } from "reactn";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import set from "lodash.set";
import merge from "lodash.merge";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import "./css/NotificationSettings.css";

const settingsGroup = [
  {
    subTitle: "Bookings",
    children: [      
      { header: "New Help request", key: "helpRequestConfirmation" },
      { header: "Booking cancellation", key: "bookingCancellation" },
      { header: "Booking reminders", key: "bookingReminders" },
    ]
  }, {
    subTitle: "Payments",
    children: [
      { header: "Payment in progress", key: "paymentInProgress" },
      { header: "Issue with payment", key: "issueWithPayment" },
    ]
  }
]
const parseFormDataFromProfileSettings = (prev) => {
  const initialFormData = {
    helpRequestConfirmation: { sms: {}, email: {} },
    bookingCancellation: { sms: {}, email: {} },
    bookingReminders: { sms: {}, email: {} },
    paymentInProgress: { sms: {}, email: {} },
    issueWithPayment: { sms: {}, email: {} },
  };  
  return merge({}, initialFormData, prev);
}
const NotificationSettings = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange, toggleCheckboxValue, setData, resetData } = useFormData(
    parseFormDataFromProfileSettings(user.settings.notifications)
  );
  const onChangeCheck = (e) => {
    const targetName = e.target.name;
    set(formData, targetName, e.target.checked);
    setData(formData);
  }
  const resetForm = () => {
    resetData(parseFormDataFromProfileSettings(user.settings.notifications));
  }
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

  const profiles = [{ name: "Me", _id: "me" }, ...user.customer.profiles];
  const isMultiple = profiles.length !== 1;
  return (
    <SubInternalLayout alertMutate={save} title={`Notification Settings`}>
      {settingsGroup.map((setGroup, setGroupIndex) => {
        return (
          <div key={setGroupIndex} className="setting-group">
            <Row className="header-row">
              <Col xs={8} className="no-padding">
                <span className="subtitle1">{setGroup.subTitle}</span>
              </Col>
              <Col xs={2}>
                <span className="label">TEXT</span>
              </Col>
              <Col xs={2}>
                <span className="label">EMAIL</span>
              </Col>
            </Row>
            {setGroup.children.map((set, setIndex) => {
              return (
                <div key={setIndex} className={!isMultiple ? "setting-row" : "setting-no-border-row"}>
                  {isMultiple && <p className="setting-title">{set.header}</p>}
                  {profiles.map((p, pIndex) => {
                    return (
                      <Row key={pIndex} className={isMultiple ? "setting-row" : ""}>
                        <Col>
                          <span className="subtitle2">{isMultiple ? p.name : set.header}</span>
                        </Col>
                        <Col xs={2}>
                          <Form.Check
                            type="checkbox"
                            id={`cb-${set.key}-${p._id}`}
                            label=""
                            name={`${set.key}.sms.${p._id}`}
                            checked={formData[set.key].sms[p._id] == true}
                            onChange={onChangeCheck}
                          />
                        </Col>
                        <Col xs={2}>
                          <Form.Check
                            type="checkbox"
                            id={`cb-${set.key}-${p._id}`}
                            label=""
                            name={`${set.key}.email.${p._id}`}
                            checked={formData[set.key].email[p._id] == true}
                            onChange={onChangeCheck}
                          />
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )
      })}
      <div className="d-flex justify-content-between text-end mt-4">
        <Button
          type="reset"
          variant="light"
          onClick={() =>
            resetForm()
          }
          disabled={!hasChanged || save.isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() =>
            save.mutate({
              "settings.notifications": formData,
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

export default NotificationSettings;
