import React, {Fragment} from 'react';

import './Contact.css';
import sbsp from '../../amar/sbsp.png';

function Contact(props) {
  return <Fragment>
    <div className="homeBox">
      <div className="homeBox1">
        <img src={require('../../amar/pic8.png')} alt="" />
      </div>
      <div className="homeBox1">
        <p>
          Here we serve both Clients and Student with our best Knowledge
          in Information Technology. 
        </p>
      </div>
    </div>
    <div className="contactForm">
      <div className="contactFormBlock oddBlock">
        <div className="contactFormBlock1">
          <div className="contactForm1">
            <div className="contactForm1Field">
              <h5>NAME</h5>
              <h2>Neeraj K Vishwakarma</h2>
            </div>
            <div className="contactForm1Field">
              <h5>POST</h5>
              <h2>Co-Founder & Main-Developer</h2>
            </div>
          </div>
          <img alt="" src={sbsp} />
        </div>
      </div>
      <div className="contactFormBlock">
        <div className="contactFormBlock1">
          <img alt="" src={sbsp} />
          <div className="contactForm1">
            <div className="contactForm1Field">
              <h5>NAME</h5>
              <h2>Neeraj K Vishwakarma</h2>
            </div>
            <div className="contactForm1Field">
              <h5>POST</h5>
              <h2>Co-Founder & Main-Developer</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
}

export default Contact;