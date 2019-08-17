import React, {Fragment, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { auth, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './StudentCourse.css';

function payFunc(props, cFee, cOffer) {
  let razorWay = new window.Razorpay({
    key: 'rzp_test_gKZidK34j76Nt3',
    amount: cFee*100,
    name: 'GROW_UP',
    handler: (razorRes)=>{
      console.log(razorRes)
      Promise.all([
        firestore().collection('Courses').doc(props.match.params.c_id)
          .collection('eStudents').doc(auth().currentUser.uid)
          .set({
            joined_on: Date.now(), payment_id: razorRes.razorpay_payment_id,
            progress: 0, submit_box: []
          }),
        firestore().collection('Students').doc(auth().currentUser.uid)
          .collection('courses').doc(props.match.params.c_id)
          .set({
            completed_on: null, joined_on: Date.now(),
            payment: {
              id: razorRes.razorpay_payment_id,
              payed: cFee, with_offer: cOffer
            }
          })
      ]).then(()=>props.snackbarPop('SUCCESSFULLY ENROLLED'))
    }
  })
  razorWay.open();
} 

function StudentCourse(props) {
  let [courseObj, setcourseObj] = useState({});
  useEffect(()=>{
    let cObject = props.courseArray && props.courseArray.find(co=>{
      return co._id === props.match.params.c_id
    })
    setcourseObj(cObject)
  }, [])
  return <Fragment>
    <div className="StudentCourse">
      <div className="scSection">
        <img src={courseObj && courseObj.image}
          width="100%" alt="" />
        <div className="scs1Detail">
          <h3>{courseObj && courseObj.courseName}</h3>
          <p>{courseObj && courseObj.description}</p>
        </div>
        <button type="button" onClick={()=>{
          if(auth().currentUser) {
            if(!props.profile.username||!props.profile.image||!props.profile.mobile) {
              props.snackbarPop('Please Update Your Profile first.')
            } else payFunc(props, 100, courseObj.offer);
          } else props.history.push('/signbox');
        }}>ENROLL</button>
      </div>
      <div className="scSection">
        <h2>COURSE DETAILS</h2>
        <div className="eachCourseDetail">
          <h5>COURSE ID</h5>
          <h3>{courseObj && courseObj._id}</h3>
        </div>
        <div className="eachCourseDetail">
          <h5>CREATED BY</h5>
          <h3>{courseObj && (courseObj.createdBy && courseObj.createdBy.username)}</h3>
        </div>
        <div className="eachCourseDetail">
          <h5>STARTS FROM</h5>
          <h3>{courseObj && courseObj.startsFrom}</h3>
        </div>
        <div className="eachCourseDetailGrp">
          <div className="eachCourseDetail">
            <h5>LEVEL</h5>
            <h3>{courseObj && courseObj.level}</h3>
          </div>
          <div className="eachCourseDetail">
            <h5>PRGRAMME</h5>
            <h3>{courseObj && courseObj.programme}</h3>
          </div>
        </div>
        <div className="eachCourseDetailGrp">
          <div className="eachCourseDetail">
            <h5>COMPLETES IN</h5>
            <h3>{courseObj && courseObj.completesIn} Days</h3>
          </div>
          <div className="eachCourseDetail">
            <h5>CONTACT</h5>
            <h3>{courseObj && (courseObj.createdBy && courseObj.createdBy.contact)}</h3>
          </div>
        </div>
        <div className="eachCourseDetailGrp">
          <div className="eachCourseDetail">
            <h5>COURSE FEE</h5>
            <h3>{courseObj && courseObj.courseFee}</h3>
          </div>
          <div className="eachCourseDetail">
            <h5>OFFER</h5>
            <h3>{courseObj && courseObj.offer}</h3>
          </div>
        </div>
        <div className="eachCourseDetail">
          <h5>LOCATION</h5>
          <h3>{courseObj && courseObj.location}</h3>
        </div>
        <div className="eachCourseDetailList">
          <h5>YOU'LL LEARN</h5>
          <ul>
            {courseObj && (courseObj.youLearnBox && courseObj.youLearnBox.map((eLine, index)=>{
              return <li key={index}>
                <i className="fas fa-book"></i>
                <p>{eLine}</p>
              </li> 
            }))}
          </ul>
        </div>
        <div className="eachCourseDetailList">
          <h5>COURSE CONTENT</h5>
          <ul>
            {courseObj && (courseObj.courseContentBox && courseObj.courseContentBox.map((eLine, index)=>{
              return <li key={index}>
                <i className="fas fa-star"></i>
                <p>{eLine}</p>
              </li> 
            }))}
          </ul>
        </div>
        <div className="eachCourseDetailList">
          <h5>PRE REQUIREMENTS</h5>
          <ul>
            {courseObj && (courseObj.preReqBox && courseObj.preReqBox.map((eLine, index)=>{
              return <li key={index}>
                <i className="fas fa-check-square"></i>
                <p>{eLine}</p>
              </li> 
            }))}
          </ul>
        </div>
      </div>
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    courseArray: state.reqArrays.allCourses,
    profile: state.profile
  }
}
function mapDispatchToProps(dispatch) {
  return {
    snackbarPop: (payload)=>{dispatch({type: 'SNACK_IT', payload})}
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(StudentCourse);
