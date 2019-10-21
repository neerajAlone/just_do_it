import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { auth, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './CourseMssgModal.css';
import pImg from '../../../../../amar/undraw_profile_pic.svg';

function addMessage(props, mssg, mssgFunc, toAdmin, toAdminFunc) {
  if(toAdmin) {
    Promise.all([
      firestore().collection('Courses').doc(props.c_id)
        .collection('conversations').doc(Date.now().toString())
        .set({
          uid: auth().currentUser.uid, mssg, to: null,
          username: auth().currentUser.displayName,
          image: auth().currentUser.photoURL
        }),
      firestore().collection('User-Admin').doc(props.ua_id)
        .collection('conversations').doc(Date.now().toString())
        .set({
          uid: auth().currentUser.uid, mssg, replied: null,
          username: auth().currentUser.displayName,
          image: auth().currentUser.photoURL,
          course_name: props.c_name, course_id: props.c_id
        })
    ]).then(()=>{mssgFunc(''); toAdminFunc(false)})
  } else {
    firestore().collection('Courses').doc(props.c_id)
      .collection('conversations').doc(Date.now().toString())
      .set({
        uid: auth().currentUser.uid, mssg,
        username: auth().currentUser.displayName,
        image: auth().currentUser.photoURL,
      }).then(()=>mssgFunc(''));
  }
}

function CourseMssgModal(props) {
  // 
  let [textArea, settextArea] = useState('');
  let [toAdmin, settoAdmin] = useState(false);
  let cUid = auth().currentUser.uid;
  useEffect(()=>{
    if(props.open) {
      document.querySelector('.CourseMssgModal')
        .style.display = 'flex';
      if(props.respCourseMssgs.box.length === 0) {
        firestore().collection('Courses').doc(props.c_id)
          .collection('conversations').onSnapshot(snapy=>{
            if(!snapy.empty) {
              let helpArray = [];
              snapy.docs.forEach(doc=>{helpArray.push({time: doc.id, ...doc.data()})});
              props.getRespCourseMssgs({id: props.c_id, array: helpArray});
            }
          })
      } else {
        if(props.respCourseMssgs._id !== props.c_id) {
          props.getRespCourseMssgs({id: null, array: []});
          firestore().collection('Courses').doc(props.c_id)
            .collection('conversations').onSnapshot(snapy=>{
              if(!snapy.empty) {
                let helpArray = [];
                snapy.docs.forEach(doc=>{helpArray.push({time: doc.id, ...doc.data()})});
                props.getRespCourseMssgs({id: props.c_id, array: helpArray});
              }
            })
        }
      }
    } else {
      document.querySelector('.CourseMssgModal')
        .style.display = 'none';
    }
  }, [props.open])
  return <div className="CourseMssgModal">
    <div className="CourseMssgModal1"
      onClick={()=>props.cFunk(false)}></div>
    <div className="CourseMssgModal2">
      <div className="CourseMssgModal22">
        <h3>{props.c_name}</h3>
        <textarea rows="6"
          placeholder="YourMssg..." value={textArea}
          onChange={e=>settextArea(e.target.value)} />
        <div className="CourseMssgModal221">
          <button type="button" onClick={()=>settoAdmin(!toAdmin)}
            style={{color: toAdmin?'orangered':'grey'}}>
            <i className="fas fa-user-astronaut"></i>
          </button>
          <button type="button"
            onClick={()=>addMessage(props, textArea, settextArea, toAdmin, settoAdmin)}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      <div className="CourseMssgModal21">
        {props.respCourseMssgs.box && props.respCourseMssgs.box.map((eMssg, index)=>{
          return <div key={index}
            className={(cUid!==eMssg.uid)?'cmm21MssgBoxes':'cmm21MssgBoxes myMssg'}>
            <div className="cmm21MssgBox">
              <div className="cmm21MssgBoxHead">
                <img src={eMssg.image?eMssg.image:pImg} alt="" />
                <div>
                  <h5>{eMssg.username}</h5>
                  <h5>{eMssg.time}</h5>
                </div>
              </div>
              {eMssg.to?<div className="cmm21MssgBoxHead">
                <h4>To: {eMssg.to}</h4>
              </div>:null}
              <div className="cmm21MssgBoxBody">
                <p>{eMssg.mssg}</p>
              </div>
            </div>
          </div>
        })}
      </div>
    </div>
  </div>
}

function mapStateToProps(state) {
  return {
    respCourseMssgs: state.reqArrays.respCourseMssgs
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getRespCourseMssgs: (payload)=>{dispatch({type: 'RESPECTIVE_COURSE_MSSG_BOX', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseMssgModal);