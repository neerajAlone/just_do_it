import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './blogHome.css';
import blogImg from '../../../../amar/course_image.png';

function BlogHome(props) {
  useEffect(()=>{
  }, [])

  return <Fragment>
    <div className="blogContainer">
      <div className="bContainerBody">
        <div className="blogBodyContainer">
          <Link to="/blogs/blog/1">
            <div className="blogBodyBox">
              <div className="blogBodyBoxImage"></div>
              <div className="blogBodyBoxHead">
                <div className="blogBodyBoxHead1">
                  <div className="blogBodyBoxHead1Img"></div>
                  <div>
                    <h5>Username</h5>
                    <h5>12-01-1996 11:30 AM</h5>
                  </div>
                </div>
              </div>
              <div className="blogBodyBoxBody">
                The paragraph is a self-contained
                unit of a discourse in writing dealing
                with a particular point or idea.
                A paragraph consists of one or
                more sentences. A paragraph consists
                of one or more sentences. A paragraphs.
              </div>
              <div className='blogBodyBoxFoot'>
                <div className="blogBodyBoxFoot1">
                  <i className="fas fa-user"></i>
                  <h4>4000</h4>
                </div>
                <div className="blogBodyBoxFoot1">
                  <i className="fas fa-heart"></i>
                  <h4>400</h4>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="blogBodyContainer">
          <Link to="/blogs/blog/2">
            <div className="blogBodyBox">
              <div className="blogBodyBoxImage"></div>
              <div className="blogBodyBoxHead">
                <div className="blogBodyBoxHead1">
                  <div className="blogBodyBoxHead1Img"></div>
                  <div>
                    <h5>Username</h5>
                    <h5>12-01-1996 11:30 AM</h5>
                  </div>
                </div>
              </div>
              <div className="blogBodyBoxBody">
                The paragraph is a self-contained
                unit of a discourse in writing dealing
                with a particular point or idea.
              </div>
              <div className='blogBodyBoxFoot'>
                <div className="blogBodyBoxFoot1">
                  <i className="fas fa-user"></i>
                  <h4>4000</h4>
                </div>
                <div className="blogBodyBoxFoot1">
                  <i className="fas fa-heart"></i>
                  <h4>400</h4>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </Fragment>
}

export default BlogHome;