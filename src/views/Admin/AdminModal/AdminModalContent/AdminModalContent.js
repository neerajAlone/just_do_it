import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Converter } from 'showdown';
import { auth, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './AdminModalContent.css';
import defaultImage from '../../../../amar/developerWizardsLogoOrange.png';


class AdminModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetBatch: false,
      addOffer: false,
      removeCourse: false,
      batch: '', offer: '',
      password: '', mErrorP: '',
      raEmail: '', raPassword: '',
      replyTextArea: '',

      rpRow: '', rpCol: '',
      rpText: '', rpArray: [],
    }
  }
  inputChanged =e=> {
    this.setState({[e.target.name]: e.target.value});
  }
  componentWillReceiveProps(getProps) {
    if(getProps.index===4) {
      this.setState({
        resetBatch: false, addOffer: false,
        removeCourse: false, mErrorP: ''
      })
    }
  }

  // 4
  removeCourseConfirmed =(cUid)=> {
    const { password } = this.state;
    let credential = auth.EmailAuthProvider.credential(auth().currentUser.email, password);
    auth().currentUser.reauthenticateWithCredential(credential)
      .then(res=>{
        if(res.user.uid === auth().currentUser.uid) {
          firestore().collection('Courses').doc(cUid).delete()
            .then(()=>window.location.reload());
        }
      }).catch(err=>this.setState({mErrorP: err.message}))
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
  // 9
  addReport =()=> {
    const { rpRow, rpCol, rpText } = this.state;
    this.setState((preState)=>{
      return {
        rpArray: [...preState.rpArray, {rpRow,rpCol,
          rpText: new Converter().makeHtml(rpText)}],
        rpRow: '', rpCol: '', rpText: ''
      }
    })
  }
  coverting2Html =text=> {
    let reactDiv = document.createElement('div');
    reactDiv.className = 'eachReportBox';
    reactDiv.append('<p>PARAGRAPH</p>');
    console.dir(reactDiv)
    return reactDiv;
  }

  render() {
    const { 
      resetBatch, addOffer, removeCourse,
      batch, offer, password, replyTextArea,
      raEmail, raPassword, mErrorP,
      rpRow, rpCol, rpText, rpArray
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
      case 4:
        return <div className="resCourseInfoPopup">
          <h2>{mData.course_name}</h2>
          <div className="popTextFlex">
            <h5>{mData && mData._id}</h5>
          </div>
          <div className="popTextFlex">
            <h5>Active Batch {mData && mData.batch}</h5>
          </div>
          <div className="popTextFlex">
            <h5>Course Fees {mData && mData.courseFee} Rs</h5>
          </div>
          <div className="popTextFlex">
            <h5>Current Offer {mData && mData.offer}% ({mData && (Number(mData.offer)!==0?((Number(mData.course_fee)-(Number(mData.offer)/100)*Number(mData.course_fee))):mData.course_fee)} Rs)</h5>
          </div>
          <div className="adminMoveBox">
            {resetBatch?
              <div>
                <input type="text" autoComplete="off"
                  placeholder="dd-mm-yyyy hr:mn AM|PM"
                  name="batch" value={batch} style={{color: 'green',
                  backgroundColor: 'rgba(0, 128, 0, 0.3)'}}
                  onChange={this.inputChanged} />
                <input type="text" autoComplete="off" placeholder="PASSWORD"
                  name="password" value={password} style={{color: 'green',
                  backgroundColor: 'rgba(0, 128, 0, 0.3)'}}
                  onChange={this.inputChanged} />
                <div className="admbBtns">
                  <button type="button" style={{color: 'red'}}
                    onClick={()=>this.setState({resetBatch: false})}
                    ref={r=>{this.resetCancelBtn=r}}>CANCEL</button>
                  <button type="button" style={{color: 'green'}}
                    onClick={()=>{console.log(batch, password)
                    }}>RESET</button>
                </div>
              </div>:
              <button type="button" style={{color: 'green'}}
                onClick={()=>{
                  this.setState({
                    resetBatch: true, addOffer: false,
                    removeCourse: false, batch: '', offer: '',
                    email: '', password: ''
                  })
                }}>
                <h4>RESET BATCH</h4>
                <i className="fas fa-users"></i>
              </button>
            }
          </div>
          <div className="adminMoveBox">
            {addOffer?
              <div>
                <input type="text" autoComplete="off" placeholder="OFFER"
                  name="offer" value={offer} style={{color: 'goldenrod',
                  backgroundColor: 'rgba(218, 165, 32, 0.3)'}}
                  onChange={this.inputChanged} />
                <input type="text" autoComplete="off" placeholder="PASSWORD"
                  name="password" value={password} style={{color: 'goldenrod',
                  backgroundColor: 'rgba(218, 165, 32, 0.3)'}}
                  onChange={this.inputChanged} />
                <div className="admbBtns">
                  <button type="button" style={{color: 'red'}}
                    onClick={()=>this.setState({addOffer: false})}
                    ref={r=>{this.offerCancelBtn=r}}>CANCEL</button>
                  <button type="button" style={{color: 'green'}}
                    onClick={()=>{console.log(offer, password)
                    }}>ADD</button>
                </div>
              </div>:
              <button type="button" style={{color: 'goldenrod'}}
                onClick={()=>{
                  this.setState({
                    addOffer: true, resetBatch: false,
                    removeCourse: false, batch: '', offer: '',
                    email: '', password: ''
                  })
                }}>
                <h4>ADD OFFER</h4>
                <i className="fas fa-users"></i>
              </button>
            }
          </div>
          <p className="mErrorP" style={{color: mErrorP?'red':'gray'}}
            >{mErrorP?mErrorP:'Did You See it !'}</p>
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
      case 10:
        return <div className="maBlogConfirmation">
          <h3>Blog Title is Here ...</h3>
          <div className="maBlogImage">
            <img src={require('../../../../amar/course_image.png')} alt="" />
          </div>
          <p>
            A paragraph is a self-contained unit of a
            discourse in writing dealing with a particular
            point or idea. A paragraph consists of one or
            more sentences.
          </p>
          <textarea rows="5" value={`Hello NAno`} disabled />
          <div className="blogResButns">
            <button type="button">CANCEL</button>
            <button type="button">APPROVE</button>
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
    profileEmail: state.profile.email
  }
}
function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminModalContent);
