import React, {Fragment, Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth, firestore } from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

import './StudentWorkspace.css';

class StudentWorkspace extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  thisCourse =(cId)=> {
    
  }

  componentWillMount() {
    if(this.props.appliedCourses.length === 0) {
      let applier = sessionStorage.getItem('roleAs');
      let applierCol = applier?(applier==='signedInAsUserAdmin'?'User-Admin':'Main-Admin'):'Students';
      firestore().collection(applierCol).doc(auth().currentUser.uid)
        .collection('appliedCourses').get()
        .then(rese=>{ let erArray = [];
          rese.docs.forEach(doc=>erArray.push({id: doc.id, ...doc.data()}));
          this.props.getAppliedCourses(erArray);
        })
    }
  }
  render() {
    if(auth().currentUser) {
      const { appliedCourses, ewscObj } = this.props;
      return <Fragment>
        <div className="swAppliedCourseContainer">
          <h2>APPLIED COURSES</h2>
          <div className="swAppliedCourses">   
          {appliedCourses && appliedCourses.map((eAC, index)=>{
            return <div className="swAppliedCourse" key={index}
              style={{backgroundImage: `url(${eAC.courseInfo && eAC.courseInfo.image})`}}
              title={eAC.courseInfo && eAC.courseInfo.name}
              onClick={()=>this.thisCourse(eAC.id)}></div>
          })}
          </div>
        </div>
        <div className="swEachCourseBox">
          <hr />
          {!ewscObj?
            <div className="swEachCourse">
              <div className="swEachCourse_id">
                <h4>Y0P5voWQrYlgijOsEwdj</h4>
              </div>
              <h2>Learn Python Programming Masterclass</h2>
              <div className="swEachCourse_id">
                <h4>Y0P5voWQrYlgijOsEwdj</h4>
              </div>
            </div>:
            <div className="swEachCourse">
              <h2>Select Course By Clicking OnIt</h2>
            </div>}
        </div>
      </Fragment>
    } else return <Redirect to="/signbox" />
  }
}

function mapStateToProps(state) {
  return {
    appliedCourses: state.profile.courses,
    ewscObj: state.reqObjects.eachWorkspaceCourseObject,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAppliedCourses: payload=>{dispatch({type: 'ADD_PROFILE_COURSES', payload})},
    setEwscObj: payload=>{dispatch({type: 'ADD_EACH_WORKSPACE_COURSE_OBJECT', payload})},
    unSetEwscObj: payload=>{dispatch({type: 'REMOVE_EACH_WORKSPACE_COURSE_OBJECT', payload})},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentWorkspace);