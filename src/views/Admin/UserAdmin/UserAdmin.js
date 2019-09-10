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

      blogName: '',
      blogImage0: null,
      blogImage0File: null,
      blogImage0Uploaded: false,
      blogQuote0: '',
      blogPara0: '',

      blogExtraContents: [
        { type: 'quote', value: '' },
        { type: 'para', value: '' },
        { type: 'image', value: null, valueFile: null, valueUploaded: false }
      ]
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
      }).then(addedCourse=>addedCourse.get()).then(resCourse=>{
        return firestore().collection(`/User-Amin/${auth().currentUser.uid}/courses`)
          .doc(resCourse.id).set({
            active_batch: resCourse.data().startsFrom,
            offer: resCourse.data().offer,
            image: resCourse.data().image,
            course_name: resCourse.data().courseName,
            course_fee: resCourse.data().courseFee
          })
      }).then(()=>{
        this.setState({
          courseName: '', image: '', description: '', courseFee: '',
          offer: '', level: '', programme: '', startsFrom: '',
          completesIn: '', courseContentBox: [], youLearnBox: [],
          preReqBox: [], location: '', category: '', uploadState: false
        });
        window.location.reload();
      });
    }
  }
  toggleModal =(showModal, modalIndex, mData)=> {
    this.setState({showModal, modalIndex, mData});
  }
  submitResponse =(res, sObj)=> {
    console.log(res, sObj)
    // firestore().collection('Students').doc(sObj.uid)
    //   .collection('courses').doc(sObj.course_id)
    //   .collection('submits').doc(sObj._id)
    //   .update({status: res})
  }
  testTing =()=> {
    firestore().collection('Context').add({name: 'FU#K U'})
      .then(resy=>resy.get())
      .then(resyy=>console.log(resyy));
  }

  
  BlogFieldProducer =props=> {
    switch(props.type) {
      case 'quote':
        return <div className="addCourseField">
          <h5>BLOG QUOTE</h5>
          <input type="text" placeholder="BLOG QUOTE"
            value={props.value} autoComplete="off"
            onChange={e=>props.changeTextFunc(e, props.index)} />
        </div>
      case 'para':
        return <div className="addCourseField">
          <h5>BLOG PARA</h5>
          <textarea rows="2" autoComplete="off"
            placeholder="BLOG PARA" value={props.value}
            onChange={e=>props.changeTextFunc(e, props.index)} />
        </div>
      case 'image':
        return <div className="addCourseField">
          <h5>BLOG IMAGE</h5>
          <div className="blogImage"
            style={{backgroundImage: `url(${props.value})`}}>
            <button type="button" style={{display: !props.value?'block':'none'}}
              onClick={()=>this[`blogImageInput${props.index}`].click()}>
              <i className="fas fa-file-upload"></i>
            </button>
            <div className="blogImageBtns"
              style={{display: !props.valueUploaded?(props.value?'block':'none'):'none'}}>
              <button type="button"
                onClick={()=>props.imageControlFunc(true, props.index)}>
                <i className="far fa-check-circle"></i>
              </button>
              <div style={{height: 10}}></div>
              <button type="button"
                onClick={()=>props.imageControlFunc(false, props.index)}>
                <i className="far fa-times-circle"></i>
              </button>
            </div>
          </div>
          <input type="file" style={{display: 'none'}}
            ref={r=>{this[`blogImageInput${props.index}`]=r}}
            onChange={e=>props.changeImageFunc(e, props.index)} />
        </div>
      default:
        return null;
    }
  }
  addExtraBlogField =type=> {
    switch(type) {
      case 'quote':
        this.state.blogExtraContents
          .push({type: 'quote', value: ''});
        this.setState({
          blogExtraContents: this.state.blogExtraContents
        });
        break;
      case 'para':
        this.state.blogExtraContents
          .push({type: 'para', value: ''});
        this.setState({
          blogExtraContents: this.state.blogExtraContents
        });
        break;
      case 'image':
        this.state.blogExtraContents
          .push({type: 'image', value: null, valueFile: null, valueUploaded: false});
        this.setState({
          blogExtraContents: this.state.blogExtraContents
        });
        break;
    }
    setTimeout(()=>{
      this.blogContainer.scrollTo(0, this.blogContainer.clientHeight);
    }, 50);
  }
  extraBlogTextChanged =(e, index)=> {
    this.state.blogExtraContents[index].value = e.target.value
    this.setState({
      blogExtraContents: [...this.state.blogExtraContents]
    })
  }
  extraBlogImageChanged =(e, index)=> {
    let reader = new FileReader(),
        file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload =()=> {
      this.state.blogExtraContents[index].value = reader.result;
      this.setState({
        blogExtraContents: [...this.state.blogExtraContents]
      })
    }
    console.log(this.state.blogExtraContents[index])
  }
  extraBlogImageControl =(booly, index)=> {
    if(booly) {
      // upload image
      this.state.blogExtraContents[index].valueUploaded = true;
      this.setState({
        blogExtraContents: [...this.state.blogExtraContents]
      })
    } else {
      this.state.blogExtraContents[index].value = null;
      this.state.blogExtraContents[index].valueFile = null;
      this[`blogImageInput${index}`].value = '';
      this.setState({
        blogExtraContents: [...this.state.blogExtraContents]
      })
    }
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

      blogName, blogImage0, blogImage0Uploaded,
      blogPara0, blogQuote0, blogExtraContents
    } = this.state;
    const { pCourses, pContact, adminMssgBox, adminSubmitsBox } = this.props;
    return <Fragment>
      <div className="parentGrid">
        <div className="childGrid1">
          <div className="adminCourseBoxes">
            <h3>ADDED COURSES...</h3>
            <div className="adminCourseBoxes1">
              {pCourses && pCourses.map(eCourse=>{
                return <div className="adminCourseBox" key={eCourse._id}
                  style={{backgroundImage: `url(${eCourse.image})`}}>
                  <div className="adminCourseBox1">
                    <div className="acb1Div"></div>
                    <div className="acb1Div">
                      <button type="button"
                        onClick={()=>this.toggleModal(true, 4, eCourse)}>
                        <i className="fas fa-egg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              })}
            </div>
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
                      onClick={()=>{this.inputTag.click();}}
                      disabled={image?true:false}><i className="fas fa-plus"></i>
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
          <img src={require('../../../amar/orangeLogo.png')} alt=""
            onClick={this.testTing} />
        </div>
        <div className="childGrid4">
          <div className="repliesAndHistory">
            <div className="repliesAndHistory1">
              <div className="repliesAndHistory1Head"></div>
              <div className="repliesAndHistory1Body">
              {adminMssgBox && adminMssgBox.map((eMssg, index)=>{
                return <div className="repliesAndHistory1Box" key={index}>
                  <div className="repliesAndHistory1BoxHead">
                    <img alt="" src={eMssg.image?eMssg.image:userImg} />
                    <div>
                      <h5>{eMssg.username}</h5>
                      <h5>{eMssg.time}</h5>
                    </div>
                  </div>
                  <div className="repliesAndHistory1BoxBody1">
                    <div className="repliesAndHistory1BoxBody11">
                      <h5 onClick={()=>{if(!eMssg.replied) {
                          this.toggleModal(true, 5, {
                            c_id: eMssg.course_id, to: eMssg.username,
                            time: eMssg.time})
                        }}}
                        style={{cursor: eMssg.replied?'not-allowed':'pointer'}}
                        >{eMssg.course_name}</h5>
                    </div>
                    <p>{eMssg.mssg}</p>
                  </div>
                  <div className="repliesAndHistory1BoxBody1 replied">
                    <p>{eMssg.replied}</p>
                  </div>
                </div>
              })}
              </div>
            </div>
            <div className="repliesAndHistory1">
              <div className="repliesAndHistory1Head"></div>
              <div className="repliesAndHistory1Body">
              {adminSubmitsBox && adminSubmitsBox.map((eSubmit, index)=>{
                return <div className="repliesAndHistory1Box" key={index}>
                  <div className="repliesAndHistory1BoxHead">
                    <img alt="" src={eSubmit.image?eSubmit.image:userImg} />
                    <div>
                      <h5>{eSubmit.username}</h5>
                      <h5>{eSubmit._id}</h5>
                    </div>
                  </div>
                  <div className="repliesAndHistory1BoxBody1">
                    <div className="repliesAndHistory1BoxBody11">
                      <h5>{eSubmit.course_name}</h5>
                    </div>
                    <div className="repliesAndHistory1BoxBody11">
                      <div>
                        <button type="button"
                          style={{fontSize: 26, color: '#4285F4'}}
                          onClick={()=>{window.open(eSubmit.git_link, null, null)}}
                          ><i className="fab fa-github"></i>
                        </button>
                        <button type="button"
                          style={{fontSize: 24, color: '#4285F4', margin: '0 10px'}}
                          onClick={()=>{window.open(eSubmit.host_link, null, null)}}
                          ><i className="fas fa-globe"></i>
                        </button>
                        <b>0</b>
                      </div>
                      <div>
                        <button type="button" style={{color: '#DB4437'}}
                          onClick={()=>this.submitResponse(false, {
                            uid: eSubmit.uid, course_id: eSubmit.course_id,
                            _id: eSubmit._id})}>
                          <i className="fas fa-times-circle"></i>
                        </button>
                        <button type="button"
                          style={{color: '#0F9D58', marginLeft: 10}}
                          onClick={()=>this.submitResponse(true, {
                            uid: eSubmit.uid, course_id: eSubmit.course_id,
                            _id: eSubmit._id})}>
                          <i className="fas fa-check-circle"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              })}
              </div>
            </div>
          </div>
        </div>
        <div className="childGrid5">
          <div className="createBlogContainer">
            <div className="createBlogContainerHead">
              <h3 onClick={()=>console.log(this.state)}>CREATE BLOG HERE...</h3>
              <div className="blogFieldControls">
                <button type="button" onClick={()=>this.addExtraBlogField('image')}>+IMAGE</button>
                <button type="button" onClick={()=>this.addExtraBlogField('quote')}>+QUOTE</button>
                <button type="button" onClick={()=>this.addExtraBlogField('para')}>+PARA</button>
              </div>
            </div>
            <div className="createBlogContainerBody"
              ref={r=>{this.blogContainer=r}}>
              <div className="blogForm">
                <div className="blogFormHead">
                  <i className="fas fa-fire-alt"></i>
                  <p>Error Messages Place</p>
                </div>
                <div className="addCourseField">
                  <h5>BLOG NAME</h5>
                  <input type="text" placeholder="BLOG NAME"
                    name="blogName" value={blogName} autoComplete="off"
                    onChange={this.inputChanged} />
                </div>
                <div className="addCourseField">
                  <h5>BLOG IMAGE</h5>
                  <div className="blogImage"
                    style={{backgroundImage: `url(${blogImage0})`}}>
                    <button type="button" style={{display: !blogImage0?'block':'none'}}
                      onClick={()=>this.blogImageInput.click()}>
                      <i className="fas fa-file-upload"></i>
                    </button>
                    <div className="blogImageBtns"
                      style={{display: !blogImage0Uploaded?(blogImage0?'block':'none'):'none'}}>
                      <button type="button"
                        onClick={()=>this.setState({blogImage0Uploaded: true})}>
                        <i className="far fa-check-circle"></i>
                      </button>
                      <div style={{height: 10}}></div>
                      <button type="button">
                        <i className="far fa-times-circle"></i>
                      </button>
                    </div>
                  </div>
                  <input type="file" ref={r=>{this.blogImageInput=r}}
                    onChange={e=>this.blogImageChanged(e, 0)}
                    style={{display: 'none'}} />
                </div>
                <div className="addCourseField">
                  <h5>BLOG QUOTE</h5>
                  <input type="text" placeholder="BLOG NAME"
                    name="blogName" value={blogQuote0} autoComplete="off"
                    onChange={this.inputChanged} />
                </div>
                <div className="addCourseField">
                  <h5>BLOG PARA</h5>
                  <textarea name="description" rows="2"
                    placeholder="DESCRIPTION" value={blogPara0}
                    onChange={this.inputChanged} autoComplete="off" />
                </div>
                <div className="blogForm3">
                {blogExtraContents && blogExtraContents.map((eachObj, index)=>{
                  return <this.BlogFieldProducer key={index}
                    type={eachObj.type} index={index} value={eachObj.value}
                    valueUploaded={eachObj.valueUploaded}
                    changeTextFunc={this.extraBlogTextChanged}
                    changeImageFunc={this.extraBlogImageChanged}
                    imageControlFunc={this.extraBlogImageControl} />
                })}
                </div>
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
    pContact: state.profile.mobile,
    pCourses: state.profile.courses,
    adminMssgBox: state.reqArrays.adminMssgBox,
    adminSubmitsBox: state.reqArrays.adminSubmitsBox,
  }
}
function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAdmin);