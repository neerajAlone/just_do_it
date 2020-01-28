import React, { Component } from 'react'
import { connect } from 'react-redux';
import { auth, firestore, storage } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import './AdminModalContent.css';
import defaultImage from '../../../../amar/developerWizardsLogoOrange.png';


class AdminModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetBatch: false,
      addOffer: false,
      removeCourse: false,
      password: '', mErrorP: '',
      raEmail: '', raPassword: '',
      replyTextArea: '',

      rpRow: '', rpCol: '',
      rpText: '', rpArray: [],

      // main admin green
      maBatch: '', maCourseFee: '', maCapacity: '',
      maCourseOffer: '', maLocation: '',
      editCourseNBlog: false, report: false,
      blogReporting: false, moveOn: false,
      resCourse: null, maReport: '',
      cImage: null, cImageFile: '',
      cName: '', cDescription: '',
      cTechnologies: '', cTime: '',
      cInternship: null,

      resBlogTitle: '', resBlogSubtitle: '',
      contentFor41: false, contentFor42: false,
      allImageUploaded: false, resBlog: null,
    }
  }
  inputChanged =e=> {
    this.setState({[e.target.name]: e.target.value});
  } 
  componentWillReceiveProps(getProps) {
    const { index, mData, allBlogs, allCourss } = getProps;
    switch(index) {
      case 41:
        if(mData.cId && !this.state.contentFor41){
          let resCourseObject = allCourss.find(eCourseObj=>eCourseObj.id===mData.cId);
          resCourseObject && resCourseObject.courseContentBox
            .forEach((eCnt, index)=>{
              this.state[`coursePri${index+1}`] = '';
              eCnt.sec && eCnt.sec.forEach((eCntSec, index1)=>{
                this.state[`courseSec${index+1}${index1+1}`] = '';
              })
            })
          resCourseObject && resCourseObject.preReqBox
            .forEach((eReq, index)=>{
              this.state[`requirePri${index+1}`] = '';
              eReq.sec && eReq.sec.forEach((eReqSec, index1)=>{
                this.state[`requireSec${index+1}${index1+1}`] = '';
              })
            })
          resCourseObject && resCourseObject.youLearnBox
            .forEach((eLrn, index)=>{
              this.state[`learnPri${index+1}`] = '';
              eLrn.sec && eLrn.sec.forEach((eLrnSec, index1)=>{
                this.state[`learnSec${index+1}${index1+1}`] = '';
              })
            })
          this.setState({resCourse: resCourseObject, contentFor41: true});
        } else {
          let resCourseObject = allCourss.find(eCourseObj=>eCourseObj.id===mData.cId);
          resCourseObject && resCourseObject.courseContentBox
            .forEach((eCnt, index)=>{
              delete this.state[`coursePri${index+1}`];
              eCnt.sec && eCnt.sec.forEach((eCntSec, index1)=>{
                delete this.state[`courseSec${index+1}${index1+1}`];
              })
            })
          resCourseObject && resCourseObject.preReqBox
            .forEach((eReq, index)=>{
              delete this.state[`requirePri${index+1}`];
              eReq.sec && eReq.sec.forEach((eReqSec, index1)=>{
                delete this.state[`requireSec${index+1}${index1+1}`];
              })
            })
          resCourseObject && resCourseObject.youLearnBox
            .forEach((eLrn, index)=>{
              delete this.state[`learnPri${index+1}`];
              eLrn.sec && eLrn.sec.forEach((eLrnSec, index1)=>{
                delete this.state[`learnSec${index+1}${index1+1}`];
              })
            })
        }
      case 42:
        if(mData.bId && !this.state.contentFor42) {
          let resBlogObject = allBlogs.find(eBlogObj=>eBlogObj.id===mData.bId);
          resBlogObject && resBlogObject.blogExtraContents &&
            resBlogObject.blogExtraContents
              .forEach((eContent, index) => {
                switch(eContent.type) {
                  case 'code':
                    this.state[`code${index}`] = '';
                    break;
                  case 'header':
                    this.state[`header${index}`] = '';
                    break;
                  case 'image':
                    this.state[`image${index}`] = null;
                    this.state[`imageFile${index}`] = null;
                    break;
                  case 'paragraph':
                    this.state[`paragraph${index}`] = '';
                    break;
                }
              });
          this.setState({resBlog: resBlogObject, contentFor42: true});
        } else {
          let resBlogObject = allBlogs.find(eBlogObj=>eBlogObj.id===mData.bId);
          resBlogObject && resBlogObject.blogExtraContents &&
            resBlogObject.blogExtraContents
              .forEach((eContent, index) => {
                switch(eContent.type) {
                  case 'code':
                    delete this.state[`code${index}`];
                    break;
                  case 'header':
                    delete this.state[`header${index}`]
                    break;
                  case 'image':
                    delete this.state[`image${index}`];
                    delete this.state[`imageFile${index}`];
                    break;
                  case 'paragraph':
                    delete this.state[`paragraph${index}`];
                    break;
                }
              });
        }
        break;
      case 101:
        let resBlogObject = allBlogs.find(eBlogObj=>eBlogObj.id===mData.bId);
        this.setState({resBlog: resBlogObject});
        break;
      case 102:
        let resCourseObject = allCourss.find(eCourseObj=>eCourseObj.id===mData.cId);
        this.setState({resCourse: resCourseObject});
        break;
      default:
        this.setState({
          resBlog: null, resCourse: null, contentFor41: false,
          contentFor42: false, editCourseNBlog: false,
          cInternship: null, cName: '', cTechnologies: '',
          cTime: '', cImage: null, cImageFile: null,
          cDescription: '', resBlogTitle: '', resBlogSubtitle: '',
          allImageUploaded: false, report: false,
          maBatch: '', maCapacity: '', maCourseFee: '',
          maCourseOffer: '', maLocation: '',
        })
    }
  }

  // 5
  replyToComment =(pObj, mssg, cFunc)=> {
    Promise.all([
      firestore().collection('Courses').doc(pObj.c_id)
        .collection('conversations').doc(Date.now().toString())
        .set({
          uid: auth().currentUser.uid, mssg, to: pObj.to,
          username: auth().currentUser.displayName,
          image: auth().currentUser.photoURL
        }),
      firestore().collection('User-Admin').doc(auth().currentUser.uid)
        .collection('conversations').doc(pObj.time)
        .update({replied: mssg})
    ]).then(()=>{
      this.setState({replyTextArea: ''});
      cFunc();
    })
  }
  // main admin green
  addReport =(collection, resId, index)=> {
    firestore().collection(collection)
      .doc(resId).update({
        attainedBy: auth().currentUser.uid,
        status: false, report: this.state.maReport
      }).then(()=>{
        this.setState({maReport: ''});
        if(collection === 'Blogs') {
          this.props.allTrimmedBlogs.splice(index, 1);
          this.props.getAllTrimmedBlogs(this.props.allTrimmedBlogs);
        } else {
          this.props.allTrimmedCourss.splice(index);
          this.props.getAllTrimmedCourss(this.props.allTrimmedCourss);
        }
        this.props.cFunc();
      })
  }
  approveUserAdminCnt =(col, id, index)=> {
    if(col === 'Blogs') { firestore().collection(col)
      .doc(id).update({ status: true,
        attainedBy: auth().currentUser.uid
      }).then(()=>{
        this.props.allTrimmedBlogs.splice(index, 1);
        this.props.getAllTrimmedBlogs(this.props.allTrimmedBlogs);
        this.props.cFunc();
      })
    } else { 
      const { maBatch, maCapacity, maCourseFee,
        maCourseOffer, maLocation} = this.state;
      firestore().collection(col)
        .doc(id).update({ status: true, location: maLocation,
          attainedBy: auth().currentUser.uid,
          batch: maBatch, batchCapacity: maCapacity,
          courseFee: maCourseFee, courseOffer: maCourseOffer,
        }).then(()=>{
          this.props.allTrimmedCourss.splice(index, 1);
          this.props.getAllTrimmedCourss(this.props.allTrimmedCourss);
          this.props.cFunc();
        })
    }
  }

  // user admin blue
  cImageChanged =e=> {
    let file = e.target.files[0],
        reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload =()=> {
      this.setState({cImage: reader.result});
    }
    this.setState({cImageFile: file});
  }

  cabImageChanged =(e, index)=> {
    let file = e.target.files[0],
        reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload =()=> {
      this.setState({[`image${index}`]: reader.result});
    }
    this.setState({[`imageFile${index}`]: file})
  }
  saveCabImage =(img)=> {
    const storageRef = 'gs://developer-wizard.appspot.com/';
    let imgRouteArray = img.toString().split('/'),
        imageName = imgRouteArray[imgRouteArray.length-1].split('?')[0],
        trimedImg = imageName.replace('%2F', '/');
    return storage().refFromURL(storageRef+trimedImg).delete()
  }
  updateBlogEdit =(index)=> {
    const { resBlogTitle, resBlogSubtitle, resBlog } = this.state;
    const storageRef = 'gs://developer-wizard.appspot.com/Blogs/';
    let newBlogExtraContents = [], uploadFuncArray = [], imageUrlArray = [];
    resBlog.blogExtraContents &&
      resBlog.blogExtraContents
        .forEach((eContent, index)=>{
          switch(eContent.type){
            case 'code':
              if(this.state[`code${index}`]){
                newBlogExtraContents.push({type: eContent.type, value: this.state[`code${index}`]})
              } else {
                newBlogExtraContents.push({type: eContent.type, value: eContent.value})
              }
              break;
            case 'gap':
              newBlogExtraContents.push({type: eContent.type});
              break;
            case 'header':
              if(this.state[`code${index}`]){
                newBlogExtraContents.push({type: eContent.type, value: this.state[`header${index}`]})
              } else {
                newBlogExtraContents.push({type: eContent.type, value: eContent.value})
              }
              break;
            case 'image':
              if(this.state[`image${index}`]){
                newBlogExtraContents.push({
                  type: eContent.type, value: this.state[`image${index}`], index,
                  valueFile: this.state[`imageFile${index}`], valueChanged: true})
                uploadFuncArray.push(()=>this.saveCabImage(eContent.value));
              } else {
                newBlogExtraContents.push({type: eContent.type, value: eContent.value, valueFile: null, valueChanged: false})
              }
              break;
            case 'paragraph':
              if(this.state[`paragraph${index}`]){
                newBlogExtraContents.push({type: eContent.type, value: this.state[`paragraph${index}`]})
              } else {
                newBlogExtraContents.push({type: eContent.type, value: eContent.value})
              }
              break;
          }
        })
    
    newBlogExtraContents
      .filter(eContent=>eContent.type==='image' && eContent.valueChanged)
      .forEach(eImage=>{
        const trimmedDate = Date.now().toString().slice(7, 13);
        let iFile = this.state[`imageFile${eImage.index}`];
        if(eImage.valueChanged) {
          uploadFuncArray.push(()=>storage()
            .refFromURL(`${storageRef}${iFile.name}-${trimmedDate}`)
            .put(iFile).then(()=>storage()
              .refFromURL(`${storageRef}${iFile.name}-${trimmedDate}`)
              .getDownloadURL().then(url=>{
                this.setState({[`imageFile${eImage.index}`]: null});
                imageUrlArray.push({index: eImage.index, url});
              })
            ))
        }
      })
    Promise.all(uploadFuncArray.map(eF=>eF()))
      .then(()=>{ imageUrlArray.forEach(eUrl=>{
          newBlogExtraContents[eUrl.index] = {
            type: 'image', value: eUrl.url,
            valueFile: null, valueUploaded: true }
        })
        return newBlogExtraContents;
      }).then(nbec=>{
        firestore().collection('Blogs')
          .doc(resBlog.id).update({
            bTitle: resBlogTitle?resBlogTitle:resBlog.bTitle,
            bSubTitle: resBlogSubtitle?resBlogSubtitle:resBlog.bSubTitle,
            blogExtraContents: nbec?nbec:resBlog.blogExtraContents,
            report: null, attainedBy: null, status: null
          }).then(()=>{
            // allTrimmedBlogs
            let imageObject = nbec.find(eC=>eC.type==='image'),
                oldTrimmedBlog = this.props.allTrimmedBlogs[index];
            oldTrimmedBlog.title = resBlogTitle?resBlogTitle:oldTrimmedBlog.title;
            oldTrimmedBlog.subTitle = resBlogSubtitle?resBlogSubtitle:oldTrimmedBlog.subTitle;
            oldTrimmedBlog.image = imageObject.value?imageObject:oldTrimmedBlog.image;
            oldTrimmedBlog.status = null
            this.props.getAllTrimmedBlogs(this.props.allTrimmedBlogs);

            // allBlogs
            let oldAllBlog = this.props.allBlogs[index];
            oldAllBlog.bTitle = resBlogTitle?resBlogTitle:oldTrimmedBlog.title;
            oldAllBlog.bSubTitle = resBlogSubtitle?resBlogSubtitle:oldTrimmedBlog.subTitle;
            oldAllBlog.blogExtraContents = nbec;
            oldAllBlog.report = null; oldAllBlog.attainedBy = null; oldAllBlog.status = null;
            this.props.getAllBlogs(this.props.allBlogs);

            this.props.cFunc();
          })
      });
  }
  updateCourseEdit =(index)=> {
    const { cImageFile, cName, cDescription, cInternship,
      cTechnologies, cTime, resCourse } = this.state;
    let newCourseContentBox = [], newPreReqBox = [], newYouLearnBox = [];
    resCourse.courseContentBox &&
      resCourse.courseContentBox
        .forEach((eCourseCnt, index)=>{
          let newCourseContentSecBox = []
          eCourseCnt.sec && eCourseCnt.sec.forEach((eSec, index1)=>{
            if(this.state[`courseSec${index+1}${index1+1}`]) {
              newCourseContentSecBox.push(this.state[`courseSec${index+1}${index1+1}`])
            } else newCourseContentSecBox.push(eSec);
          })
          if(this.state[`coursePri${index+1}`]) {
            newCourseContentBox.push({
              pri: this.state[`coursePri${index+1}`],
              sec: newCourseContentSecBox
            })
          } else {
            newCourseContentBox.push({
              pri: eCourseCnt.pri,
              sec: newCourseContentSecBox
            })
          }
        })
    resCourse.preReqBox &&
      resCourse.preReqBox
        .forEach((eRequireCnt, index)=>{
          let newPreReqSecBox = [];
          eRequireCnt.sec && eRequireCnt.sec.forEach((eSec, index1)=>{
            if(this.state[`requireSec${index+1}${index1+1}`]) {
              newPreReqSecBox.push(this.state[`requireSec${index+1}${index1+1}`])
            } else newPreReqSecBox.push(eSec);
          })
          if(this.state[`requirePri${index+1}`]) {
            newPreReqBox.push({
              pri: this.state[`requirePri${index+1}`],
              sec: newPreReqSecBox
            })
          } else {
            newPreReqBox.push({
              pri: eRequireCnt.pri,
              sec: newPreReqSecBox
            })
          }
        })
    resCourse.youLearnBox &&
      resCourse.youLearnBox
        .forEach((eLearnCnt, index)=>{
          let newYouLearnSecBox = [];
          eLearnCnt.sec && eLearnCnt.sec.forEach((eSec, index1)=>{
            if(this.state[`learnSec${index+1}${index1+1}`]) {
              newYouLearnSecBox.push(this.state[`learnSec${index+1}${index1+1}`])
            } else newYouLearnSecBox.push(eSec);
          })
          if(this.state[`learnPri${index+1}`]) {
            newYouLearnBox.push({
              pri: this.state[`learnPri${index+1}`],
              sec: newYouLearnSecBox
            })
          } else {
            newYouLearnBox.push({
              pri: eLearnCnt.pri,
              sec: newYouLearnSecBox
            })
          }
        })
    if(cImageFile) {
      let storageRef = 'gs://developer-wizard.appspot.com/courses/',
          trimmedDate = Date.now().toString().slice(7, 13);
      this.saveCabImage(resCourse.image)
        .then(()=>storage().refFromURL(`${storageRef}${cImageFile.name}-${trimmedDate}`).put(cImageFile))
        .then(()=>storage().refFromURL(`${storageRef}${cImageFile.name}-${trimmedDate}`).getDownloadURL())
        .then(url=>{ firestore()
          .collection('Courses').doc(this.props.mData.cId).update({
            attainedBy: null, courseContentBox: newCourseContentBox,
            courseName: cName?cName:resCourse.courseName,
            description: cDescription?cDescription:resCourse.description,
            estimatedTime: cTime?cTime:resCourse.estimatedTime,
            image: url, preReqBox: newPreReqBox, report: null, status: null,
            technologyUsed: cTechnologies?cTechnologies:resCourse.technologyUsed,
            withIntern: cInternship!==null?cInternship:resCourse.withIntern,
            youLearnBox: newYouLearnBox,
          }).then(()=>{
            let oldTrimmedCourss = this.props.allTrimmedCourss[index],
                oldAllCourss = this.props.allCourss[index];
            oldTrimmedCourss.image = url; oldTrimmedCourss.status = null;
            oldTrimmedCourss.courseName = cName?cName:resCourse.courseName;
            this.props.getAllTrimmedCourss(this.props.allTrimmedCourss);

            oldAllCourss.attainedBy = null; oldAllCourss.image = url;
            oldAllCourss.courseContentBox = newCourseContentBox;
            oldAllCourss.courseName = cName?cName:resCourse.courseName;
            oldAllCourss.description = cDescription?cDescription:resCourse.description;
            oldAllCourss.estimatedTime = cTime?cTime:resCourse.estimatedTime;
            oldAllCourss.preReqBox = newPreReqBox; oldAllCourss.report = null;
            oldAllCourss.status = null; oldAllCourss.youLearnBox = newYouLearnBox;
            oldAllCourss.technologyUsed = cTechnologies?cTechnologies:resCourse.technologyUsed;
            oldAllCourss.withIntern = cInternship!==null?cInternship:resCourse.withIntern;
            this.props.getAllCourss(this.props.allCourss);

            this.props.cFunc();
          })
        })
    } else { firestore()
      .collection('Courses').doc(this.props.mData.cId).update({
        attainedBy: null, courseContentBox: newCourseContentBox,
        courseName: cName?cName:resCourse.courseName,
        description: cDescription?cDescription:resCourse.description,
        estimatedTime: cTime?cTime:resCourse.estimatedTime, status: null,
        image: resCourse.image, preReqBox: newPreReqBox, report: null,
        technologyUsed: cTechnologies?cTechnologies:resCourse.technologyUsed,
        withIntern: cInternship!==null?cInternship:resCourse.withIntern,
        youLearnBox: newYouLearnBox,
      }).then(()=>{
        let oldTrimmedCourss = this.props.allTrimmedCourss[index],
            oldAllCourss = this.props.allCourss[index];
        oldTrimmedCourss.image = resCourse.image; oldTrimmedCourss.status = null;
        oldTrimmedCourss.courseName = cName?cName:resCourse.courseName;
        this.props.getAllTrimmedCourss(this.props.allTrimmedCourss);

        oldAllCourss.attainedBy = null; oldAllCourss.image = resCourse.image;
        oldAllCourss.courseContentBox = newCourseContentBox;
        oldAllCourss.courseName = cName?cName:resCourse.courseName;
        oldAllCourss.description = cDescription?cDescription:resCourse.description;
        oldAllCourss.estimatedTime = cTime?cTime:resCourse.estimatedTime;
        oldAllCourss.preReqBox = newPreReqBox; oldAllCourss.report = null;
        oldAllCourss.status = null; oldAllCourss.youLearnBox = newYouLearnBox;
        oldAllCourss.technologyUsed = cTechnologies?cTechnologies:resCourse.technologyUsed;
        oldAllCourss.withIntern = cInternship!==null?cInternship:resCourse.withIntern;
        this.props.getAllCourss(this.props.allCourss);

        this.props.cFunc();
      })

    }
  }

  render() {
    const { 
      replyTextArea,
      raEmail, raPassword, mErrorP,
      rpRow, rpCol, rpText, rpArray,

      editCourseNBlog, report, cImage,
      blogReporting, moveOn, maCapacity,
      maBatch, maCourseFee, maReport,
      maCourseOffer, maLocation,
      resCourse, cInternship, cName,
      cDescription, cTechnologies, cTime,

      resBlogTitle, resBlogSubtitle, resBlog,
    } = this.state;
    const { mData, cFunc } = this.props;
    switch(this.props.index) {
      case 2:
        return <div className="addCourseInfoList">
          <h1>TO ADD COURSE</h1>
          <ul>
            <li>
              <i className="fas fa-check"></i>
              <p>Every <b>field</b> should be <b>filled</b>.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>CourseName</b> should have length <b> >= 7</b>.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>Description</b> should have <b>atleast 10 words</b>.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>Category</b> should contain <b>Web Development</b> or <b>Computer Science</b> word init.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>CourseFee</b> should be <b>Number</b> with <b>3 to 6 digits</b>.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>Offer</b> should be <b>Number</b> with <b>1 to 2 digits</b>.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>Level</b> should contain <b>Beginner</b> or <b>Intermediate</b> or <b>Advanced</b> word init.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>Programme</b> should contain <b>Intership</b> or <b>Workshop</b> word init.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>CompletesIn</b> should be <b>Number</b> with <b>1 to 2 digits</b>.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>Location</b> should have <b>atleast 2 words</b>.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>StartsFrom</b> should match <b>dd-mm-yyyy hrs:min AM|PM</b> pattern.</p>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <p><b>CourseContentBox</b>, <b>YouLearnBox</b>, <b>PreRequirementBox</b> should have <b>atleast 4 lines</b>.</p>
            </li>
          </ul>
        </div>
      case 41:
        return <div className="courseNblog">
          <div className="courseNblogCnt">
            <div className="courseNblogBox" title="CATEGORY">
              <i className="fas fa-layer-group"></i>
              <h5>Course</h5>
            </div>
          </div>
          <div className="courseNblogCnt">
            <div className="courseNblogBox" title="STATUS">
              <i className="fas fa-lightbulb"></i>
              <h5>{resCourse && resCourse.report===null?'Not-Seen':resCourse && resCourse.report?'Approved':'Dis-Approved'}</h5>
            </div>
            {resCourse && resCourse.report?
              <button type="button"
                onClick={()=>this.setState(preState=>{
                  return { report: !preState.report }
                })}>REPORT</button>:null
            }
          </div>
          {report?
            <textarea placeholder="REPORT" rows="6"
              value={resCourse && resCourse.report}
              disabled className="courseNblogTextarea" />:
            <div></div>
          }
          <div className="courseNblogCnt">
            <div className="courseNblogBox" title="NAME">
              <i className="fas fa-bookmark"></i>
              <h5>{resCourse && resCourse.courseName}</h5>
            </div>
          </div>
          <div className="cabEditRoom">
            {(!editCourseNBlog && resCourse)?
              <button type="button" className="courseNblogEditBtn"
                onClick={()=>this.setState({editCourseNBlog: true})}>
                <h5>EDIT</h5><i className="fas fa-pencil-alt"></i>
              </button>:
              <div className="cabEditRoomForm">
                <div className="cabEditRoomField">
                  <div className="cabImageContainer">
                    <div className="cabImageBox">
                      <img src={cImage?cImage:(resCourse && resCourse.image)} alt="" />
                    </div>
                    <div className="cabImageCntrl">
                      <input type="file" style={{display: 'none'}}
                        ref={r=>this.cabFileInput=r}
                        onChange={this.cImageChanged} />
                      {cImage?
                        <div className="cabImageCntrlBtns">
                          <button type="button" style={{backgroundColor: 'red'}}
                            onClick={()=>{ this.cabFileInput.value = '';
                              this.setState({cImage: null, cImageFile: null});
                            }}>TRY OTHER</button>
                        </div>:
                        <div className="cabImageCntrlBtns">
                          <button type="button"
                            style={{backgroundColor: 'royalblue'}}
                            onClick={()=>this.cabFileInput.click()}
                            >UPLOAD NEW</button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="cabEditRoomField">
                  <h5>COURSE NAME</h5>
                  <input type="text" placeholder="COURSE NAME"
                    name="cName" onChange={this.inputChanged}
                    value={cName?cName:(resCourse && resCourse.courseName)} />
                </div>
                <div className="cabEditRoomField">
                  <h5>DESCRIPTION</h5>
                  <textarea rows="3" placeholder="DESCRIPTION"
                    name="cDescription" onChange={this.inputChanged}
                    value={cDescription?cDescription:(resCourse && resCourse.description)} />
                </div>
                <div className="cabEditRoomField">
                  <div className="acfIntern"
                    onClick={()=>{
                      if(cInternship===null) this.setState({cInternship: resCourse && !resCourse.withIntern})
                        else this.setState(preState=>{return {cInternship: !preState.cInternship}})
                    }}>
                    <button type="button">
                      {(cInternship!==null?cInternship:(resCourse && resCourse.withIntern))?
                      <i className="fas fa-check"></i>:null}
                    </button>
                    <h5>{(cInternship!==null?cInternship:(resCourse && resCourse.withIntern))?
                      'with':'withOut'} INTERN-SHIP</h5>
                  </div>
                </div>
                <div className="cabEditRoomField">
                  <h5>TECHNOLOGY USED</h5>
                  <input type="text" placeholder="TECHNOLOGY USED"
                    name="cTechnologies" onChange={this.inputChanged}
                    value={cTechnologies?cTechnologies:(resCourse && resCourse.technologyUsed)} />
                </div>
                <div className="cabEditRoomField">
                  <h5>ESTIMATED TIME</h5>
                  <input type="text" placeholder="in HRS"
                    name="cTime" onChange={this.inputChanged}
                    value={cTime?cTime:(resCourse && resCourse.estimatedTime)} />
                </div>
                <div className="cabEditRoomField">
                  <h5>COURSE CONTENT</h5>
                  {resCourse && resCourse.courseContentBox
                    && resCourse.courseContentBox.map((eCourse, index)=>{
                      return <div className="cabEditRoomFieldTa" key={index}>
                        <textarea rows="1" placeholder="COURSE PRIMARY CONTENT"
                          name={`coursePri${index+1}`} onChange={this.inputChanged}
                          value={this.state[`coursePri${index+1}`]?
                            this.state[`coursePri${index+1}`]:eCourse.pri} />
                        <div className="cabEditRoomFieldTa2">
                          {eCourse.sec && eCourse.sec.map((eSec, index1)=>{
                            return <textarea rows="2" key={index+index1}
                              placeholder="COURSE SECONDARY CONTENT"
                              name={`courseSec${index+1}${index1+1}`} onChange={this.inputChanged}
                              value={this.state[`courseSec${index+1}${index1+1}`]?
                                this.state[`courseSec${index+1}${index1+1}`]:eSec} />
                          })}
                        </div>
                      </div>
                    })
                  }
                </div>
                <div className="cabEditRoomField">
                  <h5>YOU'LL LEARN</h5>
                  {resCourse && resCourse.youLearnBox
                    && resCourse.youLearnBox.map((eLearn, index)=>{
                      return <div className="cabEditRoomFieldTa" key={index}>
                        <textarea rows="2" placeholder="LEARN PRIMARY CONTENT"
                          name={`learnPri${index+1}`} onChange={this.inputChanged}
                          value={this.state[`learnPri${index+1}`]?
                            this.state[`learnPri${index+1}`]:eLearn.pri} />
                        <div className="cabEditRoomFieldTa2">
                          {eLearn.sec && eLearn.sec.map((eSec, index1)=>{
                            return <textarea rows="2" key={index+index1}
                              placeholder="LEARN SECONDARY CONTENT"
                              name={`learnSec${index+1}${index1+1}`} onChange={this.inputChanged}
                              value={this.state[`learnSec${index+1}${index1+1}`]?
                                this.state[`learnSec${index+1}${index1+1}`]:eSec} />
                          })}
                        </div>
                      </div>
                    })
                  }
                </div>
                <div className="cabEditRoomField">
                  <h5>PRE REQUIREMENTS</h5>
                  {resCourse && resCourse.preReqBox
                    && resCourse.preReqBox.map((eRequire, index)=>{
                      return <div className="cabEditRoomFieldTa" key={index}>
                        <textarea rows="2" placeholder="REQUIRE PRIMARY CONTENT"
                          name={`requirePri${index+1}`} onChange={this.inputChanged}
                          value={this.state[`requirePri${index+1}`]?
                            this.state[`requirePri${index+1}`]:eRequire.pri} />
                        <div className="cabEditRoomFieldTa2">
                          {eRequire.sec && eRequire.sec.map((eSec, index1)=>{
                            return <textarea rows="2" key={index+index1}
                              placeholder="REQUIRE SECONDARY CONTENT"
                              name={`requireSec${index+1}${index1+1}`} onChange={this.inputChanged}
                              value={this.state[`requireSec${index+1}${index1+1}`]?
                                this.state[`requireSec${index+1}${index1+1}`]:eSec} />
                          })}
                        </div>
                      </div>
                    })
                  }
                </div>
                <div className="cabEditRoomBtns">
                  <button type="button"
                    style={{backgroundColor: 'red'}}
                    onClick={()=>{ this.cabFileInput.value = '';
                      this.setState({ editCourseNBlog: false,
                        cImage: null,cImageFile: null})
                    }}>CANCEL EDIT</button>
                  <button type="button"
                    style={{backgroundColor: 'green'}}
                    onClick={()=>this.updateCourseEdit(mData.index)}
                    >UPDATE EDIT</button>
                </div>
              </div>
            }
          </div>
        </div>
      case 42:
        return <div className="blogNcourse">
          <div className="courseNblogCnt">
            <div className="blogNcourseBox" title="CATEGORY">
              <i className="fas fa-layer-group"></i>
              <h5>Blog</h5>
            </div>
          </div>
          <div className="courseNblogCnt">
            <div className="blogNcourseBox" title="STATUS">
              <i className="fas fa-lightbulb"></i>
              <h5>{resBlog && resBlog.report===null?'Not-Seen':resBlog && resBlog.report?'Approved':'Dis-Approved'}</h5>
            </div>
            {resBlog && resBlog.report?
              <button type="button"
                onClick={()=>this.setState(preState=>{
                  return { report: !preState.report }
                })}>REPORT</button>:null
            }
          </div>
          {report?
            <textarea placeholder="REPORT" rows="6"
              value={resBlog && resBlog.report}
              disabled className="courseNblogTextarea" />:
            <div></div>
          }
          <div className="courseNblogCnt">
            <div className="blogNcourseBox" title="NAME">
              <i className="fas fa-bookmark"></i>
              <h5>Blog Name</h5>
            </div>
          </div>
          <div className="cabEditRoom">
            {(!editCourseNBlog && resBlog)?
              <button type="button" className="courseNblogEditBtn"
                onClick={()=>this.setState({editCourseNBlog: true})}>
                <h5>EDIT</h5><i className="fas fa-pencil-alt"></i>
              </button>:
              <div className="cabEditRoomForm">
                <div className="cabEditRoomField">
                  <h5>BLOG TITLE</h5>
                  <input type="text" placeholder="BLOG TITLE"
                    name="resBlogTitle" onChange={this.inputChanged}
                    value={resBlogTitle?resBlogTitle:resBlog && resBlog.bTitle} />
                </div>
                <div className="cabEditRoomField">
                  <h5>BLOG SUBTITLE</h5>
                  <textarea rows="3" placeholder="BLOG SUBTITLE"
                    name="resBlogSubtitle" onChange={this.inputChanged}
                    value={resBlogSubtitle?resBlogSubtitle:resBlog && resBlog.bSubTitle} />
                </div>
                {resBlog.blogExtraContents &&
                  resBlog.blogExtraContents.map((eContent, index)=>{
                    switch(eContent.type) {
                      case 'code':
                        return <div className="cabEditRoomField" key={index}>
                          <h5>BLOG CODE</h5>
                          <textarea rows={eContent.value.split(/\r|\r\n|\n/).length}
                            placeholder="BLOG CODE" name={`code${index}`}
                            value={this.state[`code${index}`]?this.state[`code${index}`]:eContent.value}
                            onChange={this.inputChanged} spellCheck="false" />
                        </div>
                      case 'header':
                        return <div className="cabEditRoomField" key={index}>
                          <h5>BLOG HEADER</h5>
                          <input type="text" placeholder="BLOG HEADER" spellCheck="false"
                            name={`header${index}`} onChange={this.inputChanged}
                            value={this.state[`header${index}`]?this.state[`header${index}`]:eContent.value} />
                        </div>
                      case 'image':
                        return <div className="cabEditRoomField" key={index}>
                          <div className="cabImageContainer">
                            <div className="cabImageBox">
                              <img src={this.state[`image${index}`]?this.state[`image${index}`]:eContent.value} alt="" />
                            </div>
                            <div className="cabImageCntrl">
                              <input type="file" style={{display: 'none'}}
                                ref={r=>this[`cabFileInput${index}`]=r}
                                onChange={e=>this.cabImageChanged(e, index)} />
                              {this.state[`image${index}`]?
                                <div className="cabImageCntrlBtns">
                                  <button type="button" style={{backgroundColor: 'red'}}
                                    onClick={()=>{ this[`cabFileInput${index}`].value = '';
                                      this.setState({[`image${index}`]: null, [`imageFile${index}`]: null});
                                    }}>TRY OTHER</button>
                                </div>:
                                <div className="cabImageCntrlBtns">
                                  <button type="button"
                                    style={{backgroundColor: 'royalblue'}}
                                    onClick={()=>this[`cabFileInput${index}`].click()}
                                    >UPLOAD NEW</button>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      case 'paragraph':
                        return <div className="cabEditRoomField" key={index}>
                          <h5>BLOG PARAGRAPGH</h5>
                          <textarea rows="6" placeholder="BLOG PARAGRAPH" name={`paragraph${index}`}
                            value={this.state[`paragraph${index}`]?this.state[`paragraph${index}`]:eContent.value}
                            onChange={this.inputChanged} spellCheck="false" />
                        </div>
                      default:
                        return null
                    }
                  })}
                <div className="cabEditRoomBtns">
                  <button type="button"
                    style={{backgroundColor: 'red'}}
                    onClick={()=>this.setState({editCourseNBlog: false})}
                    >CANCEL EDIT</button>
                  <button type="button"
                    style={{backgroundColor: 'green'}}
                    onClick={()=>this.updateBlogEdit(mData.index)}
                    >UPDATE EDIT</button>
                </div>
              </div>
            }
          </div>
        </div>
      case 5:
        return <div className="replyToStudent">
          <h1>REPLYING</h1>
          <h3>To, {mData.to}</h3>
          <textarea rows="10" placeholder="Your Mssg..." value={replyTextArea}
            onChange={e=>this.setState({replyTextArea: e.target.value})} />
          <button type="button"
            onClick={()=>this.replyToComment(mData, replyTextArea, cFunc)}
            >SEND</button>
        </div>
      case 7:
        return <div className="confirmAdminRemove">
          <h4>Really, then confirm !!!</h4>
          <div className="maConfirmForm">
            <div className="formField">
              <h5>EMAIL</h5>
              <input type="email" placeholder="EMAIL"
                value={raEmail} onChange={this.inputChanged}
                name="raEmail" autoComplete="off" />
            </div>
            <div className="formField">
              <h5>PASSWORD</h5>
              <input type="password" placeholder="PASSWORD"
                value={raPassword} onChange={this.inputChanged}
                name="raPassword" autoComplete="off" />
            </div>
            <div className="formField">
              <button type="button">CONFIRM</button>
            </div>
          </div>
        </div>
      case 9:
        return <div className="submitReport">
          <div className="submitReportHead">
            <h2>SUBMIT REPORT</h2>
            <p>for</p>
            <div className="submitReportHead1">
              <div className="submitReportHead1Img"></div>
              <div>
                <h5>Username</h5>
                <h5>Filename.git</h5>
              </div>
            </div>
          </div>
          <div className="submitReportBody">
            <div className="submitReportBody1"
              ref={r=>this.reportArray=r}>
              <div className="eachReportBox">
                <div className="eachReportrc">
                  <h5>0000</h5>
                  <h5>00</h5>
                </div>
                <div className="eachReportPre">
                  Ehe paragraph is a self-contained unit of a
                  discourse in writing dealing with a
                  particular point or idea.
                </div>
                <button type="button">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
              {rpArray && rpArray.map((eReport, index)=>{
                return <div className="eachReportBox"
                  key={index}>
                  <div className="eachReportrc">
                    <h5>{eReport.rpRow}</h5>
                    <h5>{eReport.rpCol}</h5>
                  </div>
                  <button type="button" onClick={()=>{
                    this.setState(preState=>{
                      preState.rpArray.splice(index, 1)
                      return { rpArray: [...preState.rpArray] }
                    })
                    }}> <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              })}
            </div>
            <div className="submitReportBody2">
              <div className="submitReportBody21">
                <input type="text" placeholder="ROW"
                  name="rpRow" value={rpRow}
                  onChange={this.inputChanged} />
                <input type="text" placeholder="COL"
                  name="rpCol" value={rpCol}
                  onChange={this.inputChanged} />
                <button type="button" onClick={this.addReport}>ADD</button>
              </div>
              <textarea rows="5" placeholder="REPORT"
                name="rpText" value={rpText}
                onChange={this.inputChanged} />
            </div>
            <div className="submitReportBody3">
              <button type="button">CANCEL</button>
              <button type="button" onClick={this.coverting2Html}
                >REPORT</button>
            </div>
          </div>
        </div>
      case 101:
        return <div className="maBlogConfirmation">
          <div className="maBlogDetails">
            <h3>{resBlog && resBlog.bTitle}</h3>
            <h4>{resBlog && resBlog.bSubTitle}</h4>
            {resBlog && resBlog.blogExtraContents &&
              resBlog.blogExtraContents.map((eBlog, index)=>{
                switch(eBlog.type) {
                  case 'code':
                    return <textarea rows={eBlog.value.split(/\r|\r\n|\n/).length}
                      value={eBlog.value} key={index} disabled />
                  case 'gap':
                    return <div className="maBlogGap" key={index}></div>
                  case 'header':
                    return <b key={index}>{eBlog.value}</b>
                  case 'image':
                    return <div className="maBlogImage" key={index}>
                      <img src={eBlog.value} alt="" />
                    </div>
                  case 'paragraph':
                    return <p key={index}>{eBlog.value}</p>
                  default:
                    return null
                }
              })
            }
          </div>
          <div className="maBlogFoot">
            {!blogReporting?
              <div className="maBlogResButns">
                <button type="button"
                  onClick={()=>this.setState({blogReporting: true})}
                  >REPORT</button>
                <button type="button"
                  onClick={()=>this.approveUserAdminCnt('Blogs', mData.bId, mData.index)}
                  >APPROVE</button>
              </div>:
              <div className="maBlogFoot1">
                <textarea rows="8" name="maReport" value={maReport}
                  placeholder="Report Here ..."
                  onChange={this.inputChanged} />
                <div className="maBlogResButns">
                  <button type="button"
                    onClick={()=>this.setState({blogReporting: false})}
                    >CANCEL</button>
                  <button type="button"
                    onClick={()=>this.addReport('Blogs', mData.bId, mData.index)}
                    >REPORT</button>
                </div>
              </div>
            }
          </div>
        </div>
      case 102:
        return <div className="maCourseConfirmation">
          <div className="maCourseDetails">
            <h2>{resCourse && resCourse.courseName}</h2>
            <div className="maBlogImage">
              <img src={resCourse && resCourse.image} alt="" />
            </div>
            <p>{resCourse && resCourse.description}</p>
          </div>
          <div className="maCourseBox">
            <h5>PROGRAMME</h5>
            <p>{resCourse && resCourse.programme.toUpperCase()}</p>
          </div>
          <div className="maCourseBox">
            <h5>INTERSHIP</h5>
            <p>{resCourse && resCourse.withIntern?'Available':'Not-Available'}</p>
          </div>
          <div className="maCourseBox">
            <h5>TECHNOLOGY USED</h5>
            <p>{resCourse && resCourse.technologyUsed}</p>
          </div>
          <div className="maCourseBox">
            <h5>ESTIMATED TIME</h5>
            <p>{resCourse && resCourse.estimatedTime} Hrs</p>
          </div>
          <div className="maCourseBox maCourseBox1">
            <h5>COURSE CONTENT</h5>
            {resCourse && resCourse.courseContentBox
              && resCourse.courseContentBox.map((eCourse, index)=>{
                return <div key={index}>
                  <p>{eCourse.pri}</p>
                  <ul>
                  {eCourse.sec && eCourse.sec.map((eSec, index)=>{
                    return <li key={index}>
                      <i className="fas fa-circle"></i><p>{eSec}</p>
                    </li>
                  })}
                  </ul>
                </div>
              })
            }
          </div>
          <div className="maCourseBox maCourseBox1">
            <h5>YOU'LL LEARN</h5>
            {resCourse && resCourse.youLearnBox
              && resCourse.youLearnBox.map((eLearn, index)=>{
                return <div key={index}>
                  <p>{eLearn.pri}</p>
                  <ul>
                  {eLearn.sec && eLearn.sec.map((eSec, index)=>{
                    return <li key={index}>
                      <i className="fas fa-circle"></i><p>{eSec}</p>
                    </li>
                  })}
                  </ul>
                </div>
              })
            }
          </div>
          <div className="maCourseBox maCourseBox1">
            <h5>PRE REQUIREMENTS</h5>
            {resCourse && resCourse.preReqBox
              && resCourse.preReqBox.map((eRequire, index)=>{
                return <div key={index}>
                  <p>{eRequire.pri}</p>
                  <ul>
                  {eRequire.sec && eRequire.sec.map((eSec, index)=>{
                    return <li key={index}>
                      <i className="fas fa-circle"></i><p>{eSec}</p>
                    </li>
                  })}
                  </ul>
                </div>
              })
            }
          </div>
          <div className="maBlogFoot">
            {!blogReporting && !moveOn?
              <div className="maBlogResButns">
                <button type="button"
                  onClick={()=>this.setState({blogReporting: true})}
                  >REPORT</button>
                <button type="button"
                  onClick={()=>this.setState({moveOn: true})}
                  >MOVE ON</button>
              </div>:null
            }
            {blogReporting?
              <div className="maBlogFoot1">
                <textarea rows="8" placeholder="Report Here ..."
                  name="maReport" value={maReport}
                  onChange={this.inputChanged} />
                <div className="maBlogResButns">
                  <button type="button"
                    onClick={()=>this.setState({blogReporting: false})}
                    >CANCEL</button>
                  <button type="button"
                    onClick={()=>this.addReport('Courses', mData.cId, mData.index)}
                    >REPORT</button>
                </div>
              </div>:null
            }
            {moveOn?
              <div className="maBlogFoot1">
                <div className="maCourseExtraForm">
                  <input type="text" name="maBatch" value={maBatch}
                    placeholder="BATCH (DD-MM-YYYY)" onChange={this.inputChanged} />
                  <input type="text" name="maCapacity" value={maCapacity}
                    placeholder="BATCH CAPACITY" onChange={this.inputChanged} />
                  <input type="text" name="maCourseFee" value={maCourseFee}
                    placeholder="COURSE FEE" onChange={this.inputChanged} />
                  <input type="text" name="maCourseOffer" value={maCourseOffer}
                    placeholder="COURSE OFFER" onChange={this.inputChanged} />
                  <textarea rows="3" name="maLocation" value={maLocation}
                    placeholder="LOCATION" onChange={this.inputChanged} />
                </div>
                <div className="maBlogResButns">
                  <button type="button"
                    onClick={()=>this.setState({moveOn: false})}
                    >CANCEL</button>
                  <button type="button"
                    onClick={()=>this.approveUserAdminCnt('Courses', mData.cId, mData.index)}
                    >GO4IT</button>
                </div>
              </div>:null
            }
          </div>
        </div>
      default:
        return <div className="defaultDiv">
          <img src={defaultImage} alt="" />
        </div>
    }
  }
}

function mapStateToProps(state) {
  return {
    profileEmail: state.profile.email,
    allBlogs: state.reqArrays.allBlogs,
    allTrimmedBlogs: state.reqArrays.allTrimmedBlogs,
    allCourss: state.reqArrays.allCourss,
    allTrimmedCourss: state.reqArrays.allTrimmedCourss,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    snackbar: payload=>{dispatch({type: 'SNACK_IT', payload})},
    getAllTrimmedBlogs: payload=>{dispatch({type: 'RETRIEVE_ALL_TRIMMED_BLOGS', payload})},
    getAllBlogs: payload=>{dispatch({type: 'RETRIEVE_ALL_BLOGS', payload})},
    getAllCourss: payload=>{dispatch({type: 'RETRIEVE_ALL_COURSS', payload})},
    getAllTrimmedCourss: payload=>{dispatch({type: 'RETRIEVE_ALL_TRIMMED_COURSS', payload})},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminModalContent);
