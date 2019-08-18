import React, {Fragment, useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from 'firebase/app';
import 'firebase/auth';

import './StudentWorkspace.css';
import CMM from './CourseMssgModal/CourseMssgModal';

function StudentWorkspace(props) {
  let [cmmOpen, setcmmOpen] = useState(false);
  let [pCoursesBox, setpCoursesBox] = useState([]);
  useEffect(()=>{
    if(auth().currentUser) {
      if(props.pCourses !== 0) {
        props.pCourses.forEach(cId=>{
          let cObject = props.courseArray.find(eCourse=>{
            return eCourse._id === cId
          })
          setpCoursesBox([cObject, ...pCoursesBox])
        })
      }
    }
  }, [])
  console.log(pCoursesBox)
  
  function cmmToggle(openStatus) {
    setcmmOpen(openStatus);
  }
  function goDown() {
    window.location.href="#swsCourseInfo";
  }
  function goUp() {
    document.scrollingElement.scrollTop = 0;
    props.history.push('/student/workspace');

  }
  if(auth().currentUser) {
    return <Fragment>
      <div className="StudentWorkspace">
        <div className="swsSection">
          {pCoursesBox && pCoursesBox.map(eCourse=>{
            return <div className="swsSectionCourse" key={eCourse && eCourse._id}
              style={{backgroundImage: `url(${eCourse && eCourse.image})`}}>
              <div className="swsSectionCourse1">
                <h3>{eCourse && eCourse.courseName}</h3>
              </div>
              <div className="swsSectionCourse1">
                <button type="button" onClick={goDown}>
                  <i className="fas fa-egg"></i>
                </button>
              </div>
            </div>
          })}
        </div>
        <div id="swsCourseInfo">
          <button type="button"
            className="swsCancelBtn" onClick={goUp}>
            <i className="fas fa-times"></i>
          </button>
          <h2>COURSE DETAILS</h2>
          <div className="swsSection">
            <div className="swsSectionCInfo ssci1">
              <div className="swsSectionCInfoField">
                <h5>COURSE NAME</h5>
                <h3>React and Redux full course</h3>
              </div>
              <div className="swsSectionCInfoField">
                <h5>COURSE ID</h5>
                <h3>I8er4gfrg4ergr4eg</h3>
              </div>
              <div className="swsSectionCInfoField">
                <h5>JOINED AT</h5>
                <h3>12-01-1996 11:30 AM</h3>
              </div>
              <div className="swsSectionCInfoField">
                <h5>PAYMENT ID</h5>
                <h3>I8er4gfrg4ergr4eg</h3>
              </div>
            </div>
            <div className="swsSectionCInfo ssci2">
              <div className="swsSectionCInfoField">
                <h5>COURSE PROGRESS</h5>
                <div className="progressBars">
                  <div className="progressBar"
                    style={{width: '50%'}}></div>
                  <div className="progressBar">50%</div>
                </div>
              </div>
              <div className="swsSectionCInfoField">
                <h5>YOUR PROGRESS</h5>
                <div className="progressBars">
                  <div className="progressBar"
                    style={{width: '50%'}}></div>
                  <div className="progressBar">50%</div>
                </div>
              </div>
              <div className="swsSectionCInfoField">
                <h5>SUBMIT GITHUB BOX</h5>
                <textarea rows="5" placeholder="GitHub Link" />
                <button type="button">SUBMIT</button>
              </div>
            </div>
            <button type="button" className="swsMssgBtn"
              onClick={()=>cmmToggle(true)}>
              <i className="fas fa-comment-alt"></i>
            </button>
          </div>
        </div>
      </div>
      <CMM open={cmmOpen} cFunk={cmmToggle} />
    </Fragment>
  } else return <Redirect to="/signbox" />
}

function mapStateToProps(state) {
  return {
    courseArray: state.reqArrays.allCourses,
    pCourses: state.profile.courses
  }
}
function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentWorkspace);