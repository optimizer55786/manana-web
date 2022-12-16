import React, { useDispatch, useEffect, useGlobal } from "reactn";
import { Link, useLocation } from "react-router-dom";
import { createMedia } from "@artsy/fresnel";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Alert,
} from "react-bootstrap";

import PermIdentity from "@material-ui/icons/PermIdentity";
import Search from "@material-ui/icons/Search";
import Texture from "@material-ui/icons/Texture";
import CalendarToday from "@material-ui/icons/CalendarToday";
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline";
import AttachMoney from "@material-ui/icons/AttachMoney";
import PersonOutline from "@material-ui/icons/PersonOutline";
import Settings from "@material-ui/icons/Settings";
import Add from "@material-ui/icons/Add";

import Footer from "./components/Footer";

import logo from "../../logo.png";

import "bootstrap/dist/css/bootstrap.min.css";
import "./PrimaryLayout.css";
import "./InternalLayout.css";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const navList = [
  {
    icon: <Texture />,
    to: "/dashboard",
    label: "Dashboard",
    types: ["sysadmin", "helper"],
    count: 0,
  },
  {
    icon: <CalendarToday />,
    to: "/calendar",
    label: "Calendar",
    types: [],
    count: 0,
  },
  {
    icon: <ChatBubbleOutline />,
    to: "/messages",
    label: "Messages",
    types: [],
    count: 1,
  },
  {
    icon: <AttachMoney />,
    to: "/payments",
    label: "Payments",
    types: [],
    count: 0,
  },
  {
    icon: <Settings />,
    to: "/account",
    label: "Account",
    types: [],
    count: 0,
  },
  {
    icon: <PersonOutline />,
    to: "/profile",
    label: "Profile",
    types: ["helper"],
    count: 0,
  },
  {
    icon: <PersonOutline />,
    to: "/profile",
    label: "Profile",
    types: ["customer"],
    count: 0,
    addon: (
      <div className="float-end text-end">
        <Link to={"/profile/add"}>
          <Button variant="link" className="m-0 p-0">
            <Add />
          </Button>
        </Link>
      </div>
    ),
  },
];

const PageHeader = ({ children, mobile }) => {
  const logoutDispatch = useDispatch("logout");

  return (
    <div className="internal-page-header">
      <Container fluid>
        <Row>
          <Col md={3}>
            <Link to="/">
              <img
                src={logo}
                title="manana"
                alt="manana"
                className="page-header__logo"
              />
            </Link>
          </Col>
          <Col md={9}>
            <nav>
              <DropdownButton
                as={ButtonGroup}
                id={`dropdown-button-drop-start`}
                drop="start"
                variant="link"
                title={<PermIdentity />}
              >
                <Dropdown.Item
                  eventKey="1"
                  as="button"
                  variant="link"
                  onClick={() => logoutDispatch()}
                >
                  Sign Out
                </Dropdown.Item>
              </DropdownButton>
              <Button type="button" variant="link">
                <Search />
              </Button>
            </nav>
          </Col>
        </Row>
        {children}
      </Container>
    </div>
  );
};

const DesktopContainer = ({ alert, children }) => {
  const [user] = useGlobal("user");
  const type = user.helper ? "helper" : "customer";
  const nav = [...navList];
  const location = useLocation();

  if (type === "customer" && user.customer.profiles) {
    user.customer.profiles.forEach((p) => {
      nav.push({
        icon: null,
        to: `/profile/${p._id}`,
        label: p.name,
        types: ["customer"],
        className: "sub-profile-link",
      });
    });
  }
  if (type === "helper" && 
    (!user.helper.backgroundCheck || !user.helper.backgroundCheck.checkrId)
  ) {
    nav.push({
      icon: <PersonOutline />,
      to: "/background-check",
      label: "Background Check",
      types: ["helper"],
      count: 0,
    });
  }

  return (
    <Media greaterThan="mobile">
      <PageHeader mobile={false} />
      <div className="internal-page-content">
        <div className="content-nav">
          {nav.map((item, i) => {
            if (item.types.length > 0 && !item.types.includes(type)) {
              return null;
            }

            const isActive = location.pathname.indexOf(item.to) > -1;
            const className = `${item.className || ""} ${
              isActive ? "active" : ""
            }`;

            return (
              <div key={i}>
                {item.addon ? item.addon : null}
                <Link to={item.to} className={className}>
                  <span className="nav-icon">
                    {item.icon ? item.icon : null}
                  </span>
                  <span className="nav-label">{item.label}</span>
                  {item.count > 0 ? (
                    <Badge bg="danger">{item.count}</Badge>
                  ) : null}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="content-body">{children}</div>
      </div>
    </Media>
  );
};

const MobileContainer = ({ alert, children }) => {
  return (
    <Media at="mobile">
      <Container fluid>
        <p>[HEADER]</p>
        <p>[NAV]</p>
        {children}
      </Container>
    </Media>
  );
};

const PrimaryLayout = ({ children }) => {
  const user = useGlobal("user");
  const location = useLocation();
  const alert =
    location.state && location.state.alert ? location.state.alert : null;

  useEffect(() => {
    if (!alert) {
      return;
    }

    window.history.replaceState({}, window.document.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContents = () => {
    return (
      <>
        {alert ? (
          <Alert variant={alert.variant} className="header-error">
            {alert.msg}
          </Alert>
        ) : null}
        {children}
      </>
    );
  };

  return (
    <MediaContextProvider>
      <DesktopContainer>{getContents()}</DesktopContainer>
      <MobileContainer>{getContents()}</MobileContainer>
      <Footer includeHelpText={user && user.role === ""} />
    </MediaContextProvider>
  );
};

export default PrimaryLayout;
