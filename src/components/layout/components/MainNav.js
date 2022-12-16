import React, { useGlobal, useDispatch } from "reactn";
import { Link } from "react-router-dom";
import { Button, DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";

import PermIdentity from "@material-ui/icons/PermIdentity";

const MainNav = () => {
  const [user] = useGlobal("user");

  const authLinks = [
    {
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      label: "Profile",
      url: "/profile",
    },
    {
      divider: true,
    },
    {
      label: "Sign Out",
      url: "/sign-out",
    },
  ];
  const unAuthLinks = [
    {
      label: "Sign In",
      url: "/sign-in",
    },
    {
      divider: true,
    },
    {
      label: "Become A Helper",
      url: "/become-a-helper",
    },
    {
      label: "Find Help",
      url: "/find-help",
    },
  ];

  const links = user !== null ? authLinks : unAuthLinks;
  const logoutDispatch = useDispatch("logout");

  return (
    <div className="text-end main-nav">
      <Button as={Link} to="/why-manana" variant="link">
        WHY MANANA
      </Button>
      <Button
        as={Link}
        to="/become-a-helper"
        variant="outline-primary"
        className="add-padding"
      >
        BECOME A HELPER
      </Button>
      <Button
        as={Link}
        to="/find-help"
        variant="primary"
        className="add-padding"
      >
        FIND HELP
      </Button>
      <DropdownButton
        as={ButtonGroup}
        id={`dropdown-button-drop-start`}
        drop="start"
        variant="link"
        title={<PermIdentity />}
      >
        {links.map((link, key) => {
          if (link.divider) {
            return <Dropdown.Divider key={key} />;
          }
          if (link.label === 'Sign Out'){
            return (
              <Dropdown.Item key={key} eventKey={key + 1} as="button" varinat="link" onClick={() => logoutDispatch()}>
                {link.label}
              </Dropdown.Item>
            );
          }
          return (
            <Dropdown.Item key={key} eventKey={key + 1} as={Link} to={link.url}>
              {link.label}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    </div>
  );
};

export default MainNav;
