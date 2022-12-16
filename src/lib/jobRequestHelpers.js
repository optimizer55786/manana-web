import moment from "moment-timezone";

export const getUserRateFromJobRequest = (user, jobRequest) => {
  switch (true) {
    case jobRequest.isOvernight === true:
      return user.helper.hourlyRates.overnight || false;
    case jobRequest.specializedCare && jobRequest.specializedCare.length > 0:
      return user.helper.hourlyRates.specializedCare || false;
    default:
      return user.helper.hourlyRates.standard;
  }
};

export const getMessageTitle = (msg, convoWith, user) => {
  switch (msg.communicationType) {
    case "system":
      return <h5>Manana Support</h5>;
    case "job":
      return msg.helper === user._id || msg.helper === convoWith._id ? (
        <h5>Booking on {moment(msg.date).format("ddd, MMMM D")}</h5>
      ) : (
        <h5>New help request</h5>
      );
    default:
      return (
        <h5>
          {moment(msg.date).format("ddd, MMMM D")} with {convoWith.name}
        </h5>
      );
  }
};

export const getNotOpenReason = (job, user) => {
  const d = job.declinedBy.find((by) => by.helper === user._id);

  if (job.canceledOn !== null) {
    return "This request was canceled by the care recipient.";
  } else if (job.helper && job.helper !== user._id) {
    return "This request was accepted by another helper.";
  } else if (d) {
    return "You declined this request.";
  } else {
    return "This request has expired.";
  }
};

export const getIsOpen = (job, user) => {
  if (job.helper !== null && job.helper !== user._id) {
    return false;
  }

  const d = job.declinedBy.find((by) => by.helper === user._id);

  if (d) {
    return false;
  }

  return true;
};
