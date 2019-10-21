import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './StudentHome.css';

function StudentHome(props) {
  return <Fragment>
    <div className="studentCourses">
      <div className="studentCoursesBox">
      {props.courseArray && props.courseArray.map((eCourse, index)=>{
        return <div className="studentCourseContainer" key={index}>
          <Link to={`/courses/course/${eCourse._id}`}>
            <div className="studentCourseBox">
              <div className="scbImageBox">
                <img src={eCourse.image} alt={eCourse.courseName} />
                <div className="scbImageBox1">
                  <div className="scbiIconText">
                    <div className="scbiIconText1">
                      <i className="fas fa-code"></i>
                      <h4>{eCourse.category}</h4>
                    </div>
                  </div>
                  <div className="scbiIconText">
                    <div className="scbiIconText1">
                      <i className="fas fa-users"></i>
                      <h4>{eCourse.batch}</h4>
                    </div>
                  </div>
                  <div className="scbiIconText">
                    <div className="scbiIconText1">
                      <i className="fas fa-star"></i>
                      <h4>4.5</h4>
                    </div>
                  </div>
                </div>
              </div>
              <p>{eCourse.courseName}</p>
            </div>
          </Link>
        </div>
      })}
      </div>
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    courseArray: state.reqArrays.allCourses
  }
}

export default connect(mapStateToProps, null)(StudentHome);