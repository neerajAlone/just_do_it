import React, {Fragment, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { auth, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './StudentCourse.css';

function payFunc(props, cFee, cOffer) {
  if(auth().currentUser) {
    if(!props.profile.username||!props.profile.image||!props.profile.mobile) {
      props.snackbarPop('Please Update Your Profile first.')
    } else {
      let razorWay = new window.Razorpay({
        key: 'rzp_test_gKZidK34j76Nt3',
        amount: Math.round(Number(cFee)-(Number(cFee)*Number(cOffer))/100)*100,
        name: 'DEVELOPERWIZARDS.COM',
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
                }, submit_box: []
              })
          ]).then(()=>window.location.href = '/student/workspace')
        }
      });
      razorWay.open();
    }
  } else props.history.push('/signbox');
}
function enrollScroll() {
  const cContainer = document.querySelector('.courseContainer'),
        ccChildrenArray = cContainer.children;
  window.scrollTo(0, ccChildrenArray[1].clientHeight+650);
}

function StudentCourse(props) {
  let [courseObj, setcourseObj] = useState({});
  useEffect(()=>{
    let cObject = props.courseArray && props.courseArray.find(co=>{
      return co._id === props.match.params.c_id
    });
    
    setcourseObj(cObject);
    if(props.profile.courses.length !== 0) {
      let payedCourseIndex = props.profile.courses.findIndex(cId=>{
        return cId === props.match.params.c_id
      })
      if(payedCourseIndex !== -1) props.history.push('/student/workspace');
    }
  }, [])
  return <Fragment>
    <div className="courseContainer">
      <div className="ccImageBox">
        <img src={courseObj && courseObj.image}
          alt={courseObj && courseObj.courseName} />
        <div className="ccImageBox1">
          <div className="ccImageBox11">
            <h5>{courseObj && courseObj.programme}</h5>
            <h1>{courseObj && courseObj.courseName}</h1>
            <p>{courseObj && courseObj.description}</p>
            <button type="button"
              onClick={enrollScroll}
              >ENROLL NOW</button>
          </div>
        </div>
      </div>
      <div className="ccDetailBox">
        <div className="ccdbMiniBoxes">
          <div className="ccdbMiniBox">
            <div className="ccdbMiniBox1">
              <div className="ccdbMiniBox1Head">
                <h5>ESTIMATED-TIME</h5>
                <i className="fas fa-clock"></i>
              </div>
              <h2>{courseObj && courseObj.estimatedTime}</h2>
              <p>On Every Saturday & Sunday(6 hrs).</p>
            </div>
          </div>
          <div className="ccdbMiniBox">
            <div className="ccdbMiniBox1">
              <div className="ccdbMiniBox1Head">
                <h5>BATCH</h5>
                <i className="fas fa-users"></i>
              </div>
              <h2>{courseObj && courseObj.batch}</h2>
              <p>Registration Ends in 4 days.</p>
            </div>
          </div>
          <div className="ccdbMiniBox">
            <div className="ccdbMiniBox1">
              <div className="ccdbMiniBox1Head">
                <h5>TECHNOLOGY USED</h5>
                <i className="fas fa-code"></i>
              </div>
              <h2>{courseObj && courseObj.technologyUsed}</h2>
            </div>
          </div>
          <div className="ccdbMiniBox">
            <div className="ccdbMiniBox1">
              <div className="ccdbMiniBox1Head">
                <h5>CONTACT</h5>
                <i className="fas fa-phone"></i>
              </div>
              <h2>{courseObj && courseObj.contact}</h2>
            </div>
          </div>
        </div>
        <div className="ccdbBigBox">
          <div className="ccdbMiniBox1">
            <div className="ccdbMiniBox1Head">
              <h5>LOCATION</h5>
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h2>{courseObj && courseObj.location}</h2>
          </div>
        </div>
        <div className="ccdbLearnBox" style={{marginTop: 20}}>
          <div className="ccdbMiniBox1">
            <div className="ccdbMiniBox1Head">
              <h5>YOU'll LEARN</h5>
              <i className="fas fa-book"></i>
            </div>
            {courseObj && courseObj.youLearnBox && 
              courseObj.youLearnBox.map((eLine, index)=>{
              return <li key={index}>
                <i className="fas fa-long-arrow-alt-right"></i>
                <p>{eLine}</p>
              </li>
            })}
          </div>
        </div>
        <div className="ccdbLearnBox" style={{marginTop: 5}}>
          <div className="ccdbMiniBox1">
            <div className="ccdbMiniBox1Head">
              <h5>COURSE CONTENT</h5>
              <i className="fas fa-book"></i>
            </div>
            {courseObj && courseObj.courseContentBox && 
              courseObj.courseContentBox.map((eLine, index)=>{
              return <li key={index}>
                <i className="fas fa-long-arrow-alt-right"></i>
                <p>{eLine}</p>
              </li>
            })}
          </div>
        </div>
        <div className="ccdbLearnBox" style={{marginTop: 5}}>
          <div className="ccdbMiniBox1">
            <div className="ccdbMiniBox1Head">
              <h5>PRE-REQUIRITES</h5>
              <i className="fas fa-book"></i>
            </div>
            {courseObj && courseObj.preReqBox && 
              courseObj.preReqBox.map((eLine, index)=>{
              return <li key={index}>
                <i className="fas fa-long-arrow-alt-right"></i>
                <p>{eLine}</p>
              </li>
            })}
          </div>
        </div>
      </div>
      <div className="ccExtraBox">
        <h3>ENROLL NOW</h3>
        <div className="enrollContainer">
          <div className="enrollBox">
            <div className="enrollBoxTitle">
              <h5>AS YOU ENROLLED IN</h5>
            </div>
            <li> <i className="fas fa-long-arrow-alt-right"></i>
              <p>
                A paragraph is a self-contained unit of a
                discourse in writing dealing with a
                particular point or idea.
              </p>
            </li>
            <li> <i className="fas fa-long-arrow-alt-right"></i>
              <p>
                A paragraph is a self-contained unit of a
                discourse in writing dealing with a
                particular point or idea.
              </p>
            </li>
          </div>
          <div className="enrollBox">
            <div className="ccdbMiniBox1Head">
              <h5>COURSE FEE</h5>
              <i className="fas fa-tag"></i>
            </div>
            <div className="ebBoxes">
              <div className="ebBox">
                <i className="fas fa-rupee-sign"></i>
                <h1>{courseObj && courseObj.offer?
                  courseObj && Math.round(Number(courseObj.courseFee)-(Number(courseObj.courseFee)*Number(courseObj.offer))/100).toString()
                  :courseObj && courseObj.courseFee}</h1>
              </div>
              {courseObj && courseObj.offer?
                <div>
                  <div className="ebBox">
                    <i className="fas fa-rupee-sign"></i>
                    <h3 style={{textDecoration: 'line-through'}}>100000</h3>
                  </div>
                  <div className="ebBox">
                    <h3 style={{marginLeft: 16, color: 'green'}}>30%Off</h3>
                  </div>
                </div>:null
              }
            </div>
            <button type="button"
              onClick={()=>payFunc(props, courseObj.courseFee, courseObj.offer)}
              >ENROLL</button>
          </div>
        </div>
      </div>
      <div className="ccExtraBox">
        <h3>REVIEWS</h3>
        <div className="ccInstructorBoxes">
          <div className="ccInstructorBox">
            <div className="ccInstructorBoxImg"></div>
            <h4>Chamkie Pandey</h4>
            <p style={{marginTop: 10}}>
              A paragraph is a self-contained unit of a discourse.
            </p>
          </div>
          <div className="ccInstructorBox"></div>
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
