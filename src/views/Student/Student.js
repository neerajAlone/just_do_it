import React, {Fragment, lazy, Suspense, useEffect, useState} from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './Student.css';
import Loading from '../../components/Loading/Loading';
const StudentHome = lazy(()=>import('./views/StudentHome/StudentHome'));
const StudentWorkspace = lazy(()=>import('./views/StudentWorkspace/StudentWorkspace'));
const StudentCourse = lazy(()=>import('./views/StudentCourse/StudentCourse'));

function lazyComponent(Component) {
  return props=> <Suspense fallback={<Loading load={true} />}>
    <Component {...props} />
  </Suspense>
}

function Student(props) {
  let [student, setstudent] = useState(false);
  useEffect(()=>{
    if(auth().currentUser) setstudent(true);
    if(props.allCourss.length === 0||props.allTrimmedCourss.length === 0) {
      firestore().collection('Courses').get()
        .then(res=>{ let cArray = [], rcArray = [];
          res.docs.forEach(doc=>{
            cArray.push({id: doc.id, ...doc.data()});
          });
          props.getAllCourss(cArray);
          cArray && cArray.forEach(course=>{
            let eachCourseObject = {};
            eachCourseObject.id = course.id;
            eachCourseObject.image = course.image;
            eachCourseObject.courseOffer = course.courseOffer;
            eachCourseObject.courseName = course.courseName;
            eachCourseObject.status = course.status;
            eachCourseObject.cName = course.cName;
            eachCourseObject.cImage = course.cImage;
            eachCourseObject.cUid = course.cUid;
            eachCourseObject.createdOn = course.createdOn;
            rcArray.push(eachCourseObject);
          })
          props.getAllTrimmedCourss(rcArray);
        })
    }

  }, [])
  return <Fragment>
    <div className="studentHead">
      <h1><Link to="/courses">COURSES</Link></h1>
      <ul>
        {student?
          <li><NavLink to="/courses/workspace">workSpace</NavLink></li>
          :null
        }
      </ul>
    </div>
    <div>
      <Route exact path="/courses" component={lazyComponent(StudentHome)} />
      <Route path="/courses/workspace" component={lazyComponent(StudentWorkspace)} />
      <Route path="/courses/course/:c_id" component={lazyComponent(StudentCourse)} />
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    allCourss: state.reqArrays.allCourss,
    allTrimmedCourss: state.reqArrays.allTrimmedCourss,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllCourss: payload=>{dispatch({type: 'RETRIEVE_ALL_COURSS', payload})},
    getAllTrimmedCourss: payload=>{dispatch({type: 'RETRIEVE_ALL_TRIMMED_COURSS', payload})},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Student);