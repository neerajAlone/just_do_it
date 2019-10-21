import React, {Fragment, useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './StudentWorkspace.css';
import CMM from './CourseMssgModal/CourseMssgModal';

function goDown(props, cId) {
  firestore().collection('Courses').doc(cId).get()
    .then(res=>{
      Promise.all([
        firestore().collection('Courses').doc(cId).collection('eStudents')
          .doc(auth().currentUser.uid).get().then(res2=>{
            props.addWorkpaceCourseObject({
              course_id: res.id,
              course_name: res.data().courseName,
              course_progress: res.data().progress,
              projects: res.data().projects,
              course_useradmin_uid: res.data().createdBy,
              joined_on: res2.data().joined_on,
              student_progress: res2.data().progress,
              payment_id: res2.data().payment_id
            })
          }),
        firestore().collection('Students').doc(auth().currentUser.uid)
          .collection('courses').doc(cId).collection('submits')
          .get().then(res2=>{
            let sArray = [];
            res2.docs.forEach(eSubmit=>{
              sArray.push({id: eSubmit.id, ...eSubmit.data()})
            })
            props.addStudentSubmits({name: res.data().courseName, sArray});
          })
      ]).then(()=>{
        window.scrollTo(0,(document.querySelector('.swsSection').clientHeight+100));
      })
    })
}
function goUp(props) {
  props.removeWorkpaceCourseObject();
  props.removeStudentSubmits();
  window.scrollTo(0, 0);
}
function submitGitLink(value1, value2, setValue1, setValue2, props) {
  firestore().collection(`/User-Admin/${props.eachWorkspaceObject.course_useradmin_uid}/submits`)
    .add({
      course_name: props.eachWorkspaceObject.course_name,
      course_id: props.eachWorkspaceObject.course_id,
      git_link: value1, host_link: value2,
      image: auth().currentUser.photoURL,
      uid: auth().currentUser.uid,
      username: auth().currentUser.displayName,
      time: Date.now().toString(),
    }).then(res=>res.get()).then(res=>{
      return firestore().collection(`/Students/${auth().currentUser.uid}/courses/${props.eachWorkspaceObject.course_id}/submits`)
        .doc(res.id).set({
          course_name: res.data().course_name, status: null,
          git_link: res.data().git_link, host_link: res.data().host_link,
          time: res.data().time,
        })
    }).then(()=>{setValue1(''); setValue2('');
      props.snackbar('SUCCESSFULLY SUBMITED');
      goUp(props);
    }).catch(err=>props.snackbar(err.message))
}

function StudentWorkspace(props) {
  let [cmmOpen, setcmmOpen] = useState(false);
  let [pCoursesBox, setpCoursesBox] = useState([]);
  let [inputLink1, setinputLink1] = useState('');
  let [inputLink2, setinputLink2] = useState('');
  let repoName = 'https://github.com/neerajAlone/fucker.git';
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
  function cmmToggle(openStatus) {setcmmOpen(openStatus)}

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
                <button type="button" onClick={()=>goDown(props, eCourse._id)}>
                  <i className="fas fa-egg"></i>
                </button>
              </div>
            </div>
          })}
        </div>
        {props.eachWorkspaceObject?
          <div className="swsCourseInfo">
            <button type="button"
              className="swsCancelBtn" onClick={()=>goUp(props)}>
              <i className="fas fa-times"></i>
            </button>
            <h2>COURSE DETAILS</h2>
            <div className="swsSection">
              <div className="swsSectionCInfo ssci1">
                <div className="swsSectionCInfoField">
                  <h5>COURSE NAME</h5>
                  <h3>{props.eachWorkspaceObject.course_name}</h3>
                </div>
                <div className="swsSectionCInfoField">
                  <h5>COURSE ID</h5>
                  <h3>{props.eachWorkspaceObject.course_id}</h3>
                </div>
                <div className="swsSectionCInfoField">
                  <h5>JOINED AT</h5>
                  <h3>{props.eachWorkspaceObject.joined_on}</h3>
                </div>
                <div className="swsSectionCInfoField">
                  <h5>PAYMENT ID</h5>
                  <h3>{props.eachWorkspaceObject.payment_id}</h3>
                </div>
              </div>
              <div className="swsSectionCInfo ssci2">
                <div className="swsSectionCInfoField">
                  <h5>COURSE PROGRESS</h5>
                  <div className="progressBars">
                    <div className="progressBar"
                      style={{width: `${(props.eachWorkspaceObject.course_progress/props.eachWorkspaceObject.projects)*100}%`}}></div>
                    <div className="progressBar">{`${(props.eachWorkspaceObject.course_progress/props.eachWorkspaceObject.projects)*100}%`}</div>
                  </div>
                </div>
                <div className="swsSectionCInfoField">
                  <h5>YOUR PROGRESS</h5>
                  <div className="progressBars">
                    <div className="progressBar"
                      style={{width: `${(props.eachWorkspaceObject.student_progress/props.eachWorkspaceObject.projects)*100}%`}}></div>
                    <div className="progressBar">{`${(props.eachWorkspaceObject.student_progress/props.eachWorkspaceObject.projects)*100}%`}</div>
                  </div>
                </div>
                <div className="swsSectionCInfoField">
                  <h5>SUBMIT LINKS</h5>
                  <input type="text" placeholder="GITHUB LINK" value={inputLink1}
                    onChange={e=>setinputLink1(e.target.value)} />
                  <input type="text" placeholder="HOSTED LINK" value={inputLink2}
                    onChange={e=>setinputLink2(e.target.value)} />
                  <button type="button"
                    onClick={()=>submitGitLink(inputLink1, inputLink2, setinputLink1, setinputLink2, props)}
                    >SUBMIT</button>
                </div>
              </div>
              <button type="button" className="swsMssgBtn"
                onClick={()=>cmmToggle(true)}>
                <i className="fas fa-comment-alt"></i>
              </button>
            </div>
            <CMM open={cmmOpen} cFunk={cmmToggle}
              c_name={props.eachWorkspaceObject.course_name}
              c_id={props.eachWorkspaceObject.course_id}
              ua_id={props.eachWorkspaceObject.course_useradmin_uid} />
          </div>:
          <div className="swsCourseInfo">
            <h2>NO COURSE SELECTED</h2>
          </div>
        }
        <div className="ruleForGitSubmit">
          <i className="fas fa-question-circle"></i>
          <h5>GITHUB REPOSITORY SHOULD BE NAMED AS <b>PROJECTNAME-SERIAL NO.</b></h5>
        </div>
        <div className="ruleForGitSubmit">
          <i className="fas fa-question-circle"></i>
          <h5>SUCCESSFUL RE-SUBMIT WILL <b>REPLACE RESPECTIVE SUBMIT WITH NEW SUBMIT.</b></h5>
        </div>
        {props.submitArray?
          <div className="swsSubmitContainer">
            <div>
              <h3>Submits of</h3>
              <h3>{props.submitArray.name}</h3>
            </div>
            <div className="swsSubmitBoxes">
              {props.submitArray.sArray && props.submitArray.sArray.map((eSubmit, index)=>{
                  return <div className="swsSubmitBox" key={index}>
                    <div className="swsSubmitBox1">
                      <h6>GITHUB REPOSITORY</h6>
                      <div className="swsSubmitBox2">
                        <h5>{eSubmit.git_link.split('/')[eSubmit.git_link.split('/').length-1]}</h5>
                      </div>
                    </div>
                    <div className="swsSubmitBox1">
                      <h6>SUBMITTED ON</h6>
                      <div className="swsSubmitBox2">
                        <h5>{eSubmit.time}</h5>
                      </div>
                    </div>
                    <div className="swsSubmitBox1">
                      <h6>SUBMIT STATUS</h6>
                      <div className="swsSubmitBox2">
                        <h5>{eSubmit.status===null?'Not Checked Yet':eSubmit.status?'Submitted':'Try Again'}</h5>
                      </div>
                    </div>
                    <button type="button" disabled={eSubmit.status===false?false:true}>RE-SUBMIT</button>
                  </div>
                })}
            </div>
          </div>:null}
      </div>
    </Fragment>
  } else return <Redirect to="/signbox" />
}

function mapStateToProps(state) {
  return {
    courseArray: state.reqArrays.allCourses,
    submitArray: state.reqArrays.studentSubmitsBox,
    pCourses: state.profile.courses,
    eachWorkspaceObject: state.reqObjects.eachWorkspaceCourseObject,
    studentSubmitsBox: state.reqArrays.studentSubmitsBox,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    addWorkpaceCourseObject: (payload)=>{dispatch({type: 'ADD_EACH_WORKSPACE_COURSE_OBJECT', payload})},
    removeWorkpaceCourseObject: ()=>{dispatch({type: 'REMOVE_EACH_WORKSPACE_COURSE_OBJECT'})},
    snackbar: (payload)=>{dispatch({type: 'SNACK_IT', payload})},
    addStudentSubmits: (payload)=>{dispatch({type: 'RETRIEVE_ALL_STUDENT_SUBMITS', payload})},
    removeStudentSubmits: ()=>{dispatch({type: 'REMOVE_ALL_STUDENT_SUBMITS'})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentWorkspace);