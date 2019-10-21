import React, {Fragment, useState} from 'react';
import { connect } from 'react-redux';
import { firestore } from 'firebase';
import 'firebase/firestore';

import './Contact.css';

function Contact(props) {
  let [err, setErr] = useState(false);
  let [fullname, setFullname] = useState('');
  let [email, setEmail] = useState('');
  let [mobile, setMobile] = useState('');
  let [message, setMessage] = useState('');
  function sendMessage() {
    if(fullname===''||email===''||message==='') setErr(true)
      else {
        firestore().collection('Inquiry-Mssgs')
          .add({fullname, email, mobile, message, time: Date.now()})
          .then(()=>{
            setErr(false);
            setFullname(''); setEmail('');
            setMobile(''); setMessage('');
            props.snackbar('message sended');
          })
      }
  }
  return <Fragment>
    <div className="contactUs">
      <div className="contactUsHead">
        <h5>GOT A QUESTION ?</h5>
        <h1>Contact Developer Wizards</h1>
        <p>
          Whether you have a question about
          any Courses, Blogs, Portfolio
          or anything else, our team is ready
          to answer all your questions.
        </p>
        <h2>Get in touch with Us.</h2>
        <p>
          Use the form below to drop us a notification.
          Or call our sales & billing team >> +35635500106.</p>
      </div>
      <div className="contactUsBody">
        <div className="contactUsBodyForm">
          <p>
            <b>NOTE: </b>{err?
              `Field with * are required`
              :`Please note that this inquiry
              form is solely for the purpose of inquiries.`}
          </p>
          <div className="contactUsBodyFormField">
            <input type="text" placeholder="FULL NAME *" value={fullname}
              onChange={e=>setFullname(e.target.value)} />
          </div>
          <div className="contactUsBodyFormField">
            <input type="email" placeholder="EMAIL *" value={email}
              onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="contactUsBodyFormField">
            <input type="text" placeholder="MOBILE" value={mobile}
              onChange={e=>setMobile(e.target.value)} />
          </div>
          <div className="contactUsBodyFormField">
            <textarea rows="5" placeholder="MESSAGE *" value={message}
              onChange={e=>setMessage(e.target.value)} />
          </div>
          <div className="contactUsBodyFormField">
            <button type="button"
              onClick={sendMessage}
              >SEND MESSAGE</button>
          </div>
        </div>
        <div className="contactUsBodyMembers">
          <h3>OUR TEAM</h3>
          <div className="cubMembers">
            <div className="cubMember">
              <div className="cubMemberImg"></div>
              <h4>Neeraj K. Vishwakarma</h4>
              <h5>neerajkv03@gmail.com</h5>
            </div>
            <div className="cubMember"></div>
            <div className="cubMember"></div>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
}

function mapDispatchToProps(dispatch){
  return {
    snackbar: payload=>{dispatch({type: 'SNACK_IT', payload})}
  }
}

export default connect(null, mapDispatchToProps)(Contact);