import React from "reactn";
import PropTypes from "prop-types";

const ProfilePicture = ({ user, size = "sm" }) => {
  if (!user || (!user.customer && !user.helper)) {
    // system message
    return <div className={`profile-photo-${size}`}>m</div>;
  }

  const info = user.customer || user.helper;

  if (!info.profile || !info.profile.profileImage) {
    return (
      <div className={`profile-photo-${size}`}>{user.name.substring(0, 1)}</div>
    );
  }

  return (
    <div className={`profile-photo-${size}`}>
      <img
        src={info.profile.profileImage}
        alt={user.name}
        title={user.name}
        className="img-fluid"
      />
    </div>
  );
};

ProfilePicture.propTypes = {
  user: PropTypes.object,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default ProfilePicture;
