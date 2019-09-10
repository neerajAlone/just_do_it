import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './blogHome.css';
import blogImg from '../../../../amar/notebook.png';

function BlogHome(props) {
  useEffect(()=>{
  }, [])

  return <Fragment>
    <div className="blogTitle">
      <h3>B</h3>
      <h2>LOGS</h2>
    </div>
    <div className="blogContainer">
      <div className="blogBox">
        <Link to="/blog/blogPage/1">
          <img alt="" src={blogImg} />
          <h4>Tailwind CSS is a highly customizable.</h4>
          <div className="byBlog">
            <div className="blogCreator">
              <h3>by</h3>
              <div>
                <h5>Username</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="blogSupport">
              <p>400</p>
              <i className="fas fa-heart"></i>
            </div>
          </div>
        </Link>
      </div>
      <div className="blogBox">
        <Link to="/blog/blogPage/1">
          <img alt="" src={blogImg} />
          <h4>Tailwind CSS is a highly customizable.</h4>
          <div className="byBlog">
            <div className="blogCreator">
              <h3>by</h3>
              <div>
                <h5>Username</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <div className="blogSupport">
              <p>400</p>
              <i className="fas fa-heart"></i>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </Fragment>
}

export default BlogHome;