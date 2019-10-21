import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
      estimatedTime: '',//done
      courseContent: '',//done
      courseContentBox: [],
      createdBy: '',
      category: '',
      createdOn: '',
      courseFee: '',//done
      description: '',//done
      image: '',//done
      technologyUsed: '',//done
      location: '',//done
      courseName: '',//done
      offer: '',//done
      preReq: '',//done
      preReqBox: [],
      programme: '',//done
      batch: '',//done
      youLearn: '',//done
      youLearnBox: [],

      blogName: '',
      blogImage0: null,
      blogImage0File: null,
      blogImage0Uploaded: false,
      blogQuote0: '',
      blogPara0: '',
      blogError: '',

      blogExtraContents: [
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
  addCourse1 =(pDetail)=> {
    const {
      courseName, image, description, category,
      programme, technologyUsed, batch, courseFee,
      courseContentBox, preReqBox, youLearnBox,
      location, offer, estimatedTime
    } = this.state;
    firestore().collection('Courses').add({
      courseName, image, description, category,
      programme, technologyUsed, batch, offer: 0,
      courseContentBox, preReqBox, youLearnBox,
      createdOn: Date.now(), createdBy: pDetail.id,
      contact: pDetail.contact, courseFee,
      location, offer, estimatedTime
    }).then(res=>res.get()).then(res=>{
      firestore().collection('User-Admin').doc(pDetail.id)
        .collection('courses').doc(res.id).set({
          courseName: res.data().courseName,
          batch: res.data().batch,
          offer: res.data().offer,
          image: res.data().image,
          courseFee: res.data().courseFee,
        }).then(()=>{
          this.setState({uploadState: false});
          window.location.reload();
        });
    })
  }
  toggleModal =(showModal, modalIndex, mData)=> {
    this.setState({showModal, modalIndex, mData});
  }
  submitResponse =(res, sObj)=> {
    if(res) {
      firestore().collection('Students').doc(sObj.uid)
        .collection('courses').doc(sObj.course_id)
        .collection('submits').doc(sObj._id)
        .update({status: res}).then(()=>{
          return firestore().collection('User-Admin')
            .doc(auth().currentUser.uid).collection('submits')
            .doc(sObj._id).delete()
        }).then(resi=>console.log(resi));
    } else {
      this.setState({showModal: true, modalIndex: 9, mData: {}});
    }
  }
  testTing =()=> {
    firestore().collection('Context').add({name: 'FU#K U'})
      .then(resy=>resy.get())
      .then(resyy=>console.log(resyy));
  }

  blogImageChanged =e=> {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload =()=> {
      this.setState({blogImage0: reader.result})
    }
    this.setState({blogImage0File: e.target.files[0]})
  }
  uploadBlogImage0 =()=> {
    const { blogImage0, blogImage0File } = this.state;
    if(blogImage0 && blogImage0File) {
      storage().refFromURL(`gs://developer-wizard.appspot.com/blogs/${blogImage0File.name}`)
        .put(blogImage0File).on('state_changed',
          null, null,
          ()=>{
            storage().refFromURL(`gs://developer-wizard.appspot.com/blogs/${blogImage0File.name}`)
              .getDownloadURL().then(url=>this.setState({
                blogImage0: url, blogImage0Uploaded: true}));
          })
    } else {
      this.setState({blogError: 'Blog\'s req Image is Invalid'});
      setTimeout(()=>{this.blogContainer.scrollTo(0, 0)}, 50);
    }
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
          <textarea rows="5" autoComplete="off"
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
      case 'code':
        return <div className="addCourseField">
          <h5>BLOG CODE</h5>
          <textarea rows="5" autoComplete="off"
            placeholder="BLOG CODE" value={props.value}
            onChange={e=>props.changeTextFunc(e, props.index)} />
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
      case 'code':
        this.state.blogExtraContents
          .push({type: 'code', value: ''});
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
      });
    }
    this.state.blogExtraContents[index].valueFile = file;
    this.setState({
      blogExtraContents: [...this.state.blogExtraContents]
    });
  }
  extraBlogImageControl =(booly, index)=> {
    if(booly) {
      // upload image
      const { value, valueFile } = this.state.blogExtraContents[index];
      console.log(value);
      console.log(valueFile)
      if(value && valueFile) {
        storage().refFromURL(`gs://developer-wizard.appspot.com/blogs/${valueFile.name}`)
          .put(valueFile).on('state_changed',
            null, null,
            ()=>{
              storage().refFromURL(`gs://developer-wizard.appspot.com/blogs/${valueFile.name}`)
                .getDownloadURL().then(url=>{
                  this.state.blogExtraContents[index].value = url;
                  this.state.blogExtraContents[index].valueUploaded = true;
                  this.setState({
                    blogExtraContents: [...this.state.blogExtraContents]
                  });
                });
            })
      } else {
        this.setState({blogError: 'Blog\'s req Image is Invalid'});
        setTimeout(()=>{this.blogContainer.scrollTo(0, 0)}, 50);
      }
    } else {
      this.state.blogExtraContents[index].value = null;
      this.state.blogExtraContents[index].valueFile = null;
      this[`blogImageInput${index}`].value = '';
      this.setState({
        blogExtraContents: [...this.state.blogExtraContents]
      })
    }
  }
  moveToQueue =()=> {
    const { blogName, blogImage0, blogImage0Uploaded,
      blogQuote0, blogPara0, blogExtraContents,
    } = this.state;
    if(blogName===''||!blogImage0Uploaded||
      blogQuote0===''||blogPara0==='') {
      this.setState({blogError: 'Blog\'s required field is Empty'});
      setTimeout(()=>{this.blogContainer.scrollTo(0, 0)}, 50);
    } else {
      if(blogExtraContents.length!==0){
        let anyError = false;
        blogExtraContents.forEach(eP=>{
          if((eP.type==='image' && !eP.valueUploaded) ||
            ((eP.type==='quote' || eP.type==='para') && eP.value==='')
          ){ anyError = true }
        })
        if(!anyError) {
          firestore().collection('Blogs').add({
            blogName, blogImage0, blogQuote0,
            blogPara0, blogExtraContents,
            status: null, createdOn: Date.now(),
            createdBy: {
              _id: auth().currentUser.uid,
              image: auth().currentUser.photoURL,
              username: auth().currentUser.displayName
            }
          }).then(blogy=>blogy.get())
          .then(afterBlogy=>{
            return firestore().collection('User-Admin')
              .doc(auth().currentUser.uid)
              .collection('blogs').doc(afterBlogy.id)
              .set({blogName, status: null})
          }).then(()=>{
            this.props.history.push('/profile');
          }).catch(err=>{
            this.setState({anyError: err.message});
            setTimeout(()=>{this.blogContainer.scrollTo(0, 0)}, 50);
          })
        } else { 
          this.setState({blogError: 'Any added Field of Blog is Invalid'});
          setTimeout(()=>{this.blogContainer.scrollTo(0, 0)}, 50);
        }
      } else {
        firestore().collection('Blogs').add({
          blogName, blogImage0, blogQuote0,
          blogPara0, blogExtraContents: [],
          status: null, createdOn: Date.now(),
          createdBy: {
            _id: auth().currentUser.uid,
            image: auth().currentUser.photoURL,
            username: auth().currentUser.displayName
          }
        }).then(blogy=>blogy.get())
        .then(afterBlogy=>{
          return firestore().collection('User-Admin')
            .doc(auth().currentUser.uid)
            .collection('blogs').doc(afterBlogy.id)
            .set({blogName, status: null})
        }).then(()=>{
          this.props.history.push('/profile');
        }).catch(err=>{
          this.setState({anyError: err.message});
          setTimeout(()=>{this.blogContainer.scrollTo(0, 0)}, 50);
        })
      }
    }
  }

  componentWillMount() {
    onbeforeunload =()=> {
      if(this.state.uploadState) {
        storage().refFromURL(`gs://developer-wizard.appspot.com/courses/${this.state.imageFile.name}`)
          .delete();
      }
      if(this.state.blogImage0Uploaded) {
        storage().refFromURL(`gs://developer-wizard.appspot.com/blogs/${this.state.blogImage0File.name}`)
          .delete();
      }
      if(this.state.blogExtraContents.length !== 0){
        this.state.blogExtraContents.forEach(eObji=>{
          if(eObji.type==='image' && eObji.valueUploaded) {
            storage().refFromURL(`gs://developer-wizard.appspot.com/blogs/${eObji.valueFile.name}`)
              .delete();
          }
        })
      }
    }
  }
  render() {
    const {
      imageState, image, uploadState, showModal, modalIndex,
      courseName, description, courseFee, offer, technologyUsed,
      programme, batch, estimatedTime, category,
      courseContent, courseContentBox, preReq, mData,
      preReqBox, youLearn, youLearnBox, location,

      blogName, blogImage0, blogImage0Uploaded, blogError,
      blogPara0, blogQuote0, blogExtraContents
    } = this.state;
    const { pCourses, pDetail, adminMssgBox, adminSubmitsBox } = this.props;
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
              <textarea name="description" rows="3"
                placeholder="DESCRIPTION" value={description}
                onChange={this.inputChanged} autoComplete="off" />
            </div>
            <div className="addCourseField">
              <h5>COURSE FEE</h5>
              <input type="text" placeholder="COURSE FEE"
                name="courseFee" value={courseFee} autoComplete="off"
                onChange={this.inputChanged} />
            </div>
            <div className="addCourseField">
              <h5>OFFER</h5>
              <input type="text" placeholder="OFFER"
                name="offer" value={offer} autoComplete="off"
                onChange={this.inputChanged} />
            </div>
            <div className="addCourseField">
              <h5>CATEGORY</h5>
              <select value={category} name="category"
                onChange={this.inputChanged}>
                <option value="" disabled>SELECT CATEGORY</option>
                <option value="web">Web</option>
                <option value="ml">ML</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
            <div className="addCourseField">
              <h5>PROGRAMME</h5>
              <select value={programme} name="programme"
                onChange={this.inputChanged}>
                <option value="" disabled>SELECT PROGRAMME</option>
                <option value="internShip">InternShip</option>
                <option value="crashCourse">CrashCourse</option>
              </select>
            </div>
            <div className="addCourseField">
              <h5>TECHNOLOGY USED</h5>
              <input type="text" placeholder="TECHNOLOGY USED"
                name="technologyUsed" value={technologyUsed}
                autoComplete="off" onChange={this.inputChanged} />
            </div>
            <div className="addCourseField">
              <h5>BATCH</h5>
              <input type="text" placeholder="DD-MM-YYYY HR:MN AM/PM"
                name="batch" value={batch}
                onChange={this.inputChanged} autoComplete="off" />
            </div>
            <div className="addCourseField">
              <h5>ESTIMATED TIME</h5>
              <input type="text" placeholder="ESTIMATED TIME"
                name="estimatedTime" value={estimatedTime}
                onChange={this.inputChanged} autoComplete="off" />
            </div>
            <div className="addCourseField">
              <div className="fieldLabelGroup">
                <h5>COURSE CONTENTS</h5>
                <button type="button"
                  onClick={()=>this.addDetailInArray(1)}
                  >ADD</button>
              </div>
              <textarea name="courseContent" rows="3"
                placeholder="COURSE CONTENT" value={courseContent}
                onChange={this.inputChanged} autoComplete="off" />
              <ul>
                {courseContentBox && courseContentBox.map((eachProp, index)=>{
                  return <li key={index} onClick={()=>{
                    courseContentBox.splice(index, 1);
                    this.setState({courseContentBox});
                    }}><p>{index+1}.</p><p>{eachProp}</p></li>
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
              <textarea name="youLearn" rows="3"
                placeholder="YOU LEARN" value={youLearn}
                onChange={this.inputChanged} autoComplete="off" />
              <ul>
                {youLearnBox && youLearnBox.map((eachProp, index)=>{
                  return <li key={index} onClick={()=>{
                    youLearnBox.splice(index, 1);
                    this.setState({youLearnBox});
                    }}><b>{index+1}.</b> {eachProp}</li>
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
              <textarea name="preReq" rows="3"
                placeholder="PRE REQUIREMENT" value={preReq}
                onChange={this.inputChanged} autoComplete="off" />
              <ul>
                {preReqBox && preReqBox.map((eachProp, index)=>{
                  return <li key={index} onClick={()=>{
                    preReqBox.splice(index, 1);
                    this.setState({preReqBox});
                    }}><b>{index+1}.</b> {eachProp}</li>
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
                onClick={()=>this.addCourse1(pDetail)} >ADD COURSE</button>
            </div>
          </div>
        </div>
        <div className="childGrid3">
          <img src={require('../../../amar/developerWizardsLogoOrange.png')} alt=""
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
          <div className="cBlogContainer">
            <div className="cBlogHead">
              <h3>CREATE BLOG HERE</h3>
              <div className="cBlogHeadCntrl">
                <button type="button" title="HEADING">H</button>
                <button type="button" title="PARAGRAPH">P</button>
                <button type="button" title="IMAGE">I</button>
                <button type="button" title="CODE">C</button>
              </div>
            </div>
            <div className="cBlogBody">
              <div className="cBlogBodyForm">
                <input type="text" placeholder="BLOG TITLE" />
                <textarea rows="3" placeholder="BLOG SUB-TITLE" />
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
    pDetail: { contact: state.profile.mobile, id: state.profile._id },
    pCourses: state.profile.courses,
    adminMssgBox: state.reqArrays.adminMssgBox,
    adminSubmitsBox: state.reqArrays.adminSubmitsBox,
  }
}
function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserAdmin));