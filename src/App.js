import React, { useGlobal } from "reactn";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "./initGlobals";
import "./reducers/authReducers";
import "./reducers/jobRequestReducers";

import PrivateRoute from "./components/auth/PrivateRoute";
import CMS from "./components/layout/CMS";
import NewHelper from "./components/helper/NewHelper";
import NewCustomer from "./components/customer/NewCustomer";
import NewCustomerProfile from "./components/customer/NewCustomerProfile";

import Login from "./components/auth/Login";
import VerificationCode from "./components/auth/VerificationCode";
import EmailHashVerification from "./components/auth/EmailHashVerification";

import Dashboard from "./components/dashboard/Dashboard";
import Calendar from "./components/calendar/Calendar";

import Messages from "./components/messages/Messages";
import SystemConversation from "./components/messages/SystemConversation";
import ConversationsOverview from "./components/messages/ConversationsOverview";
import Conversation from "./components/messages/Conversation";

import Payments from "./components/payments/Payments";
import NewPaymentMethod from "./components/customer/NewPaymentMethod";

import Profile from "./components/profile/Profile";
import SkillsAndExperience from "./components/profile/helper/SkillsAndExperience";
import PersonalInformation from "./components/profile/helper/PersonalInformation";
import Services from "./components/profile/helper/Services";
import Licenses from "./components/profile/helper/Licenses";
import Languages from "./components/profile/helper/Languages";
import AboutMe from "./components/profile/helper/AboutMe";
import WorkExperience from "./components/profile/helper/WorkExperience";
import CustomerReviews from "./components/profile/customer/Reviews";
import HelperReviews from "./components/profile/helper/Reviews";

import { default as AboutMeCustomer } from "./components/profile/customer/AboutMe";
import { default as PersonalInformationCustomer } from "./components/profile/customer/PersonalInformation";
import EmergencyContacts from "./components/profile/customer/EmergencyContacts";
import HealthInformation from "./components/profile/customer/HealthInformation";
import DailyCare from "./components/profile/customer/healthInformation/DailyCare";
import HealthConditions from "./components/profile/customer/healthInformation/HealthConditions";
import Medications from "./components/profile/customer/healthInformation/Medications";
import Providers from "./components/profile/customer/healthInformation/Providers";

import Account from "./components/account/Account";
import AccountSettings from "./components/account/helper/AccountSettings";
import PaymentSettings from "./components/account/helper/PaymentSettings";
import TaxInfo from "./components/account/helper/TaxInfo";
import PersonalInfo from "./components/account/customer/PersonalInfo";
import CustomerPaymentSettings from "./components/account/customer/CustomerPaymentSettings";
import NotificationSettings from "./components/account/customer/NotificationSettings";
import AddProfile from "./components/account/customer/AddProfile";
import HelperNotificationSettings from "./components/account/helper/NotificationSettings";
import HelperBackgroundCheck from "./components/helper/HelperBackgroundCheck";

const queryClient = new QueryClient();

function App() {
  const [user] = useGlobal("user");

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/become-a-helper" component={NewHelper} />

          <PrivateRoute
            path="/find-help/payment"
            component={NewPaymentMethod}
            authenticated={user != null}
          />
          <PrivateRoute
            path="/find-help/continue"
            component={NewCustomerProfile}
            authenticated={user != null}
          />
          <Route path="/find-help" component={NewCustomer} />

          <Route
            path="/sign-in/verify/:hash"
            component={EmailHashVerification}
          />
          <Route path="/sign-in/verify" component={VerificationCode} />
          <Route path="/sign-in" component={Login} />

          <PrivateRoute
            path="/dashboard"
            component={Dashboard}
            authenticated={user !== null}
          />

          <PrivateRoute
            path="/calendar"
            component={Calendar}
            authenticated={user !== null}
          />

          {/* MESSAGES */}
          <PrivateRoute
            path="/messages/system"
            component={SystemConversation}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/messages/:conversationWith/:jobId"
            component={Conversation}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/messages/:conversationWith"
            component={ConversationsOverview}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/messages"
            component={Messages}
            authenticated={user !== null}
          />

          <PrivateRoute
            path="/payments"
            component={Payments}
            authenticated={user !== null}
          />

          {/* HELPER PROFILE */}
          <PrivateRoute
            path="/profile/personal-information"
            component={PersonalInformation}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/profile/skills-experience/services"
            component={Services}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/profile/skills-experience/licenses"
            component={Licenses}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/profile/skills-experience/languages"
            component={Languages}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/profile/skills-experience/work-experience"
            component={WorkExperience}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/profile/skills-experience"
            component={SkillsAndExperience}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/profile/about-me"
            component={AboutMe}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/profile/add"
            component={AddProfile}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/profile/reviews"
            component={HelperReviews}
            authenticated={user !== null}
          />

          {/* CUSTOMER PROFILE */}
          <PrivateRoute
            path="/profile/:profileId/about-me"
            component={AboutMeCustomer}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId/personal-information"
            component={PersonalInformationCustomer}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId/emergency-contacts"
            component={EmergencyContacts}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId/health-information/daily-care"
            component={DailyCare}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId/health-information/health-conditions-diseases"
            component={HealthConditions}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId/health-information/medications"
            component={Medications}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId/health-information/healthcare-providers"
            component={Providers}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId/health-information"
            component={HealthInformation}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId/reviews"
            component={CustomerReviews}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/profile/:profileId"
            component={Profile}
            authenticated={user !== null && user.customer}
          />

          <PrivateRoute
            path="/profile"
            component={Profile}
            authenticated={user !== null}
          />

          {/** HELPER ACCOUNT ITEMS */}
          <PrivateRoute
            path="/account/settings"
            component={AccountSettings}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/account/payment-settings"
            component={PaymentSettings}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/account/tax-info"
            component={TaxInfo}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/account/tax-info"
            component={TaxInfo}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/account/helper-notification-settings"
            component={HelperNotificationSettings}
            authenticated={user !== null}
          />
          <PrivateRoute
            path="/background-check"
            component={HelperBackgroundCheck}
            authenticated={user !== null}
          />

          {/** CUSTOMER ACCOUNT ITEMS */}
          <PrivateRoute
            path="/account/personal-info"
            component={PersonalInfo}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/account/recipient-payment-settings"
            component={CustomerPaymentSettings}
            authenticated={user !== null && user.customer}
          />
          <PrivateRoute
            path="/account/notification-settings"
            component={NotificationSettings}
            authenticated={user !== null && user.customer}
          />

          <PrivateRoute
            path="/account"
            component={Account}
            authenticated={user !== null}
          />

          <Route path="/:pageUrl" children={<CMS />} />
          <Route path="/" component={CMS} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
