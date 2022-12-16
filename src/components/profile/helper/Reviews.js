import React, { useGlobal, useState } from "reactn";
import { Row, Col} from "react-bootstrap";
import { useHistory } from "react-router-dom";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useApiGet } from "../../../hooks/useApi";

import StarRating from "../../common/StarRating";
import Pagination from "../../common/Pagination";
import moment from "moment";

const Reviews = () => {
  const [user] = useGlobal("user");
  const [page, setPage] = useState(1);

  const { isLoading, data, error } = useApiGet(
    "reviews",
    `/users/${user._id}/ratings`,
    { page }
  );

  return (
    <SubInternalLayout title={`Reviews`}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        data.rows.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="border-bottom mt-3">
              <Row>
                <Col xs={2}>
                  <img src="https://mh-user-uploads.s3.us-east-2.amazonaws.com/local/image/61d1bf61a39ec9028444dde9/IMG_7912.jpg" alt="User" className="w-100 rounded-circle"/>
                </Col>
                <Col>
                    <div className="float-end d-flex align-items-center">
                        <p className="small text-muted mx-3 mb-0">{moment(row.date).format('MMM. D').toUpperCase()}</p>
                        <StarRating rating={row.rating} totalRatings={null} color={"#205b68"} size={"1rem"} margin={1}/>
                    </div>
                  <p className="body2">{row.fromUser.name}</p>
                  <p className="body1 text-muted">{row.comment}</p>
                </Col>
              </Row>
            </div>
          );
        })
      )}
      <br />
      {!isLoading ?(
        <div className="d-flex justify-content-center">
          <Pagination  
            className = "pagination-bar"
            currentPage = { page }
            totalCount = { data.totalCount }
            pageSize = { 5 }
            onPageChange = { p => setPage(p) }
            siblingCount = { 0 }
          />
        </div>):(<></>)
      }
    </SubInternalLayout>
  );
};

export default Reviews;
