import React, { useGlobal, useState, useDispatch } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment-timezone";
import get from "lodash.get";

import AddCircle from "@material-ui/icons/AddCircle";
import Edit from "@material-ui/icons/Edit";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";

const WorkExperienceForm = ({ data, onComplete, onBack }) => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange } = useFormData({
    employer: data.employer || "",
    title: data.title || "",
    currentJob: data.currentJob || false,
    startDate: data.startDate
      ? moment.utc(data.startDate).format("YYYY-MM-DD")
      : "",
    endDate: data.endDate ? moment.utc(data.endDate).format("YYYY-MM-DD") : "",
    description: data.description || "",
  });

  const updateUser = useDispatch("updateUser");

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    onBack();
  });

  const onSubmit = (e) => {
    e.preventDefault();

    const workExperience = get(user, "helper.profile.workExperience") || [];

    // update the data in the user profile
    const payload = {
      "helper.profile.workExperience": [...workExperience],
    };

    // merge in the data
    if (data._id) {
      const index = workExperience.findIndex((w) => w._id === data._id);
      if (index === undefined) {
        alert("Could not find the record in your profile any longer.");
        onBack();
        return;
      } else {
        workExperience[index] = { ...workExperience[index], ...formData };
        payload["helper.profile.workExperience"] = workExperience;
      }
    } else {
      payload["helper.profile.workExperience"].push(formData);
    }

    // update the user profile
    save.mutate(payload);
  };

  return (
    <SubInternalLayout
      alertMutate={save}
      title={`Work Experience`}
      onBack={() => onBack()}
    >
      <form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Employer</Form.Label>
          <Form.Control
            name="employer"
            placeholder="employer name"
            required
            onChange={onChange}
            value={formData.employer}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            placeholder="job title"
            required
            onChange={onChange}
            value={formData.title}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="currentJob"
            label="This is my current job."
            onChange={(e) =>
              onChange({
                target: { name: "currentJob", value: !formData.currentJob },
              })
            }
            checked={formData.currentJob}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col xs={5} md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                placeholder="start date"
                required
                onChange={onChange}
                value={formData.startDate}
              />
            </Form.Group>
          </Col>
          <Col xs={2} md={1} className="text-center">
            <Form.Group className="mt-4">
              <Form.Text className="text-center">
                <strong>-</strong>
              </Form.Text>
            </Form.Group>
          </Col>
          <Col xs={5} md={3}>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                placeholder="end date"
                required={formData.currentJob === false}
                disabled={formData.currentJob !== false}
                onChange={onChange}
                value={formData.endDate}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <div className="float-end">
            <small className="text-muted">
              {formData.description.length}/250 Characters
            </small>
          </div>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            placeholder="job description"
            required
            onChange={onChange}
            value={formData.description}
            maxLength={250}
            style={{ minHeight: 125 }}
          />
        </Form.Group>

        <div className="text-end mt-3">
          <Button type="submit" disabled={!hasChanged || save.isLoading}>
            {save.isLoading ? <SpinIcon /> : "Save Changes"}
          </Button>
        </div>
      </form>

      <br />
      <br />
    </SubInternalLayout>
  );
};

const WorkExperience = () => {
  const [user] = useGlobal("user");
  const [edit, setEdit] = useState(null);

  const renderWorkExperience = () => {
    if (!user.helper.profile || !user.helper.profile.workExperience) {
      return null;
    }

    return user.helper.profile.workExperience.map((work, i) => {
      return (
        <div key={i}>
          <Row>
            <Col xs={10} sm={11}>
              <h5 className="m-0 p-0">
                {work.employer}, {work.title}
              </h5>
            </Col>
            <Col xs={2} sm={1}>
              <Button variant="link" onClick={() => setEdit(work)}>
                <Edit />
              </Button>
            </Col>
          </Row>
          <p className="text-muted" style={{ fontWeight: 700 }}>
            {moment.utc(work.startDate).format("MM/DD/YYYY")} -{" "}
            {work.currentJob
              ? "present"
              : moment.utc(work.endDate).format("MM/DD/YYYY")}
          </p>
        </div>
      );
    });
  };

  if (edit !== null) {
    return (
      <WorkExperienceForm
        data={edit}
        onComplete={() => setEdit(null)}
        onBack={() => setEdit(null)}
      />
    );
  }

  return (
    <SubInternalLayout title={`Work Experience`}>
      {renderWorkExperience()}
      <hr />
      <Button
        variant="link"
        style={{ textDecoration: "none" }}
        onClick={() => setEdit({})}
      >
        <AddCircle /> ADD ANOTHER
      </Button>
    </SubInternalLayout>
  );
};

WorkExperienceForm.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    employer: PropTypes.string,
    title: PropTypes.string,
    currentJob: PropTypes.bool,
    startDate: PropTypes.string, // date string
    endDate: PropTypes.string, // date string
  }),
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default WorkExperience;
