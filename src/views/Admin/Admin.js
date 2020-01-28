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
    // if(this.props.courseArray.length === 0) {
    //   firestore().collection('Courses').get()
    //     .then(allCourse=>{
    //       let emptyArray = []
    //       allCourse.docs.forEach(eCourse=>{
    //         emptyArray.push({
    //           _id: eCourse.id,
    //           ...eCourse.data()
    //         })
    //       })
    //       this.props.getAllCourses(emptyArray);
    //     })
    // }
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
    if(this.props.allBlogs.length === 0||this.props.allTrimmedBlogs.length === 0) {
      firestore().collection('Blogs').get()
        .then(res=>{ let bArray = [], rbArray = [];
          res.docs.forEach(doc=>{
            bArray.push({id: doc.id, ...doc.data()});
          });
          this.props.getAllBlogs(bArray);
          bArray && bArray.forEach(blog=>{
            let eachBlogObject = {};
            eachBlogObject.id = blog.id;
            eachBlogObject.cUid = blog.cUid;
            eachBlogObject.cImage = blog.cImage;
            eachBlogObject.cName = blog.cName;
            eachBlogObject.createdOn = blog.createdOn;
            eachBlogObject.title = blog.bTitle;
            eachBlogObject.subTitle = blog.bSubTitle;
            eachBlogObject.views = blog.views;
            eachBlogObject.heart = blog.fav_users && blog.fav_users.length;
            eachBlogObject.status = blog.status;
            eachBlogObject.image = blog.blogExtraContents
              .find(bi=>bi.type === 'image');
            rbArray.push(eachBlogObject);
          })
          this.props.getAllTrimmedBlogs(rbArray);
        })
    }
    if(this.props.allCourss.length === 0||this.props.allTrimmedCourss.length === 0) {
      firestore().collection('Courses').get()
        .then(res=>{ let cArray = [], rcArray = [];
          res.docs.forEach(doc=>{
            cArray.push({id: doc.id, ...doc.data()});
          });
          this.props.getAllCourss(cArray);
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
          this.props.getAllTrimmedCourss(rcArray);
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
    courseArray: state.reqArrays.allCourses,
    profileCourses: state.profile.courses,
    adminMssgBox: state.reqArrays.adminMssgBox,
    adminSubmitsBox: state.reqArrays.adminSubmitsBox,
    allBlogs: state.reqArrays.allBlogs,
    allTrimmedBlogs: state.reqArrays.allTrimmedBlogs,
    allCourss: state.reqArrays.allCourss,
    allTrimmedCourss: state.reqArrays.allTrimmedCourss,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllCourses: (payload)=>{dispatch({type: 'RETRIEVE_ALL_COURSES', payload})},
    addProfileCourses: (payload)=>{dispatch({type: 'ADD_PROFILE_COURSES', payload})},
    getAllAdminMssg: (payload)=>{dispatch({type: 'ADMIN_MSSG_BOX', payload})},
    getAllAdminSubmits: (payload)=>{dispatch({type: 'ADMIN_SUBMITS_BOX', payload})},
    getAllBlogs: payload=>{dispatch({type: 'RETRIEVE_ALL_BLOGS', payload})},
    getAllTrimmedBlogs: payload=>{dispatch({type: 'RETRIEVE_ALL_TRIMMED_BLOGS', payload})},
    getAllCourss: payload=>{dispatch({type: 'RETRIEVE_ALL_COURSS', payload})},
    getAllTrimmedCourss: payload=>{dispatch({type: 'RETRIEVE_ALL_TRIMMED_COURSS', payload})},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
