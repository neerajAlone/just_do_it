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
      image: '',//done
      estimatedTime: '',//done
      courseContentBox: [],
      withIntern: false,
      description: '',//done
      technologyUsed: '',//done
      courseName: '',//done
      preReqBox: [],
      programme: '',//done
      youLearnBox: [],
      textareaCoursePrimaryPreview: '',
      textareaCourseSecondary: '',
      textareaCourseSecondaryArray: [],
      textareaLearnPrimaryPreview: '',
      textareaLearnSecondary: '',
      textareaLearnSecondaryArray: [],
      textareaRequirePrimaryPreview: '',
      textareaRequireSecondary: '',
      textareaRequireSecondaryArray: [],

      bTitle: '',
      bSubTitle: '',
      blogExtraContents: [],
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
    const trimmedDate = Date.now().toString().slice(7, 13);
    if(image && imageFile) {
      storage().refFromURL(`gs://developer-wizard.appspot.com/courses/${imageFile.name}-${trimmedDate}`)
        .put(imageFile).on('state_changed',
          null, null,
          ()=>{
            storage().refFromURL(`gs://developer-wizard.appspot.com/courses/${imageFile.name}-${trimmedDate}`)
              .getDownloadURL().then(url=>this.setState({
                image: url, imageState: false, uploadState: true}))
          })
    } else console.log('IMAGE OR IMAGEFILE IS MISSING !');
  }
  textareaPrimaryPreview =(to, e)=> {
    switch(to) {
      case 'COURSE_CONTENT':
        this.setState({
          textareaCoursePrimaryPreview: e.target.value
        });
        break;
      case 'YOU_LEARN':
        this.setState({
          textareaLearnPrimaryPreview: e.target.value
        });
        break;
      case 'PRE_REQUIRE':
        this.setState({
          textareaRequirePrimaryPreview: e.target.value
        });
        break;
    }
  }
  textareaArrayPush =to=> {
    const { textareaCourseSecondary, textareaLearnSecondary, textareaRequireSecondary } = this.state;
    switch(to) {
      case 'COURSE_CONTENT':
        if(textareaCourseSecondary) {
          this.setState(preState=>{
            return {
              textareaCourseSecondaryArray: [
                ...preState.textareaCourseSecondaryArray,
                textareaCourseSecondary],
              textareaCourseSecondary: ''
            }
          });
        }
        break;
      case 'YOU_LEARN':
        if(textareaLearnSecondary) {
          this.setState(preState=>{
            return {
              textareaLearnSecondaryArray: [
                ...preState.textareaLearnSecondaryArray,
                textareaLearnSecondary],
              textareaLearnSecondary: ''
            }
          });
        }
        break;
      case 'PRE_REQUIRE':
        if(textareaRequireSecondary) {
          this.setState(preState=>{
            return {
              textareaRequireSecondaryArray: [
                ...preState.textareaRequireSecondaryArray,
                textareaRequireSecondary],
              textareaRequireSecondary: ''
            }
          });
        }
        break;
    }
  }
  addTextareaAddFunc =to=> {
    const { textareaCoursePrimaryPreview, textareaCourseSecondaryArray,
      textareaLearnPrimaryPreview, textareaLearnSecondaryArray,
      textareaRequirePrimaryPreview, textareaRequireSecondaryArray } = this.state;
    switch(to) {
      case 'COURSE_CONTENT':
        if(textareaCoursePrimaryPreview) {
          this.setState(preState=>{
            return {
              courseContentBox: [
                ...preState.courseContentBox,
                {pri: textareaCoursePrimaryPreview,
                  sec: textareaCourseSecondaryArray}],
              textareaCoursePrimaryPreview: '',
              textareaCourseSecondaryArray: [],
            }
          })
        }
        break;
      case 'YOU_LEARN':
        if(textareaLearnPrimaryPreview) {
          this.setState(preState=>{
            return {
              youLearnBox: [
                ...preState.youLearnBox,
                {pri: textareaLearnPrimaryPreview,
                  sec: textareaLearnSecondaryArray}],
              textareaLearnPrimaryPreview: '',
              textareaLearnSecondaryArray: [],
            }
          })
        }
        break;
      case 'PRE_REQUIRE':
        if(textareaRequirePrimaryPreview) {
          this.setState(preState=>{
            return {
              preReqBox: [...preState.preReqBox,
                {pri: textareaRequirePrimaryPreview,
                  sec: textareaRequireSecondaryArray}],
              textareaRequirePrimaryPreview: '',
              textareaRequireSecondaryArray: [],
            }
          })
        }
        break;
    }
  }
  addCourse1 =(pDetail)=> {
    const { courseName, image, description,
      programme, technologyUsed,
      estimatedTime, courseContentBox,
      youLearnBox, preReqBox, withIntern,
    } = this.state;
    // trimmed course includes => image, offer, name, id 
    firestore().collection('Courses')
      .add({
        courseName, image, description,
        programme, technologyUsed,
        estimatedTime, courseContentBox,
        youLearnBox, preReqBox, withIntern,
        attainedBy: null, report: null,
        status: null, location: null,
        batch: null, batchCapacity: null,
        courseFee: null, courseOffer: null,
        cName: auth().currentUser.displayName,
        cImage: auth().currentUser.photoURL,
        cUid: auth().currentUser.uid,
        createdOn: Date.now()
      }).then(()=>{
        this.setState({
          courseName: '', image: '', imageState: false,
          uploadState: false,  description: '',
          programme: '', technologyUsed: '',
          estimatedTime: '', courseContentBox: [],
          youLearnBox: [], preReqBox: [], withIntern: false,
        });
        this.props.snackbar('Course Added For Approval ...');
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
    
  }

  BlogFieldProducer =props=> {
    switch(props.type) {
      case 'header':
        return <div className="cBlogExtraCnt">
          <input spellCheck="false" type="text" placeholder="BLOG HEADER"
            value={props.value} autoComplete="off"
            onChange={e=>props.cFunc(e, props.index)} />
          <button type="button" onClick={props.rFunc}>
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      case 'gap':
        return <div className="cBlogExtraCnt">
          <div className="cBlogGap"><p>BLOG GAP</p></div>
          <button type="button" onClick={props.rFunc}>
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      case 'paragraph':
        return <div className="cBlogExtraCnt">
          <textarea spellCheck="false" rows="5" autoComplete="off"
            placeholder="BLOG PARA" value={props.value}
            onChange={e=>props.cFunc(e, props.index)} />
          <button type="button" onClick={props.rFunc}>
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      case 'image':
        return <div className="cBlogImageBox">
          <input spellCheck="false" type="file" style={{display: 'none'}} 
            ref={r=>this['fileInput'+props.index]=r}
            onChange={e=>this.extraBlogImageChanged(e, props.index)} />
          <div className="cBlogImageBtns">
            <button type="button"
              onClick={()=>this['fileInput'+props.index].click()}
              style={{display: !props.image?'block':'none'}}
              >UPLOAD BLOG IMAGE</button>
            <button type="button" onClick={props.rFunc}
              style={{display: !props.image?'block':'none'}}>
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
          <div className="cBlogImage"
            style={{display: props.image?'block':'none'}}>
            <img src={props.image} alt="" />
            <div className="cBlogImageCntrl">
            {!props.iuState?
              <div>
                <button type="button" onClick={()=>{
                    this['fileInput'+props.index].value = '';
                    this.setState(preState=>{
                      preState.blogExtraContents[props.index].value = null;
                      preState.blogExtraContents[props.index].valueFile = null;
                      return { blogExtraContents: [...preState.blogExtraContents] }
                    });
                  }}>CANCEL</button>
                <button type="button" onClick={props.uFunc}>UPLOAD</button>
              </div>:<button type="button" onClick={props.ruImage}>DELETE</button>
            }
            </div>
          </div>
        </div>
      case 'code':
        return <div className="cBlogExtraCnt">
          <textarea spellCheck="false" rows="5" autoComplete="off"
            placeholder="BLOG CODE" value={props.value}
            onChange={e=>props.cFunc(e, props.index)} />
          <button type="button" onClick={props.rFunc} >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      default:
        return null;
    }
  }
  addExtraBlogField =type=> {
    switch(type) {
      case 'header':
        this.state.blogExtraContents
          .push({type: 'header', value: ''});
        this.setState({
          blogExtraContents: this.state.blogExtraContents
        });
        break;
      case 'gap':
        this.state.blogExtraContents
          .push({type: 'gap'});
        this.setState({
          blogExtraContents: this.state.blogExtraContents
        });
        break;
      case 'paragraph':
        this.state.blogExtraContents
          .push({type: 'paragraph', value: ''});
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
      this.cBlogBody.scrollTo(0, this.cBlogBody.clientHeight);
    }, 50);
  }
  removeExtraBlogField =index=> {
    this.setState(preState=>{
      preState.blogExtraContents.splice(index, 1);
      return { blogExtraContents: [...preState.blogExtraContents] }
    })
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
  uploadExtraImage =(index)=> {
    const bec = this.state.blogExtraContents;
    storage().refFromURL(`gs://developer-wizard.appspot.com/blogs/${bec[index].valueFile.name}`)
      .put(bec[index].valueFile).on('state_changed', null, null, ()=>{
        storage().refFromURL(`gs://developer-wizard.appspot.com/blogs/${bec[index].valueFile.name}`)
          .getDownloadURL().then(url=>{
            bec[index].value = url;
            bec[index].valueFile = null;
            bec[index].valueUploaded = true;
            this.setState({blogExtraContents: [...bec]})
          })
      })
  }
  removeUploadExtraImage =index=> {
    const imgNameArray = this.state.blogExtraContents[index].value.split('/'),
          imgName = imgNameArray[imgNameArray.length - 1].split('?'),
          imgTrimedName = imgName[0].replace('%2F', '/')
    storage().refFromURL(`gs://developer-wizard.appspot.com/${imgTrimedName}`)
      .delete().then(()=>this.removeExtraBlogField(index));
  }
  moveToQueue =()=> {
    const { bTitle, bSubTitle, blogExtraContents } = this.state;
    firestore().collection('Blogs').add({
      bTitle, bSubTitle, blogExtraContents,
      cName: auth().currentUser.displayName,
      cUid: auth().currentUser.uid,
      cImage: auth().currentUser.photoURL,
      createdOn: Date.now(), views: 0, fav_users: [],
      status: null, report: null, attainedBy: null,
    }).then(()=>{
      this.setState({bTitle: '', bSubTitle: '', blogExtraContents: []});
      this.props.snackbar('BLOG ADDED FOR APPROVAL');
    })
  }

  componentWillMount() {
    onbeforeunload =()=> {
      if(this.state.uploadState) {
        storage().refFromURL(`gs://developer-wizard.appspot.com/courses/${this.state.imageFile.name}`)
          .delete();
      }
    }
  }
  render() {
    const {
      showModal, modalIndex, mData,

      imageState, image, uploadState,
      courseName, description, technologyUsed,
      programme, estimatedTime,
      courseContentBox, preReqBox, youLearnBox,
      textareaCoursePrimaryPreview, withIntern,
      textareaCourseSecondary,
      textareaCourseSecondaryArray,
      textareaLearnPrimaryPreview,
      textareaLearnSecondary,
      textareaLearnSecondaryArray,
      textareaRequirePrimaryPreview,
      textareaRequireSecondary,
      textareaRequireSecondaryArray,

      bTitle, bSubTitle, blogExtraContents,
    } = this.state;
    const { pDetail, adminMssgBox, adminSubmitsBox,
      allTrimmedBlogs, allTrimmedCourss } = this.props;
    return <Fragment>
      <div className="parentGrid">
        <div className="childGrid1">
          <div className="aBlogsAndCourses">
            <div className="aBlogsAndCoursesHead">
              <h3>YOUR COURSES & BLOGS</h3>
            </div>
            <div className="aBlogsAndCoursesBody">
              <div className="aBlogsAndCoursesBoxes">
              {allTrimmedCourss && allTrimmedCourss.map((eCourse, index)=>{
                return <div className="aBlogsAndCoursesBox" key={index}>
                  <div className="aBlogsAndCoursesBoxBack"
                    style={{backgroundImage: `url(${eCourse.image})`}}>
                  </div>
                  <div className="aBlogsAndCoursesBoxFront">
                    <button type="button"
                      onClick={()=>this.setState({
                        showModal: true, modalIndex: 41, mData: {cId: eCourse.id, index}
                      })}
                      style={{backgroundColor: eCourse.status===null?'royalblue':eCourse.status?'green':'red'}}>
                        {eCourse.status===null?<i className="fas fa-question"></i>
                          :eCourse.status?<i className="fas fa-check"></i>:<i className="fas fa-exclamation"></i>}
                    </button>
                  </div>
                </div>
              })}
              </div>
              <div className="aBlogsAndCoursesBoxes">
              {allTrimmedBlogs && allTrimmedBlogs
                .filter(eBlog=>eBlog.cUid===auth().currentUser.uid)
                .map((eBlog, index)=>{
                  return <div className="aBlogsAndCoursesBox" key={index}>
                    <div className="aBlogsAndCoursesBoxBack"
                      style={{backgroundImage: `url(${eBlog.image && eBlog.image.value})`}}>
                    </div>
                    <div className="aBlogsAndCoursesBoxFront">
                      <button type="button"
                        onClick={()=>this.setState({
                          showModal: true, modalIndex: 42, mData: {bId: eBlog.id, index}
                        })}
                        style={{backgroundColor: eBlog.status===null?'royalblue':eBlog.status?'green':'red'}}>
                        {eBlog.status===null?<i className="fas fa-question"></i>
                          :eBlog.status?<i className="fas fa-check"></i>:<i className="fas fa-exclamation"></i>}
                      </button>
                    </div>
                  </div>
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="childGrid2">
          <div className="addCourse">
            <div className="addCourseField">
              <h5>COURSE NAME</h5>
              <input spellCheck="false" type="text" placeholder="COURSE NAME"
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
                <input spellCheck="false" type="file" ref={r=>{this.inputTag=r}}
                  style={{display: 'none'}} onChange={this.imageChanged} />
              </div>
            </div>
            <div className="addCourseField">
              <h5>DESCRIPTION</h5>
              <textarea spellCheck="false" name="description" rows="3"
                placeholder="DESCRIPTION" value={description}
                onChange={this.inputChanged} autoComplete="off" />
            </div>
            <div className="addCourseField">
              <h5>PROGRAMME</h5>
              <select value={programme} name="programme"
                onChange={this.inputChanged}>
                <option value="" disabled>SELECT PROGRAMME</option>
                <option value="course">Course</option>
                <option value="events">Events</option>
                <option value="workShop">WorkShop</option>
              </select>
            </div>
            <div className="addCourseField">
              <div className="acfIntern"
                onClick={()=>this.setState(preState=>{
                  return {withIntern: !preState.withIntern}
                })}>
                <button type="button">
                  {withIntern?<i className="fas fa-check"></i>:null}
                </button>
                <h5>{withIntern?'with':'withOut'} INTERN-SHIP</h5>
              </div>
            </div>
            <div className="addCourseField">
              <h5>TECHNOLOGY USED</h5>
              <input spellCheck="false" type="text" placeholder="TECHNOLOGY USED"
                name="technologyUsed" value={technologyUsed}
                autoComplete="off" onChange={this.inputChanged} />
            </div>
            <div className="addCourseField">
              <h5>ESTIMATED TIME</h5>
              <input spellCheck="false" type="text" placeholder="ESTIMATED TIME"
                name="estimatedTime" value={estimatedTime}
                onChange={this.inputChanged} autoComplete="off" />
            </div>
            <div className="addCourseField">
              <div className="fieldLabelGroup">
                <h5>COURSE CONTENTS</h5>
                <button type="button"
                  onClick={()=>this.addTextareaAddFunc('COURSE_CONTENT')}
                  >ADD</button>
              </div>
              <textarea spellCheck="false" rows="2" placeholder="COURSE PRIMARY CONTENT"
                value={textareaCoursePrimaryPreview} autoComplete="off"
                onChange={e=>this.textareaPrimaryPreview('COURSE_CONTENT', e)} />
              <div className="fieldLabelGroup2">
                <button type="button" onClick={()=>this.textareaArrayPush('COURSE_CONTENT')}
                  disabled={textareaCoursePrimaryPreview!==''?false:true}>
                  <i className="fas fa-plus"></i>
                </button>
                <textarea spellCheck="false" name="textareaCourseSecondary" rows="2"
                  placeholder="COURSE SECONDARY CONTENT" value={textareaCourseSecondary}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <ul>
                <li>
                  <div className="primaryCnt">
                    <p>{textareaCoursePrimaryPreview}</p>
                    <div className="secondaryCnt">
                      {textareaCourseSecondaryArray &&
                        textareaCourseSecondaryArray.map((eEle, index)=>{
                          return <div key={index} onClick={()=>{
                            textareaCourseSecondaryArray.splice(index, 1);
                            this.setState({textareaCourseSecondaryArray})
                          }}>
                            <i className="fas fa-circle"></i>
                            <p>{eEle}</p>
                          </div>
                        })
                      }
                    </div>
                  </div>
                </li>
              </ul>
              <ul>
                {courseContentBox && courseContentBox.map((eCourse, index)=>{
                  return <li key={index}>
                    <div className="primaryCnt">
                      <p onClick={()=>{
                        courseContentBox.splice(index, 1);
                        this.setState({courseContentBox});
                      }}>{eCourse.pri}</p>
                      <div className="secondaryCnt">
                        {eCourse.sec && eCourse.sec.map((eSec, index)=>{
                          return <div key={index}>
                            <i className="fas fa-circle"></i>
                            <p>{eSec}</p>
                          </div>
                        })}
                      </div>
                    </div>
                  </li>
                })}
              </ul>
            </div>
            <div className="addCourseField">
              <div className="fieldLabelGroup">
                <h5>YOU'LL LEARN</h5>
                <button type="button"
                  onClick={()=>this.addTextareaAddFunc('YOU_LEARN')}
                  >ADD</button>
              </div>
              <textarea spellCheck="false" rows="2" placeholder="LEARN PRIMARY CONTENT"
                value={textareaLearnPrimaryPreview} autoComplete="off"
                onChange={e=>this.textareaPrimaryPreview('YOU_LEARN', e)} />
              <div className="fieldLabelGroup2">
                <button type="button" onClick={()=>this.textareaArrayPush('YOU_LEARN')}
                  disabled={textareaLearnPrimaryPreview!==''?false:true}>
                  <i className="fas fa-plus"></i>
                </button>
                <textarea spellCheck="false" name="textareaLearnSecondary" rows="2"
                  placeholder="LEARN SECONDARY CONTENT" value={textareaLearnSecondary}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <ul>
                <li>
                  <div className="primaryCnt">
                    <p>{textareaLearnPrimaryPreview}</p>
                    <div className="secondaryCnt">
                      {textareaLearnSecondaryArray &&
                        textareaLearnSecondaryArray.map((eEle, index)=>{
                          return <div key={index} onClick={()=>{
                            textareaCourseSecondaryArray.splice(index, 1);
                            this.setState({textareaLearnSecondaryArray})
                          }}>
                            <i className="fas fa-circle"></i>
                            <p>{eEle}</p>
                          </div>
                        })
                      }
                    </div>
                  </div>
                </li>
              </ul>
              <ul>
                {youLearnBox && youLearnBox.map((eLearn, index)=>{
                  return <li key={index}>
                    <div className="primaryCnt">
                      <p onClick={()=>{
                        youLearnBox.splice(index, 1);
                        this.setState({youLearnBox});
                      }}>{eLearn.pri}</p>
                      <div className="secondaryCnt">
                        {eLearn.sec && eLearn.sec.map((eSec, index)=>{
                          return <div key={index}>
                            <i className="fas fa-circle"></i>
                            <p>{eSec}</p>
                          </div>
                        })}
                      </div>
                    </div>
                  </li>
                })}
              </ul>
            </div>
            <div className="addCourseField">
              <div className="fieldLabelGroup">
                <h5>PRE REQUIREMENTS</h5>
                <button type="button"
                  onClick={()=>this.addTextareaAddFunc('PRE_REQUIRE')}
                  >ADD</button>
              </div>
              <textarea spellCheck="false" rows="2" placeholder="REQUIRE PRIMARY CONTENT"
                value={textareaRequirePrimaryPreview} autoComplete="off"
                onChange={e=>this.textareaPrimaryPreview('PRE_REQUIRE', e)} />
              <div className="fieldLabelGroup2">
                <button type="button" onClick={()=>this.textareaArrayPush('PRE_REQUIRE')}
                  disabled={textareaRequirePrimaryPreview!==''?false:true}>
                  <i className="fas fa-plus"></i>
                </button>
                <textarea spellCheck="false" name="textareaRequireSecondary" rows="2"
                  placeholder="REQUIRE SECONDARY CONTENT" value={textareaRequireSecondary}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <ul>
                <li>
                  <div className="primaryCnt">
                    <p>{textareaRequirePrimaryPreview}</p>
                    <div className="secondaryCnt">
                      {textareaRequireSecondaryArray &&
                        textareaRequireSecondaryArray.map((eEle, index)=>{
                          return <div key={index} onClick={()=>{
                            textareaRequireSecondaryArray.splice(index, 1);
                            this.setState({textareaRequireSecondaryArray})
                          }}>
                            <i className="fas fa-circle"></i>
                            <p>{eEle}</p>
                          </div>
                        })
                      }
                    </div>
                  </div>
                </li>
              </ul>
              <ul>
                {preReqBox && preReqBox.map((eReq, index)=>{
                  return <li key={index}>
                    <div className="primaryCnt">
                      <p onClick={()=>{
                        preReqBox.splice(index, 1);
                        this.setState({preReqBox});
                      }}>{eReq.pri}</p>
                      <div className="secondaryCnt">
                        {eReq.sec && eReq.sec.map((eSec, index)=>{
                          return <div key={index}>
                            <i className="fas fa-circle"></i>
                            <p>{eSec}</p>
                          </div>
                        })}
                      </div>
                    </div>
                  </li>
                })}
              </ul>
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
                <button type="button" title="HEADING"
                  onClick={()=>this.addExtraBlogField('header')}
                  >H</button>
                <button type="button" title="HEADING"
                  onClick={()=>this.addExtraBlogField('gap')}
                  >G</button>
                <button type="button" title="PARAGRAPH"
                  onClick={()=>this.addExtraBlogField('paragraph')}
                  >P</button>
                <button type="button" title="IMAGE"
                  onClick={()=>this.addExtraBlogField('image')}
                  >I</button>
                <button type="button" title="CODE"
                  onClick={()=>this.addExtraBlogField('code')}
                  >C</button>
              </div>
            </div>
            <div className="cBlogBody" ref={r=>this.cBlogBody=r}>
              <div className="cBlogBodyForm">
                <input spellCheck="false" type="text" name="bTitle" value={bTitle}
                  onChange={this.inputChanged} placeholder="BLOG TITLE" />
                <textarea spellCheck="false" rows="3" name="bSubTitle" value={bSubTitle}
                  onChange={this.inputChanged} placeholder="BLOG SUB-TITLE" />
                {blogExtraContents && blogExtraContents.map((eField, index)=>{
                  return <this.BlogFieldProducer key={index}
                    index={index} type={eField.type} iuState={eField.valueUploaded}
                    image={eField.value} cFunc={this.extraBlogTextChanged}
                    rFunc={()=>this.removeExtraBlogField(index)}
                    uFunc={()=>this.uploadExtraImage(index)}
                    ruImage={()=>this.removeUploadExtraImage(index)} />
                })}
                <button type="button" className="cBlogPublishBtn"
                  onClick={this.moveToQueue}>PUBLISH</button>
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
    adminMssgBox: state.reqArrays.adminMssgBox,
    adminSubmitsBox: state.reqArrays.adminSubmitsBox,
    allTrimmedBlogs: state.reqArrays.allTrimmedBlogs,
    allTrimmedCourss: state.reqArrays.allTrimmedCourss,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    snackbar: payload=>{dispatch({type: 'SNACK_IT', payload})},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserAdmin));