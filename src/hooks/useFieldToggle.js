import React, { useState } from "reactn";
import { Button } from "react-bootstrap";
import Edit from "@material-ui/icons/Edit";

export const useFieldToggle = (defaults = {}) => {
  const [toggled, setToggled] = useState(defaults);

  const toggle = (fieldKey) => {
    const changes = { ...toggled };
    changes[fieldKey] = changes[fieldKey] ? false : true;
    setToggled(changes);
  };

  const isToggled = (fieldKey) => {
    if (!toggled[fieldKey]) {
      return false;
    }
    return true;
  };

  const toggleBtn = (key) => {
    if (toggled[key]) {
      return null;
    }

    return (
      <div className="float-end">
        <Button type="button" variant="link" onClick={() => toggle(key)}>
          <Edit />
        </Button>
      </div>
    );
  };

  return { toggle, isToggled, toggleBtn };
};
