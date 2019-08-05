import React, {Fragment, Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { functions, firestore, storage, auth } from 'firebase/app';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import './Admin.css';
import defaultImage from '../../amar/course_image.png';
import exImage from '../../amar/react1.png';
import userImg from '../../amar/undraw_profile_pic.svg';
import AdminModal from './AdminModal/AdminModal';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageState: false,
      imageFile: null,
      uploadState: false,
      showModal: false,
      modalIndex: 0,
      userAdmin: false,
      mainAdmin: false,

      completesIn: '',//done
      courseContent: '',//done
      courseContentBox: [],
      createdBy: '',
      createdOn: '',
      courseFee: '',//done
      description: '',//done
      image: '',//done
      level: '',//done
      location: '',//done
      courseName: '',//done
      offer: '',//done
      preReq: '',//done
      preReqBox: [],
      programme: '',//done
      startsFrom: '',//done
      youLearn: '',//done
      youLearnBox: [],

      maEmail: '',
      maPassword: '',
      maRePassword: ''
    }
  }

  inputChanged =e=> {
    this.setState({[e.target.name]: e.target.value});
  }
  imageChanged =e=> {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload =()=> {
      this.setState({image: reader.result})
    }
    this.setState({imageFile: e.target.files[0]})
  }
  uploadImageToServer =()=> {
    const { image, imageFile } = this.state;
    if(image && imageFile) {
      storage().refFromURL(`gs://developer-wizard.appspot.com/courses/${imageFile.name}`)
        .put(imageFile).on('state_changed',
          null, null,
          ()=>{
            storage().refFromURL(`gs://developer-wizard.appspot.com/courses/${imageFile.name}`)
              .getDownloadURL().then(url=>this.setState({
                image: url, imageState: false, uploadState: true}))
          })
    } else console.log('IMAGE OR IMAGEFILE IS MISSING !');
  }
  addDetailInArray =(stateProp)=> {
    const { courseContent, preReq, youLearn } = this.state;
    switch(stateProp) {
      case 1:
        this.setState(preState=>{
          preState.courseContentBox.push(courseContent);
          return {
            courseContentBox: [...preState.courseContentBox],
            courseContent: ''
          }
        });
        break;
      case 2:
        this.setState(preState=>{
          preState.youLearnBox.push(youLearn);
          return {
            youLearnBox: [...preState.youLearnBox],
            youLearn: ''
          }
        });
        break;
      case 3:
        this.setState(preState=>{
          preState.preReqBox.push(preReq);
          return {
            preReqBox: [...preState.preReqBox],
            preReq: ''
          }
        });
        break;
      default:
        return null;
    }
  }
  addCourse =()=> {
    const {
      courseName, image, description, courseFee,
      offer, level, programme, startsFrom, completesIn,
      courseContentBox, youLearnBox, preReqBox, location
    } = this.state;
    if(
      courseName.length<7 || description.split(' ').length < 10 ||
      !courseFee.match(/(\d){3,6}/i) || !offer.match(/(\d){1,2}/i) ||
      !level.toLowerCase().match(/(beginner|intermediate|advanced)/i) ||
      !programme.toLowerCase().match(/(internship|workshop)/i) ||
      !completesIn.match(/(\d){1,2}/i) || location.split(' ').length<2 ||
      !startsFrom.match(/^((\d){2}\-(\d){2}\-(\d){4} (\d){2}\:(\d){2} (AM|PM))$/i) ||
      courseContentBox.length<4 || youLearnBox.length<4 || preReqBox.length<4
    ) {
      this.toggleModal(true, 2)
    } else {
      firestore().collection('Courses').add({
        completesIn, courseContentBox, createdOn: Date.now(), description, courseFee,
        createdBy: {_id: auth().currentUser.uid, username: auth().currentUser.displayName},
        image, level, location, courseName, offer, preReqBox, programme, startsFrom, youLearnBox
      }).then(()=>this.setState({
        courseName: '', image: '', description: '', courseFee: '',
        offer: '', level: '', programme: '', startsFrom: '',
        completesIn: '', courseContentBox: [], youLearnBox: [],
        preReqBox: [], location: ''
      }))
    }
  }
  createAdmin =()=> {
    const { maEmail, maPassword, maRePassword } = this.state;
    if(
      maEmail===''||maPassword===''||
      maRePassword===''||maPassword!==maRePassword) {
      console.log('Fields are INVALID')
    } else {
      // user-admin added through FCFs
      functions().httpsCallable('settingClaimsForUserAdmin')({email: maEmail, password: maPassword})
        .then(goe=>{
          if(goe) {
            this.setState({maEmail: '', maPassword: '', maRePassword: ''})
          } else console.log('SOMETHING ERR WHILE CREATING USER-ADMIN !')
        })
    } 
  }
  removeAdmin =(uid)=> {
    functions().httpsCallable('removeUserAdmin')({uid})
      .then(({data})=>{
        if(!data) console.log('SOMTHING NOT HAPPERN')
      })
  }
  // MODAL
  toggleModal =(showModal, modalIndex)=> {
    this.setState({showModal, modalIndex});
  }

  componentWillMount() {
    let ssRole = sessionStorage.getItem('roleAs');
    if(ssRole === 'signedInAsMainAdmin') {
      this.setState({mainAdmin: true});
      firestore().collection('User-Admin')
        .onSnapshot(snapShot=>{
          let emptyArray = [];
          snapShot.docs.forEach(eUserAdmin=>{
            emptyArray.push({
              _id: eUserAdmin.id,
              email: eUserAdmin.data().email,
              username: eUserAdmin.data().username,
              mobile: eUserAdmin.data().mobile,
              available: eUserAdmin.data().available
            })
          })
          this.props.getAllUserAdmins(emptyArray)
        })
    }
    else if(ssRole === 'signedInAsUserAdmin') this.setState({userAdmin: true});

    onbeforeunload =()=> {
      if(this.state.uploadState) {
        storage().refFromURL(`gs://developer-wizard.appspot.com/courses/${this.state.imageFile.name}`)
          .delete()
      } 
    }

  }
  render() {
    const { 
      imageState, image, showModal, modalIndex,
      courseName, description, courseFee, offer, level,
      programme, startsFrom, completesIn,
      courseContent, courseContentBox, preReq,
      preReqBox, youLearn, youLearnBox, location,
      maEmail, maPassword, maRePassword,
      userAdmin, mainAdmin, uploadState
    } = this.state;
    const { userAdminArray } = this.props;
    if(userAdmin) {
      return <Fragment>
        <div className="parentGrid">
          <div className="childGrid1"></div>
          <div className="childGrid2">
            <div className="addCourse">
              <div className="addCourseField">
                <h5>COURSE NAME</h5>
                <input type="text" placeholder="COURSE NAME"
                  name="courseName" value={courseName} autoComplete="off"
                  onChange={this.inputChanged} />
              </div>
              <div className="addCourseField">
                <h5>COURSE IMAGE</h5>
                <div className="imgUploadBox">
                  <div className="imgUploadBox1">
                    <img src={image?image:defaultImage} alt=""
                      style={{cursor: uploadState?'unset':'pointer'}}
                      onClick={uploadState?null:()=>this.setState({imageState: true})} />
                  </div>
                  <div className="imgUploadBox1"
                    style={{display: imageState?'flex':'none'}}>
                    <div>
                      <button type="button" style={{backgroundColor: '#0F9D58',opacity: image?0.6:1}}
                        onClick={()=>{this.inputTag.click();
                        }} disabled={image?true:false}><i className="fas fa-plus"></i>
                      </button>
                      <button type="button" style={{backgroundColor: '#DB4437'}}
                        onClick={()=>{
                          this.setState({
                            imageState: false, image: '',
                            imageFile: null
                          });
                          this.inputTag.value = '';
                        }}><i className="fas fa-times"></i>
                      </button>
                      <button type="button" disabled={!image?true:false}
                        style={{backgroundColor: '#4285F4',
                        paddingBottom: 2,opacity: !image?0.6:1}}
                        onClick={this.uploadImageToServer}>
                        <i className="fas fa-cloud-upload-alt"></i>
                      </button>
                    </div>
                  </div>
                  <input type="file" ref={r=>{this.inputTag=r}}
                    style={{display: 'none'}} onChange={this.imageChanged} />
                </div>
              </div>
              <div className="addCourseField">
                <h5>DESCRIPTION</h5>
                <textarea name="description" rows="2"
                  placeholder="DESCRIPTION" value={description}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <div className="addCourseFieldGroup">
                <div className="addCourseField">
                  <h5>COURSE FEE</h5>
                  <input type="text" placeholder="COURSE FEE"
                    name="courseFee" value={courseFee}
                    onChange={this.inputChanged} autoComplete="off" />
                </div>
                <div className="addCourseField">
                  <h5>ANY OFFER</h5>
                  <input type="text" placeholder="OFFER"
                    name="offer" value={offer}
                    onChange={this.inputChanged} autoComplete="off" />
                </div>
              </div>
              <div className="addCourseFieldGroup">
                <div className="addCourseField">
                  <h5>LEVEL</h5>
                  <input type="text" placeholder="LEVEL"
                    name="level" value={level} autoComplete="off"
                    onChange={this.inputChanged} />
                </div>
                <div className="addCourseField">
                  <h5>COMPLETES IN</h5>
                  <input type="text" placeholder="COMPLETES IN"
                    name="completesIn" value={completesIn}
                    onChange={this.inputChanged} autoComplete="off" />
                </div>
              </div>
              <div className="addCourseField">
                <h5>PROGRAMME</h5>
                <input type="text" placeholder="PROGRAMME"
                  name="programme" value={programme}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <div className="addCourseField">
                <h5>STARTS FROM</h5>
                <input type="text" placeholder="STARTS FROM"
                  name="startsFrom" value={startsFrom}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <div className="addCourseField">
                <div className="fieldLabelGroup">
                  <h5>COURSE CONTENTS</h5>
                  <button type="button"
                    onClick={()=>this.addDetailInArray(1)}
                    >ADD</button>
                </div>
                <textarea name="courseContent" rows="2"
                  placeholder="COURSE CONTENT" value={courseContent}
                  onChange={this.inputChanged} autoComplete="off" />
                <ul>
                  {courseContentBox && courseContentBox.map((eachProp, index)=>{
                    return <li key={index}><b>#</b> {eachProp}</li>
                  })}
                </ul>
              </div>
              <div className="addCourseField">
                <div className="fieldLabelGroup">
                  <h5>YOU LEARN</h5>
                  <button type="button"
                    onClick={()=>this.addDetailInArray(2)}
                    >ADD</button>
                </div>
                <textarea name="youLearn" rows="2"
                  placeholder="YOU LEARN" value={youLearn}
                  onChange={this.inputChanged} autoComplete="off" />
                <ul>
                  {youLearnBox && youLearnBox.map((eachProp, index)=>{
                    return <li key={index}><b>#</b> {eachProp}</li>
                  })}
                </ul>
              </div>
              <div className="addCourseField">
                <div className="fieldLabelGroup">
                  <h5>PRE REQUIREMENT</h5>
                  <button type="button"
                    onClick={()=>this.addDetailInArray(3)}
                    >ADD</button>
                </div>
                <textarea name="preReq" rows="2"
                  placeholder="PRE REQUIREMENT" value={preReq}
                  onChange={this.inputChanged} autoComplete="off" />
                <ul>
                  {preReqBox && preReqBox.map((eachProp, index)=>{
                    return <li key={index}><b>#</b> {eachProp}</li>
                  })}
                </ul>
              </div>
              <div className="addCourseField">
                <h5>LOCATION</h5>
                <input type="text" placeholder="LOCATION"
                  name="location" value={location}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <div className="addCourseField">
                <button type="button" className="courseSBtn"
                  onClick={this.addCourse} >ADD COURSE</button>
              </div>
            </div>
          </div>
          <div className="childGrid3">
            <img src={require('../../amar/orangeLogo.png')} alt="" />
          </div>
          <div className="childGrid4">
            <div className="adminCourseBoxes">
              <div className="adminCourseBox"
                style={{backgroundImage: `url(${exImage})`}}>
                <div className="adminCourseBox1">
                  <div className="acb1Div"></div>
                  <div className="acb1Div">
                    <button type="button"
                      onClick={()=>this.toggleModal(true, 4)}>
                      <i className="fas fa-egg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="childGrid5">
            <h2>STUDENTS MSSG 4 U</h2>
            <div className="adminMssgsBox">
              <div className="adminMssgBox">
                <div className="adminMssgBoxHead">
                  <img src={require('../../amar/pic14.png')} alt="" />
                  <div>
                    <div className="hFiveDiv">
                      <h5>StudentName</h5><h5>12-Jan-1996 11:30</h5>
                    </div>
                    <div className="hFiveDiv">
                      <h5>CourseName</h5>
                    </div>
                  </div>
                </div>
                <div className="adminMssgBoxBody">
                  <p>A student is primarily a person enrolled in a school or other educational </p>
                </div>
                <div className="adminMssgBoxFoot">
                  <button type="button"
                    onClick={()=>this.toggleModal(true, 5)}
                    >REPLY</button>
                </div>
              </div>
              <div className="adminMssgBox">
                <div className="adminMssgBoxHead">
                  <img src={require('../../amar/pic14.png')} alt="" />
                  <div>
                    <div className="hFiveDiv">
                      <h5>StudentName</h5><h5>12-Jan-1996 11:30</h5>
                    </div>
                    <div className="hFiveDiv">
                      <h5>CourseName</h5>
                    </div>
                  </div>
                </div>
                <div className="adminMssgBoxBody">
                  <p>A student is primarily a person enrolled in a school or other educational </p>
                </div>
                <div className="adminMssgBoxFoot">
                  <button type="button">REPLY</button>
                </div>
              </div>
              <div className="adminMssgBox">
                <div className="adminMssgBoxHead">
                  <img src={require('../../amar/pic14.png')} alt="" />
                  <div>
                    <div className="hFiveDiv">
                      <h5>StudentName</h5><h5>12-Jan-1996 11:30</h5>
                    </div>
                    <div className="hFiveDiv">
                      <h5>CourseName</h5>
                    </div>
                  </div>
                </div>
                <div className="adminMssgBoxBody">
                  <p>A student is primarily a person enrolled in a school or other educational </p>
                </div>
                <div className="adminMssgBoxFoot">
                  <button type="button">REPLY</button>
                </div>
              </div>
              <div className="adminMssgBox">
                <div className="adminMssgBoxHead">
                  <img src={require('../../amar/pic14.png')} alt="" />
                  <div>
                    <div className="hFiveDiv">
                      <h5>StudentName</h5><h5>12-Jan-1996 11:30</h5>
                    </div>
                    <div className="hFiveDiv">
                      <h5>CourseName</h5>
                    </div>
                  </div>
                </div>
                <div className="adminMssgBoxBody">
                  <p>A student is primarily a person enrolled in a school or other educational </p>
                </div>
                <div className="adminMssgBoxFoot">
                  <button type="button">REPLY</button>
                </div>
              </div>
              <div className="adminMssgBox">
                <div className="adminMssgBoxHead">
                  <img src={require('../../amar/pic14.png')} alt="" />
                  <div>
                    <div className="hFiveDiv">
                      <h5>StudentName</h5><h5>12-Jan-1996 11:30</h5>
                    </div>
                    <div className="hFiveDiv">
                      <h5>CourseName</h5>
                    </div>
                  </div>
                </div>
                <div className="adminMssgBoxBody">
                  <p>A student is primarily a person enrolled in a school or other educational </p>
                </div>
                <div className="adminMssgBoxFoot">
                  <button type="button">REPLY</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AdminModal openMod={showModal} modIndex={modalIndex}
          mFunc={this.toggleModal} />
      </Fragment>
    } else if (mainAdmin) {
      return <Fragment>
        <div className="parentGrid">
          <div className="maChildGrid1">
            <div className="maAddUserAdmin">
              <h1>CREATE ADMIN...</h1>
              <div className="formField">
                <h5>EMAIL</h5>
                <input type="email" placeholder="EMAIL"
                  value={maEmail} onChange={this.inputChanged}
                  name="maEmail" autoComplete="off" />
              </div>
              <div className="formField">
                <h5>PASSWORD</h5>
                <input type="password" placeholder="PASSWORD"
                  value={maPassword} onChange={this.inputChanged}
                  name="maPassword" autoComplete="off" />
              </div>
              <div className="formField">
                <h5>RE-PASSWORD</h5>
                <input type="text" placeholder="RE-PASSWORD"
                  value={maRePassword} onChange={this.inputChanged}
                  name="maRePassword" autoComplete="off" />
              </div>
              <div className="formField">
                <button type="button" onClick={this.createAdmin}
                  >CREATE ADMIN</button>
              </div>
            </div>
          </div>
          
          <div className="maChildGrid2">
            <div className="userAdminsList">
              {userAdminArray && userAdminArray.map(eUserAdmin=>{
                return <div className="userAdminBox"
                  key={eUserAdmin._id}>
                  <div className="maFlexIconText">
                    <button type="button"
                      onClick={()=>this.removeAdmin(eUserAdmin._id)}>
                      <i className="fas fa-trash"></i>
                      <h5>REMOVE</h5>
                    </button>
                  </div>
                  <div className="maFlexIconText">
                    <i className="fas fa-circle"
                      style={{color: eUserAdmin.available?'green':'#DB4437'}}></i>
                    <h5>{eUserAdmin.username}</h5>
                  </div>
                  <div className="maFlexIconText">
                    <i className="fas fa-at"></i>
                    <h5>{eUserAdmin.email}</h5>
                  </div>
                  <div className="maFlexIconText">
                    <i className="fas fa-mobile"></i>
                    <h5>{eUserAdmin.mobile}</h5>
                  </div>
                </div>
              })}
            </div>
          </div>
          
          <div className="childGrid3">
            <img src={require('../../amar/orangeLogo.png')} alt="" />
          </div>
          
          <div className="maChildGrid4"></div>
          
          <div className="maChildGrid5">
            <div className="userAdminMssgsBox">
              <div className="userAdminMssgBox">
                <div className="userAdminMssgBoxHead">
                  <div className="userAdminMssgBoxHead1">
                    <img alt="" src={userImg} />
                    <div>
                      <h5>Username</h5>
                      <h5>12-01-1996 11:30 AM</h5>
                    </div>
                  </div>
                  <button type="button"
                    onClick={()=>this.toggleModal(true, 5)}>
                    <i className="fas fa-share"></i>
                  </button>
                </div>
                <div className="userAdminMssgBoxBody">
                  <p>
                    Text messaging, or texting, is the act of
                    composing and sending electronic messages.
                  </p>
                </div>
              </div>
              <div className="userAdminMssgBox">
                <div className="userAdminMssgBoxHead">
                  <div className="userAdminMssgBoxHead1">
                    <img alt="" src={userImg} />
                    <div>
                      <h5>Username</h5>
                      <h5>12-01-1996 11:30 AM</h5>
                    </div>
                  </div>
                  <button type="button">
                    <i className="fas fa-share"></i>
                  </button>
                </div>
                <div className="userAdminMssgBoxBody">
                  <p>
                    Text messaging, or texting, is the act of
                    composing and sending electronic messages.
                  </p>
                </div>
              </div>
              <div className="userAdminMssgBox">
                <div className="userAdminMssgBoxHead">
                  <div className="userAdminMssgBoxHead1">
                    <img alt="" src={userImg} />
                    <div>
                      <h5>Username</h5>
                      <h5>12-01-1996 11:30 AM</h5>
                    </div>
                  </div>
                  <button type="button">
                    <i className="fas fa-share"></i>
                  </button>
                </div>
                <div className="userAdminMssgBoxBody">
                  <p>
                    Text messaging, or texting, is the act of
                    composing and sending electronic messages.
                  </p>
                </div>
              </div>
              <div className="userAdminMssgBox">
                <div className="userAdminMssgBoxHead">
                  <div className="userAdminMssgBoxHead1">
                    <img alt="" src={userImg} />
                    <div>
                      <h5>Username</h5>
                      <h5>12-01-1996 11:30 AM</h5>
                    </div>
                  </div>
                  <button type="button">
                    <i className="fas fa-share"></i>
                  </button>
                </div>
                <div className="userAdminMssgBoxBody">
                  <p>
                    Text messaging, or texting, is the act of
                    composing and sending electronic messages.
                  </p>
                </div>
              </div>
              <div className="userAdminMssgBox">
                <div className="userAdminMssgBoxHead">
                  <div className="userAdminMssgBoxHead1">
                    <img alt="" src={userImg} />
                    <div>
                      <h5>Username</h5>
                      <h5>12-01-1996 11:30 AM</h5>
                    </div>
                  </div>
                  <button type="button">
                    <i className="fas fa-share"></i>
                  </button>
                </div>
                <div className="userAdminMssgBoxBody">
                  <p>
                    Text messaging, or texting, is the act of
                    composing and sending electronic messages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AdminModal openMod={showModal} modIndex={modalIndex}
          mFunc={this.toggleModal} />
      </Fragment>
    } else return <Redirect to="/signbox" />
  }
}

function mapStateToProps(state) {
  return {
    userAdminArray: state.aUserAdmins.userAdmins
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllUserAdmins: (payload)=>{dispatch({type: 'RETRIEVE_ALL_USER_ADMINS', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
