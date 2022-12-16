import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Button, FormGroup, FormCheck } from "react-bootstrap";
import moment from "moment-timezone";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Share from "@material-ui/icons/Share";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Edit from "@material-ui/icons/Edit";
import ChevronRight from "@material-ui/icons/ChevronRight";

import HelperAvailabilityForm from "./HelperAvailabilityForm";
import HelperSearchFiltersForm from "./HelperSearchFiltersForm";
import HelperSearchSortForm from "./HelperSearchSortForm";

import HelperShortProfile from "../../helper/HelperShortProfile";
import HelperFullProfile from "../../helper/HelperFullProfile";

import { useFormData } from "../../../hooks/useFormData";
import { useApiPost } from "../../../hooks/useApi";

function getApiFilters(filters) {
  const apiFilters = {};

  if (filters.age) {
    apiFilters.age = { min: filters.ageMin, max: filters.ageMax };
  }
  if (filters.gender && filters.gender.length > 0) {
    apiFilters.gender = filters.gender;
  }
  if (filters.languages && filters.languages.length > 0) {
    apiFilters.languages = filters.languages;
  }
  if (filters.licenses && filters.licenses.length > 0) {
    apiFilters.licenses = filters.licenses;
  }

  return apiFilters;
}

const defaultFilters = {
  gender: [],
  age: false,
  ageMin: 25,
  ageMax: 40,
  languages: [],
  licenses: [],
};

const NewCustomerHelperStep = ({ onComplete, onBack, serviceArea }) => {
  const { formData, onChange, hasChanged, toggleCheckboxValue } = useFormData({
    helpers: [],
    availabilityFilters: null,
  });
  const [showAvail, setShowAvail] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("price:1");
  const [showSort, setShowSort] = useState(false);
  const [apiFiltersCount, setApiFiltersCount] = useState(0);
  const [list, setList] = useState([]);
  const [viewHelper, setViewHelper] = useState(null);

  const apiSearch = useApiPost(`/helpers/search/${serviceArea}`, (resp) => {
    setList(resp);
  });

  useEffect(() => {
    const params = getApiFilters(filters);
    setApiFiltersCount(Object.keys(params).length);
    apiSearch.mutate({ filters: params, sort: sort.split(":") });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  const onSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  if (viewHelper !== null) {
    return (
      <div style={{ position: "relative" }}>
        <HelperAvailabilityForm
          show={showAvail}
          toggle={() => setShowAvail(!showAvail)}
          selections={formData.availabilityFilters}
          onApply={(newAvailFilters) => {
            onChange({
              target: { name: "availabilityFilters", value: newAvailFilters },
            });
          }}
        />
        <div className="float-end">
          <Button
            type="button"
            variant="link"
            onClick={() => alert("Share")}
            style={{
              margin: 0,
              marginTop: "0.25rem",
              padding: 0,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            SHARE <Share />
          </Button>
        </div>
        <Button
          type="button"
          variant="link"
          onClick={() => setViewHelper(null)}
          style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
        >
          <ArrowBack />
        </Button>
        <HelperFullProfile user={viewHelper} />
        {formData.availabilityFilters === null ? (
          <Button
            variant="primary"
            onClick={() => setShowAvail(!showAvail)}
            style={{ width: "100%" }}
          >
            CHECK AVAILABILITY
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => {
              toggleCheckboxValue("helpers", viewHelper._id);
              setViewHelper(null);
            }}
            style={{ width: "100%" }}
          >
            SELECT THIS HELPER
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="link"
        onClick={() => onBack()}
        style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
      >
        <ArrowBack />
      </Button>
      <form onSubmit={onSubmit} style={{ position: "relative" }}>
        <h4 className="mb-3">Select a helper</h4>

        <div className="mb-3">
          {formData.availabilityFilters === null ? (
            <Button
              variant="outline-primary"
              onClick={() => setShowAvail(!showAvail)}
              style={{ width: "100%" }}
            >
              FILTER BY AVAILABILITY
            </Button>
          ) : (
            <div
              onClick={() => setShowAvail(!showAvail)}
              style={{ cursor: "pointer" }}
            >
              <Row>
                <Col xs={1}>
                  <CalendarToday />
                </Col>
                <Col>
                  <div className="float-end">
                    <Edit />
                  </div>
                  <h5>
                    {moment(
                      formData.availabilityFilters.startDate,
                      "YYYY-MM-DD"
                    ).format("ddd, MMM Do")}
                  </h5>
                  <p className="text-muted">
                    Between {formData.availabilityFilters.startTime} and{" "}
                    {formData.availabilityFilters.endTime}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </div>
        <HelperAvailabilityForm
          show={showAvail}
          toggle={() => setShowAvail(!showAvail)}
          selections={formData.availabilityFilters}
          onApply={(newAvailFilters) => {
            onChange({
              target: { name: "availabilityFilters", value: newAvailFilters },
            });
          }}
        />
        <Row>
          <Col xs={12} sm={6}>
            <Button
              variant="outline-primary"
              style={{ width: "100%" }}
              onClick={() => setShowFilters(!showFilters)}
            >
              OTHER FILTERS
              {apiFiltersCount > 0 ? (
                <span style={{ marginLeft: "0.5rem" }}>
                  &middot; {apiFiltersCount}
                </span>
              ) : null}
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <Button
              variant="outline-primary"
              style={{ width: "100%" }}
              onClick={() => setShowSort(!showSort)}
            >
              SORT BY
            </Button>
          </Col>
        </Row>
        <HelperSearchFiltersForm
          show={showFilters}
          toggle={() => setShowFilters(!showFilters)}
          filters={filters}
          onApply={(newFilters) => {
            setFilters(newFilters);
          }}
          onClear={() => {
            setFilters(defaultFilters);
          }}
        />
        <HelperSearchSortForm
          show={showSort}
          toggle={() => setShowSort(!showSort)}
          selected={sort}
          onChange={(newSort) => {
            setSort(newSort);
          }}
        />

        <hr />

        <h3 className="mb-4">Helpers in your area</h3>

        {apiSearch.isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="profile-list">
            {list.length > 0 ? (
              list.map((helper, helperIndex) => {
                return (
                  <div key={helperIndex}>
                    <div className="float-end">
                      {formData.availabilityFilters === null ? (
                        <Button
                          variant="link"
                          size="lg"
                          className="m-0 p-0"
                          onClick={() => setViewHelper(helper)}
                        >
                          <ChevronRight />
                        </Button>
                      ) : (
                        <FormGroup>
                          <FormCheck
                            label=""
                            checked={formData.helpers.includes(helper._id)}
                            onChange={(e) =>
                              toggleCheckboxValue("helpers", helper._id)
                            }
                          />
                        </FormGroup>
                      )}
                    </div>
                    <HelperShortProfile
                      profile={helper}
                      onSelect={() => setViewHelper(helper)}
                    />
                  </div>
                );
              })
            ) : (
              <p>No helpers match your criteria or availability.</p>
            )}
          </div>
        )}

        <div className="text-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ minWidth: 200 }}
            disabled={formData.helpers.length === 0}
          >
            NEXT
          </Button>
        </div>
      </form>
    </>
  );
};

NewCustomerHelperStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NewCustomerHelperStep;
