import React, {Fragment} from 'react';

import './Client.css';

function Client(props) {
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
    <div className="homeBox hb2">
      <div className="homeBox1">
        <p>
          For Students we provide great courses based on Web &
          Mobile development, also on different computer languages.
        </p>
      </div>
      <div className="homeBox1">
        <img src={require('../../amar/pic3.png')} alt="" />
      </div>
    </div>
    <div className="homeBox">
      <div className="homeBox1">
        <img src={require('../../amar/pic4.png')} alt="" />
      </div>
      <div className="homeBox1">
        <p>
          Here we serve both Clients and Student with our best Knowledge
          in Information Technology. 
        </p>
      </div>
    </div>
    <div className="homeBox hb2">
      <div className="homeBox1">
        <p>
          For Students we provide great courses based on Web &
          Mobile development, also on different computer languages.
        </p>
      </div>
      <div className="homeBox1">
        <img src={require('../../amar/pic7.png')} alt="" />
      </div>
    </div>
  </Fragment>
}

export default Client;