import React, {Fragment, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './Home.css';

function Home(props) {
  return <Fragment>
    <div className="homeBoxes">
      <div className="homeBoxe">
        <div className="homeBoxCnts">
          <div className="homeBoxCnt">
            <p>
              We are group of result driven developer,
              our aim is to develop smart innovative solutions,
              that creates positive impact on your business.
            </p>
          </div>
          <div className="homeBoxCnt">
            <p>
              To check out some of our projects
              vist our <Link to="/">Portfolio</Link>
            </p>
          </div>
          <div className="homeBoxCnt">
            <p>
              Wanted to join out developer group?
              ...<Link to="/">Contact-Us</Link>
            </p>
          </div>
        </div>
        <div className="homeBoxImg">
          <img src={require('../../amar/organizing.svg')} alt="" />
        </div>
      </div>
      <div className="homeBoxe">
        <div className="homeBoxImg">
          <img src={require('../../amar/professor.svg')} alt="" />
        </div>
        <div className="homeBoxCnts">
          <div className="homeBoxCnt">
            <p>
              DeveloperWizards also serve as KSP(Knowledge Sharing Platform)
              where one can share their knowledge via a:
            </p>
          </div>
          <div className="homeBoxCnt">
            <li>
              <i className="fas fa-long-arrow-alt-right"></i>
              <Link to="/"><p>Seminar</p></Link>
            </li>
            <li>
              <i className="fas fa-long-arrow-alt-right"></i>
              <Link to="/"><p>Webinar</p></Link>
            </li>
            <li>
              <i className="fas fa-long-arrow-alt-right"></i>
              <Link to="/"><p>Blogs</p></Link>
            </li>
            <li>
              <i className="fas fa-long-arrow-alt-right"></i>
              <Link to="/"><p>Courses</p></Link>
            </li>
            <li>
              <i className="fas fa-long-arrow-alt-right"></i>
              <Link to="/"><p>WorkShop</p></Link>
            </li>
          </div>
          <div className="homeBoxCnt">
            <p>
              Love to share your Knowledge?
              <br />... become MAVEN
            </p>
          </div>
        </div>
      </div>
      <div className="homeBoxe">
        <div className="homeBoxCnts">
          <div className="homeBoxCnt">
            <p>
              DeveloperWizards also act as a hiring partner
              for your business where hiring manager of 
              company can post:
            </p>
          </div>
          <div className="homeBoxCnt">
            <li> <i className="fas fa-long-arrow-alt-right"></i>
              <Link to="/"><p>Hiring Challenges</p></Link>
            </li>
            <li> <i className="fas fa-long-arrow-alt-right"></i>
              <Link to="/"><p>Advertisement of the Hiring</p></Link>
            </li>
          </div>
          <div className="homeBoxCnt">
            <p>
            </p>
          </div>
        </div>
        <div className="homeBoxImg">
          <img src={require('../../amar/interview.svg')} alt="" />
        </div>
      </div>
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    snackBar: state.snackBar
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openSnackbar: (payload)=>{dispatch({type: 'SNACK_IT', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);