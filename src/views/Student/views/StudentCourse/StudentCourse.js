import React, {Fragment, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { auth, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './StudentCourse.css';

function payFunc(props, cFee, cOffer) {
  if(auth().currentUser) {
    let applier = sessionStorage.getItem('roleAs');
    let applierCol = applier?(applier==='signedInAsUserAdmin'?'User-Admin':'Main-Admin'):'Students';
    if(!props.profile.username||!props.profile.image||!props.profile.mobile) {
      props.history.push('/profile');
    } else {
      let razorWay = new window.Razorpay({
        key: 'rzp_test_gKZidK34j76Nt3',
        amount: Math.round(Number(cFee)-(Number(cFee)*Number(cOffer))/100)*100,
        name: props.profile.username,
        handler: (razorRes)=>{
          Promise.all([
            firestore().collection('Courses').doc(props.match.params.c_id)
              .collection('appliedUsers').doc(auth().currentUser.uid)
              .set({ appliedOn: Date.now(),
                paymentId: razorRes.razorpay_payment_id,
                courseProgress: 0, courseSubmits: []
              }),
            firestore().collection(applierCol).doc(auth().currentUser.uid)
              .collection('appliedCourses').doc(props.match.params.c_id)
              .set({ appliedOn: Date.now(), completedOn: null,
                payment: { id: razorRes.razorpay_payment_id,
                  payed: cFee, withOffer: cOffer
                }, courseSubmits: []
              })
          ]).then(()=>window.location.href = '/student/workspace')
        }
      });
      razorWay.open();
    }
  } else props.history.push('/signbox');
}
function enrollScroll() {
  const cContainer = document.querySelector('.courseContainer1'),
        ccChildrenArray = cContainer.children;
  let scrollValue = ccChildrenArray[0].clientHeight+
    ccChildrenArray[1].clientHeight+ccChildrenArray[2].clientHeight;
  window.scrollTo(0, scrollValue+100);
}

function StudentCourse(props) {
  let [courseObj, setcourseObj] = useState({});
  useEffect(()=>{
    let cObject = props.courseArray && props.courseArray.find(co=>{
      return co.id === props.match.params.c_id
    });
    setcourseObj(cObject);
  }, [])
  return <Fragment>
    <div className="courseContainer">
      {!courseObj?<div className="courseLoading">
        <h5>LOADING ...</h5></div>:
        <div className="courseContainer1">
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
          <div className="ccDetails">
            <div className="ccDetailMiniBoxes">
              <div className="ccDetailMiniBox">
                <div className="ccDetailLabel">
                  <h5>BATCH</h5>
                  <i className="fas fa-calendar"></i>
                </div>
                <h2>{courseObj && courseObj.batch}</h2>
              </div>
              <div className="ccDetailMiniBox">
                <div className="ccDetailLabel">
                  <h5>CAPACITY</h5>
                  <i className="fas fa-users"></i>
                </div>
                <h2>{courseObj && courseObj.batchCapacity}</h2>
              </div>
            </div>
            <div className="ccDetailMiniBoxes">
              <div className="ccDetailMiniBox">
                <div className="ccDetailLabel">
                  <h5>INTERNSHIP</h5>
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h2>{courseObj && courseObj.withIntern?'Available':'Not-Available'}</h2>
              </div>
              <div className="ccDetailMiniBox">
                <div className="ccDetailLabel">
                  <h5>ESTIMATED TIME</h5>
                  <i className="fas fa-clock"></i>
                </div>
                <h2>{courseObj && courseObj.estimatedTime} Hrs</h2>
              </div>
            </div>
            <div className="ccDetailMiniBoxes">
              <div className="ccDetailMiniBox">
                <div className="ccDetailLabel">
                  <h5>TECHNOLOGIES</h5>
                  <i className="fas fa-microchip"></i>
                </div>
                <h2>{courseObj && courseObj.technologyUsed}</h2>
              </div>
            </div>
          </div>
          <div className="ccDetails">
            <div className="ccDetailLongBox"
              style={{backgroundImage: `url(${require('../../../../amar/content1.svg')})`}}>
              <div className="ccDetailLabel">
                <h5>CONTENTS</h5>
                <i className="fas fa-cubes"></i>
              </div>
              {courseObj && courseObj.courseContentBox &&
                courseObj.courseContentBox.map((eCnt, index)=>{
                  return <div className="ccDetailLongBody" key={index}>
                    <p>{eCnt.pri}</p>
                    <ul>
                      {eCnt.sec && eCnt.sec.map((eSec, index)=>{
                        return <li key={index}>{eSec}</li> 
                      })}
                    </ul>
                  </div>
                })}
            </div>
            <div className="ccDetailLongBox"
              style={{backgroundImage: `url(${require('../../../../amar/learn.svg')})`}}>
              <div className="ccDetailLabel">
                <h5>YOU'LL LEARN</h5>
                <i className="fas fa-book"></i>
              </div>
              {courseObj && courseObj.youLearnBox &&
                courseObj.youLearnBox.map((eCnt, index)=>{
                  return <div className="ccDetailLongBody" key={index}>
                    <p>{eCnt.pri}</p>
                    <ul>
                      {eCnt.sec && eCnt.sec.map((eSec, index)=>{
                        return <li key={index}>{eSec}</li> 
                      })}
                    </ul>
                  </div>
                })}
            </div>
            <div className="ccDetailLongBox"
              style={{backgroundImage: `url(${require('../../../../amar/requirements.svg')})`}}>
              <div className="ccDetailLabel">
                <h5>REQUIREMENTS</h5>
                <i className="fas fa-book-open"></i>
              </div>
              {courseObj && courseObj.preReqBox &&
                courseObj.preReqBox.map((eCnt, index)=>{
                  return <div className="ccDetailLongBody" key={index}>
                    <p>{eCnt.pri}</p>
                    <ul>
                      {eCnt.sec && eCnt.sec.map((eSec, index)=>{
                        return <li key={index}>{eSec}</li> 
                      })}
                    </ul>
                  </div>
                })}
            </div>
          </div>
          <div className="ccDetails">
            <div className="ccDetailsEnrollBox">
              <div className="ccDetailLabel">
                <h5>ENROLL IN</h5>
                <i className="fas fa-receipt"></i>
              </div>
              <div className="ccDetailsEnrollBody">
                <div className="ccDetailsEnrollText">
                  <h1>BY ENROLLING IN</h1>
                  <ul>
                    <li><i className="fas fa-check"></i>
                      <p>Here are Python’s 3 main applications.</p>
                    </li>
                    <li><i className="fas fa-check"></i>
                      <p>Here are Python’s 3 main applications.</p>
                    </li>
                  </ul>
                </div>
                <div className="ccDetailsEnrollPay">
                  <div className="ccDetailLabel">
                    <h5>ENROLL FEES</h5>
                    <i className="fas fa-rupee-sign"></i>
                  </div>
                  <div className="ccDetailsEnrollPayBody">
                    <h2>
                      <i className="fas fa-rupee-sign"></i>
                      {courseObj && (Number(courseObj.courseFee)-
                        (Number(courseObj.courseFee)*(Number(courseObj.courseOffer)/100)))}
                    </h2>
                    <div className="ccDetailsEnrollPayBody1">
                      <h3>
                        <i className="fas fa-rupee-sign"></i>
                        {courseObj && courseObj.courseFee}
                      </h3>
                      <h3>{courseObj && courseObj.courseOffer}% Off.</h3>
                    </div>
                    <button type="button"
                      onClick={()=>payFunc(props, courseObj.courseFee, courseObj.courseOffer)}
                      >ENROLL NOW</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <div className="ccUsersReviewsBox">
        <div className="ccDetailLabel">
          <h5>USERS REVIEW</h5>
          <i className="fas fa-user-astronaut"></i>
        </div>
        <div className="ccUsersReviewsBoxBody">
          <div className="ccUserReview">
            <div className="ccUserReviewHead">
              <div className="ccUserReviewImage">
                <img src={require('../../../../amar/undraw_profile_pic.svg')} alt="" />
              </div>
              <h3>4.5 <i className="fas fa-star"></i></h3>
            </div>
            <p>
              " A review is an evaluation of a publication,
              service, or company such as a movie, video
              game, musical composition, book. "
            </p>
            <h5>12-01-1966 11:30 AM</h5>
          </div>
          <div className="ccUserReview">
          </div>
          <div className="ccUserReview">
          </div>
        </div>
      </div>
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    courseArray: state.reqArrays.allCourss,
    profile: state.profile
  }
}
function mapDispatchToProps(dispatch) {
  return {
    snackbarPop: (payload)=>{dispatch({type: 'SNACK_IT', payload})}
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(StudentCourse);
