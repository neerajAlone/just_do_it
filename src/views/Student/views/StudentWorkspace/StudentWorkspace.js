import React, {Fragment, useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import { auth } from 'firebase/app';
import 'firebase/auth';

import './StudentWorkspace.css';
import CMM from './CourseMssgModal/CourseMssgModal';
import cImage from '../../../../amar/course_image.png';

function StudentWorkspace(props) {
  let [cmmOpen, setcmmOpen] = useState(false);
  
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
          <div className="swsSectionCourse"
            style={{backgroundImage: `url(${cImage})`}}>
            <div className="swsSectionCourse1">
              <h3>React and Redux full course</h3>
            </div>
            <div className="swsSectionCourse1">
              <button type="button" onClick={goDown}>
                <i className="fas fa-egg"></i>
              </button>
            </div>
          </div>
          <div className="swsSectionCourse"></div>
          <div className="swsSectionCourse"></div>
          <div className="swsSectionCourse"></div>
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

export default StudentWorkspace;