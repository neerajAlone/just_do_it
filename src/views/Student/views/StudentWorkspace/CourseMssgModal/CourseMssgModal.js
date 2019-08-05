import React, { useEffect } from 'react';

import './CourseMssgModal.css';
import pImg from '../../../../../amar/pic14.png';

function CourseMssgModal(props) {
  useEffect(()=>{
    if(props.open) {
      document.querySelector('.CourseMssgModal')
        .style.display = 'flex';
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
        <h2>React and Redux full course</h2>
        <textarea rows="6" placeholder="YourMssg..." />
        <button type="button">
          <i className="fas fa-envelope"></i>
        </button>
      </div>
      <div className="CourseMssgModal21">
        <div className="cmm21MssgBoxes">
          <div className="cmm21MssgBox">
            <div className="cmm21MssgBoxHead">
              <img src={pImg} alt="" />
              <div>
                <h5>UserName</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="cmm21MssgBoxBody">
              <p>
                Google LLC is an American multinational
                technology company that specializes in
                Internet-related services and products.
              </p>
            </div>
          </div>
        </div>
        <div className="cmm21MssgBoxes myMssg">
          <div className="cmm21MssgBox">
            <div className="cmm21MssgBoxHead">
              <img src={pImg} alt="" />
              <div>
                <h5>UserName</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="cmm21MssgBoxBody">
              <p>
                Google LLC is an American multinational
                technology company that specializes in
                Internet-related services and products.
              </p>
            </div>
          </div>
        </div>
        <div className="cmm21MssgBoxes">
          <div className="cmm21MssgBox">
            <div className="cmm21MssgBoxHead">
              <img src={pImg} alt="" />
              <div>
                <h5>UserName</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="cmm21MssgBoxBody">
              <p>
                Google LLC is an American multinational
                technology company that specializes in
                Internet-related services and products.
              </p>
            </div>
          </div>
        </div>
        <div className="cmm21MssgBoxes myMssg">
          <div className="cmm21MssgBox">
            <div className="cmm21MssgBoxHead">
              <img src={pImg} alt="" />
              <div>
                <h5>UserName</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="cmm21MssgBoxBody">
              <p>
                Google LLC is an American multinational
                technology company that specializes in
                Internet-related services and products.
              </p>
            </div>
          </div>
        </div>
        <div className="cmm21MssgBoxes">
          <div className="cmm21MssgBox">
            <div className="cmm21MssgBoxHead">
              <img src={pImg} alt="" />
              <div>
                <h5>UserName</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="cmm21MssgBoxBody">
              <p>
                Google LLC is an American multinational
                technology company that specializes in
                Internet-related services and products.
              </p>
            </div>
          </div>
        </div>
        <div className="cmm21MssgBoxes myMssg">
          <div className="cmm21MssgBox">
            <div className="cmm21MssgBoxHead">
              <img src={pImg} alt="" />
              <div>
                <h5>UserName</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="cmm21MssgBoxBody">
              <p>
                Google LLC is an American multinational
                technology company that specializes in
                Internet-related services and products.
              </p>
            </div>
          </div>
        </div>
        <div className="cmm21MssgBoxes">
          <div className="cmm21MssgBox">
            <div className="cmm21MssgBoxHead">
              <img src={pImg} alt="" />
              <div>
                <h5>UserName</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="cmm21MssgBoxBody">
              <p>
                Google LLC is an American multinational
                technology company that specializes in
                Internet-related services and products.
              </p>
            </div>
          </div>
        </div>
        <div className="cmm21MssgBoxes myMssg">
          <div className="cmm21MssgBox">
            <div className="cmm21MssgBoxHead">
              <img src={pImg} alt="" />
              <div>
                <h5>UserName</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="cmm21MssgBoxBody">
              <p>
                Google LLC is an American multinational
                technology company that specializes in
                Internet-related services and products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default CourseMssgModal;