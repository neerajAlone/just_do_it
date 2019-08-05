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
    firestore().collection('Courses').get()
      .then(allCourse=>{
        let emptyArray = []
        allCourse.docs.forEach(eCourse=>{
          emptyArray.push({
            _id: eCourse.id,
            ...eCourse.data()
          })
        })
        props.getAllCourses(emptyArray);
      })
  }, [])
  return <Fragment>
    <div className="studentHead">
      <h1><Link to="/student">STUDENT</Link></h1>
      <ul>
        {student?
          <li><NavLink to="/student/workspace">workSpace</NavLink></li>
          :null
        }
      </ul>
    </div>
    <div>
      <Route exact path="/student" component={lazyComponent(StudentHome)} />
      <Route path="/student/workspace" component={lazyComponent(StudentWorkspace)} />
      <Route path="/student/course/:c_id" component={lazyComponent(StudentCourse)} />
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    courseArray: state.aUserAdmins.allCourses
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllCourses: (payload)=>{dispatch({type: 'RETRIEVE_ALL_COURSES', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Student);