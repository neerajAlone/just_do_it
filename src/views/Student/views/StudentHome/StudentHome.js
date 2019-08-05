import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './StudentHome.css';

function StudentHome(props) {
  return <Fragment>
    {console.log(props)}
    <div className="homeBox">
      <div className="homeBox1">
        <img src={require('../../../../amar/pic9.png')} alt="" />
      </div>
      <div className="homeBox1">
        <p>
          We take full responsibilty of every student who
          joined us for our different courses, that they
          learned and practised is 101% for there
          future foundation.
        </p>
      </div>
    </div>
    <div className="studentCourses">
      <h1>OUR COURSES</h1>
      <div className="studentCoursesBox">
        {props.courseArray && props.courseArray.map(eCourse=>{
          return <div className="sCourseBox" key={eCourse._id}>
            <Link to={`/student/course/${eCourse._id}`}>
              <div className="sCourseImage"
                style={{
                  backgroundImage: `url(${eCourse.image})`
                }}>
                <div className="sCourseTag">
                  <div>
                    <h5>WEB DEVELOPMENT</h5>
                    <i className="fas fa-code"></i>
                  </div>
                </div>
                <div className="sCourseTag">
                  <div>
                    <h5>BATCH</h5>
                    <i className="fas fa-users"></i>
                  </div>
                </div>
                <div className="sCourseTag">
                  <div>
                    <h5>4.5</h5>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <div className="sCourseContent">
                <h3>{eCourse.courseName}</h3>
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
    courseArray: state.aUserAdmins.allCourses
  }
}

export default connect(mapStateToProps, null)(StudentHome);