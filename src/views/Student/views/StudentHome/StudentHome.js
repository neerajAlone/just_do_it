import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './StudentHome.css';

function StudentHome(props) {
  return <Fragment>
    <div className="sCourseContainer">
    {props.courseArray && props.courseArray
      .filter(eCourse=>eCourse.status)
      .map((eCourse, index)=>{
        return <div className="sCourseBox" key={index}>
          <Link to={`/courses/course/${eCourse.id}`}>
            <div className="sCourseImage"
              style={{backgroundImage: `url(${eCourse.image})`}}>
              {eCourse.courseOffer?
                <div className="sCourseTag">
                  <h4>{eCourse.courseOffer}% Off.</h4>
                </div>:null
              }
            </div>
            <div className="sCourseBody">
              <p>{eCourse.courseName}</p>
            </div>
          </Link>
        </div>
      })}
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    courseArray: state.reqArrays.allTrimmedCourss
  }
}

export default connect(mapStateToProps, null)(StudentHome);