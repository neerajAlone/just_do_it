import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { firestore } from 'firebase/app';
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
    courseArray: state.reqArrays.allCourses
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllCourses: (payload)=>{dispatch({type: 'RETRIEVE_ALL_COURSES', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
