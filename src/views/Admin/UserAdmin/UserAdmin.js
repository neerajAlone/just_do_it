import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { firestore, storage, auth } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import './UserAdmin.css';
import defaultImage from '../../../amar/course_image.png';
import userImg from '../../../amar/undraw_profile_pic.svg';
import AdminModal from '../AdminModal/AdminModal';

class UserAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalIndex: 0,
      mData: null,

      imageState: false,
      imageFile: null,
      uploadState: false,
      completesIn: '',//done
      courseContent: '',//done
      courseContentBox: [],
      createdBy: '',
      category: '',
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
  addCourse =(contact)=> {
    const {
      courseName, image, description, courseFee, category,
      offer, level, programme, startsFrom, completesIn,
      courseContentBox, youLearnBox, preReqBox, location
    } = this.state;
    if(
      courseName.length<7 || description.split(' ').length < 10 ||
      !courseFee.match(/(\d){3,6}/i) || !offer.match(/(\d){1,2}/i) ||
      !level.toLowerCase().match(/(beginner|intermediate|advanced)/i) ||
      !programme.toLowerCase().match(/(internship|workshop)/i) ||
      !category.toLowerCase().match(/(web development|computer science)/i) ||
      !completesIn.match(/(\d){1,2}/i) || location.split(' ').length<2 ||
      !startsFrom.match(/^((\d){2}\-(\d){2}\-(\d){4} (\d){2}\:(\d){2} (AM|PM))$/i) ||
      courseContentBox.length<4 || youLearnBox.length<4 || preReqBox.length<4
    ) {
      this.toggleModal(true, 2)
    } else {
      firestore().collection('Courses').add({
        completesIn, courseContentBox, createdOn: Date.now(), description, courseFee,
        createdBy: {_id: auth().currentUser.uid, username: auth().currentUser.displayName, contact},
        image, level, location, courseName, offer, preReqBox, programme, startsFrom,
        youLearnBox, category, rating: 0
      }).then(()=>{
        this.setState({
          courseName: '', image: '', description: '', courseFee: '',
          offer: '', level: '', programme: '', startsFrom: '',
          completesIn: '', courseContentBox: [], youLearnBox: [],
          preReqBox: [], location: '', category: '', uploadState: false
        });
        window.location.reload();
      })
    }
  }
  toggleModal =(showModal, modalIndex, mData)=> {
    this.setState({showModal, modalIndex, mData});
  }

  componentWillMount() {
    onbeforeunload =()=> {
      if(this.state.uploadState) {
        storage().refFromURL(`gs://developer-wizard.appspot.com/courses/${this.state.imageFile.name}`)
          .delete()
      } 
    }
  }
  render() {
    const {
      imageState, image, uploadState, showModal, modalIndex,
      courseName, description, courseFee, offer, level,
      programme, startsFrom, completesIn, category,
      courseContent, courseContentBox, preReq, mData,
      preReqBox, youLearn, youLearnBox, location,
    } = this.state;
    const { courseArray, pContact } = this.props;
    return <Fragment>
      <div className="parentGrid">
        <div className="childGrid1">
          <div className="adminCourseBoxes">
            {courseArray && courseArray.map(eCourse=>{
              return <div className="adminCourseBox"
                key={eCourse._id}
                style={{backgroundImage: `url(${eCourse.image})`}}>
                <div className="adminCourseBox1">
                  <div className="acb1Div"></div>
                  <div className="acb1Div">
                    <button type="button"
                      onClick={()=>this.toggleModal(true, 4, {id: eCourse._id, batch: eCourse.startsFrom})}>
                      <i className="fas fa-egg"></i>
                    </button>
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
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
            <div className="addCourseField">
              <h5>CATEGORY</h5>
              <input type="text" placeholder="CATEGORY"
                name="category" value={category} autoComplete="off"
                onChange={this.inputChanged} />
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
                onClick={()=>this.addCourse(pContact)} >ADD COURSE</button>
            </div>
          </div>
        </div>
        <div className="childGrid3">
          <img src={require('../../../amar/orangeLogo.png')} alt="" />
        </div>
        <div className="childGrid4">
          <div className="repliesAndHistory">
            <div className="repliesAndHistory1">
              <div className="repliesAndHistory1Head"></div>
              <div className="repliesAndHistory1Body">
                <div className="repliesAndHistory1Box">
                  <div className="repliesAndHistory1BoxHead">
                    <img alt="" src={userImg} />
                    <div>
                      <h5>Username</h5>
                      <h5>12-01-1996 11:30 AM</h5>
                    </div>
                  </div>
                  <div className="repliesAndHistory1BoxBody1">
                    A student is primarily a person enrolled
                    in a school or other educational.
                  </div>
                </div>
              </div>
            </div>
            <div className="repliesAndHistory1">
              <div className="repliesAndHistory1Head"></div>
              <div className="repliesAndHistory1Body">
                <div className="repliesAndHistory1Box">
                  <div className="repliesAndHistory1BoxHead">
                    <img alt="" src={userImg} />
                    <div>
                      <h5>Username</h5>
                      <h5>12-01-1996 11:30 AM</h5>
                    </div>
                  </div>
                  <div className="repliesAndHistory1BoxBody2">
                  </div>
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
                <img src={require('../../../amar/undraw_profile_pic.svg')} alt="" />
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
                <p>
                  A student is primarily a person
                  enrolled in a school or other educational.
                </p>
              </div>
              <div className="adminMssgBoxFoot">
                <button type="button"
                  onClick={()=>this.toggleModal(true, 5)}
                  >REPLY</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdminModal openMod={showModal} modIndex={modalIndex}
        mFunc={this.toggleModal} mData={mData} />
    </Fragment>
  }
}

function mapStateToProps(state) {
  return {
    courseArray: state.reqArrays.allCourses,
    pContact: state.profile.mobile
  }
}
function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAdmin);