import React, {Fragment} from 'react';

import './Client.css';
function Client(props) {
  return <Fragment>
    <div className="portfolioContainer">
      <div className="portfolioHead">
        <h1>PORTFOLIO</h1>
      </div>
      <div className="portfolioBody">
        <div className="portfolioProjectContainer">
          <div className="portfolioProjectBox">
            <div className="ppImage"></div>
            <div className="ppDetails">
              <h2>Developer Wizards</h2>
              <p>
                A paragraph is a self-contained unit of a
                discourse in writing dealing with a
                particular point or idea.
              </p>
              <div className="ppDetailsField">
                <h5>PROJECT TYPE</h5>
                <h3>Website, IOS App, Android App</h3>
              </div>
              <div className="ppDetailsField">
                <h5>TECHNOLOGIES USED</h5>
                <div className="ppdfImages">
                  <div className="ppdfImage">
                    <img src={require('../../amar/reactLogo.png')} alt="" />
                  </div>
                  <div className="ppdfImage">
                    <img src={require('../../amar/reduxLogo.png')} alt="" />
                  </div>
                  <div className="ppdfImage">
                    <img src={require('../../amar/firebaseLogo.png')} alt="" />
                  </div>
                </div>
              </div>
              <div className="ppDetailsField">
                <button type="button" onClick={()=>{
                  window.open('https://developerwizards.com')
                  }}>VISIT WEBSITE</button>
              </div>
            </div>
          </div>
        </div>
        <div className="portfolioProjectContainer">
          <div className="portfolioProjectBox">
            <div className="ppImage"></div>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
}

export default Client;