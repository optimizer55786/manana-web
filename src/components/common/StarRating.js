import React from "reactn";
import PropTypes from "prop-types";
import Star from "@material-ui/icons/Star";
import StarHalf from "@material-ui/icons/StarHalf";
import StarOutline from "@material-ui/icons/StarOutline";
import styled from "styled-components";

const StarWrapper = styled.div`
  color: ${props => props.color };
  .MuiSvgIcon-root{
    font-size: ${props => props.size};
    margin-left: ${props => props.margin*0.5}rem;
    margin-right: ${props => props.margin*0.5}rem;
  }
`;

const StarRating = ({ rating, totalRatings, color = 'black', size = "1.5rem", margin = 0 }) => {
  const full = Math.floor(rating);
  const half = rating >= full + 0.5 ? 1 : 0;
  const empty = 5 - (full + half);

  const stars = [];
  for (let i = 1; i <= full; i++) {
    stars.push(<Star key={i - 1} />);
  }

  if (half > 0) {
    stars.push(<StarHalf key={full} />);
  }

  for (let i = 1; i <= empty; i++) {
    stars.push(<StarOutline key={full + i} />);
  }

  return (
    <StarWrapper className="star-rating d-flex align-items-center" color={color} size={size} margin={margin}>
      {stars} {totalRatings !== null ?? <span className="text-muted" >({totalRatings} reviews)</span> }
    </StarWrapper>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
