import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Button,
  FormGroup,
  FormControl,
  FormCheck,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import ExpandMoreOutlined from "@material-ui/icons/ExpandMoreOutlined";
import ExpandLessOutlined from "@material-ui/icons/ExpandLessOutlined";

import { useApiGet } from "../../hooks/useApi";

import "./css/ServicesList.css";

const ServiceListItemSubForm = ({
  service,
  values,
  role,
  onSave,
  onClear,
  onToggle,
}) => {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setAnswers(values);
  }, [values]);

  const getQuestion = (question, index) => {
    switch (question.questionType) {
      case "checkboxes":
        let vals = answers[question.key] || [];

        // I'm not a big fan of this, but this particular question has such a wide
        // impact on the registration process of both the helper and customer that
        // I have to do some hardcoding on it or find a new way of storing services
        // in a way that does not negatively impact searching/matching later.
        if (
          service._id === "60c3fd06573f8b1868c89ef2" &&
          role === "customer" &&
          question.key === "accommodate"
        ) {
          question.options = question.options.filter(
            (o) =>
              o !== "I don't have a car" && o !== "I do not use any of these"
          );
          question.options.push("I do not use any of these");
        }

        return (
          <div key={index}>
            <h3 className="mb-3">{question.question[role]}</h3>
            {question.options.map((o, i) => {
              return (
                <FormGroup
                  key={i}
                  className="mb-3"
                  controlId={`cb-${question._id}-${i}`}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    paddingBottom: "1rem",
                  }}
                >
                  <FormCheck
                    type="checkbox"
                    label={o}
                    value={o}
                    checked={vals.includes(o)}
                    size="lg"
                    onChange={(e) => {
                      if (e.target.checked) {
                        vals.push(o);
                      } else {
                        vals = vals.filter((v) => v !== o);
                      }

                      const newAnswers = { ...answers, [question.key]: vals };
                      setAnswers(newAnswers);
                    }}
                  />
                </FormGroup>
              );
            })}
          </div>
        );
      default:
        const val = answers[question.key] || "";

        return (
          <FormGroup>
            <h3>{question.question[role]}</h3>
            <FormControl
              type="text"
              name={question.key}
              value={val || ""}
              onChange={(e) => {
                const newAnswers = {
                  ...answers,
                  [question.key]: e.target.value,
                };
                setAnswers(newAnswers);
              }}
            />
          </FormGroup>
        );
    }
  };

  return (
    <div className="service-item__sublist">
      <Button
        type="button"
        variant="link"
        onClick={() => {
          onToggle();
        }}
        className="service-item__sublist__close-icon"
      >
        &times;
      </Button>
      {service.additionalQuestions.map((q, i) => {
        return getQuestion(q, i);
      })}

      <br />
      <br />
      <Row>
        <Col>
          <Button
            type="button"
            variant="link"
            onClick={() => {
              onClear();
              onToggle();
            }}
          >
            CLEAR ALL
          </Button>
        </Col>
        <Col className="text-end">
          <Button
            type="button"
            className="add-padding"
            onClick={() => onSave({ ...answers })}
          >
            SAVE
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const ServiceListItem = ({
  service,
  isSubListOpen,
  isChecked,
  onSelectionChange,
  selections,
  toggleSelection,
  toggleSubForm,
  role,
}) => {
  return (
    <>
      <div className="service-item">
        <Row>
          <Col>
            <FormGroup controlId={`service-${service._id}`}>
              <FormCheck
                name={service._id}
                type="checkbox"
                label={<span>[ICON] {service.name}</span>}
                value={service._id}
                checked={isChecked}
                size="lg"
                onChange={(e) =>
                  onSelectionChange({
                    target: {
                      name: service._id,
                      value: e.target.checked,
                      answers: {},
                    },
                  })
                }
              />
            </FormGroup>
          </Col>
          <Col xs={4} sm={3} className="text-end text-muted">
            <Button variant="link" onClick={() => toggleSubForm()}>
              {isSubListOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
            </Button>{" "}
            <OverlayTrigger
              trigger={["hover", "focus"]}
              placement="left"
              overlay={
                <Popover id={`popover-${service._id}`}>
                  <Popover.Body>{service.tooltip}</Popover.Body>
                </Popover>
              }
            >
              <InfoOutlined />
            </OverlayTrigger>
          </Col>
        </Row>
      </div>
      {isSubListOpen ? (
        <ServiceListItemSubForm
          service={service}
          values={selections}
          role={role}
          onSave={(vals) => {
            onSelectionChange({
              target: {
                name: service._id,
                value: true,
                answers: vals,
              },
            });
            toggleSelection();
          }}
          onClear={() =>
            onSelectionChange({
              target: {
                name: service._id,
                value: true,
                answers: {},
              },
            })
          }
          onToggle={() => toggleSubForm()}
        />
      ) : null}
    </>
  );
};

const ServicesList = ({ role = "helper", values = {}, onChange }) => {
  const [formData, setFormData] = useState({});
  const [selections, setSelections] = useState({});
  const [openSubList, setOpenSubList] = useState(null);

  const { isLoading, data: services } = useApiGet(
    "services",
    "/services",
    null,
    {
      staleTime: 300000,
    }
  );

  useEffect(() => {
    const fd = {};

    Object.keys(values).forEach((s) => (fd[s] = true));

    setFormData(fd);
    setSelections(values);
  }, [values]);

  const onSelectionChange = (e) => {
    let newFormData = { ...formData, [e.target.name]: e.target.value };
    let newSelections = { ...selections, [e.target.name]: e.target.answers };

    // remove the selection if it is unchecked (value === false)
    if (!e.target.value) {
      delete newFormData[e.target.name];
      delete newSelections[e.target.name];
    }

    setFormData(newFormData);
    setSelections(newSelections);

    const combined = {};

    Object.keys(newFormData).forEach((k) => {
      combined[k] = newSelections[k] || null;
    });

    onChange(combined);

    if (e.target.value) {
      setOpenSubList(e.target.name);
    } else {
      setOpenSubList(null);
    }
  };

  return (
    <FormGroup>
      <h3 className="mb-3">
        {role === "customer"
          ? "Select the type of help you need"
          : "Select the types of help you can provide"}
      </h3>
      {isLoading ? (
        <p>Loading services...</p>
      ) : (
        services.map((service, i) => {
          return (
            <ServiceListItem
              service={service}
              isSubListOpen={openSubList === service._id}
              key={i}
              isChecked={formData[service._id] || false}
              onSelectionChange={onSelectionChange}
              selections={selections[service._id] || {}}
              toggleSelection={() => setOpenSubList(null)}
              toggleSubForm={() =>
                setOpenSubList(openSubList ? null : service._id)
              }
              role={role}
            />
          );
        })
      )}
    </FormGroup>
  );
};

ServiceListItemSubForm.propTypes = {
  service: PropTypes.object.isRequired,
  values: PropTypes.object,
  role: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

ServiceListItem.propTypes = {
  service: PropTypes.object.isRequired,
  isSubListOpen: PropTypes.bool,
  isChecked: PropTypes.bool,
  onSelectionChange: PropTypes.func.isRequired,
  selections: PropTypes.object,
  toggleSelection: PropTypes.func.isRequired,
  toggleSubForm: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
};

ServicesList.propTypes = {
  role: PropTypes.oneOf(["helper", "customer"]),
  values: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default ServicesList;
