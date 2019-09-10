import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { firestore, auth } from 'firebase/app';
import 'firebase/firestore';

import UserAdmin from './UserAdmin/UserAdmin';
import MainAdmin from './MainAdmin/MainAdmin';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAdmin: false,
      mainAdmin: false,
    }
  }

  componentWillMount() {
    let ssRole = sessionStorage.getItem('roleAs');
    if(ssRole === 'signedInAsMainAdmin') this.setState({mainAdmin: true});
    else if(ssRole === 'signedInAsUserAdmin') this.setState({userAdmin: true});
  }
  componentDidMount() {
    let ssRole = sessionStorage.getItem('roleAs');
    if(this.props.courseArray.length === 0) {
      firestore().collection('Courses').get()
        .then(allCourse=>{
          let emptyArray = []
          allCourse.docs.forEach(eCourse=>{
            emptyArray.push({
              _id: eCourse.id,
              ...eCourse.data()
            })
          })
          this.props.getAllCourses(emptyArray);
        })
    }
    if(ssRole === 'signedInAsUserAdmin') {
      if(this.props.profileCourses.length === 0) {
        firestore().collection('User-Admin').doc(auth().currentUser.uid)
          .collection('courses').get()
          .then(cArray=>{
            if(!cArray.empty) {let helpArray = [];
              cArray.docs.forEach(doc=>{helpArray.push({_id: doc.id, ...doc.data()})});
              this.props.addProfileCourses(helpArray);
            }
          })
      }
      if(this.props.adminMssgBox.length === 0) {
        firestore().collection('User-Admin').doc(auth().currentUser.uid)
          .collection('conversations').onSnapshot(mArray=>{
            if(!mArray.empty) {let helpArray = [];
              mArray.docs.forEach(doc=>{helpArray.push({time: doc.id, ...doc.data()})});
              this.props.getAllAdminMssg(helpArray);
            }
          })
          
      }
      if(this.props.adminSubmitsBox.length === 0) {
        firestore().collection('User-Admin').doc(auth().currentUser.uid)
          .collection('submits').get()
          .then(sArray=>{
            if(!sArray.empty) {let helpArray = [];
              sArray.docs.forEach(doc=>{helpArray.push({_id: doc.id, ...doc.data()})});
              this.props.getAllAdminSubmits(helpArray);
            }
          })
      }
    }
  }
  render() {
    const {userAdmin, mainAdmin} = this.state;
    if(userAdmin) return <UserAdmin />
    else if (mainAdmin) return <MainAdmin />
    else return <Redirect to="/signbox" />
  }
}

function mapStateToProps(state) {
  return {
    courseArray: state.reqArrays.allCourses,
    profileCourses: state.profile.courses,
    adminMssgBox: state.reqArrays.adminMssgBox,
    adminSubmitsBox: state.reqArrays.adminSubmitsBox,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllCourses: (payload)=>{dispatch({type: 'RETRIEVE_ALL_COURSES', payload})},
    addProfileCourses: (payload)=>{dispatch({type: 'ADD_PROFILE_COURSES', payload})},
    getAllAdminMssg: (payload)=>{dispatch({type: 'ADMIN_MSSG_BOX', payload})},
    getAllAdminSubmits: (payload)=>{dispatch({type: 'ADMIN_SUBMITS_BOX', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
