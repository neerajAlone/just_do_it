import React, { Fragment, useState, useEffect } from 'react';

import './blogPage.css';
import blogImg from '../../../../amar/course_image.png';
import userImg from '../../../../amar/undraw_profile_pic.svg';


function shareBlog(company) {
  switch(company) {
    case 'FACEBOOK':
      window.open(`https://www.facebook.com/sharer.php?u=${window.location.href}`, 'nothing', '');
      break;
    case 'LINKEDIN':
      window.open(`https://www.linkedin.com/shareArticle?url=${window.location.href}`, 'nothing', '');
      break;
    case 'TWITTER':
      window.open(`https://twitter.com/share?url=${window.location.href}`, 'nothing', '');
      break;
    case 'WHATSAPP':
      window.open(`https://wa.me/?text=${window.location.href}`, 'nothing', '');
      break;
  }
}

function BlogPage(props) {
  useEffect(()=>{
    let bpbImg = document.querySelector('.blogPageBoxImage');
    bpbImg.style.height = (bpbImg.clientWidth*3)/5+'px';
  }, [])
  let [heart, setHeart] = useState(false);

  return <Fragment>
    <div className="blogPageContainer">
      <div className="blogPageBox">
        <div className="blogPageBoxImage">
          <div className="blogPageBoxImage1">
            <button type="button">
              <i className="fas fa-heart"></i>
            </button>
          </div>
        </div>
        <div className="blogPageBoxHead">
          <div className="blogPageBoxHead1">
            <div className="blogPageBoxHead1Img"></div>
            <div>
              <h5>Username</h5>
              <h5>12-01-1996 11:30 AM</h5>
              <h5>4000</h5>
            </div>
          </div>
          <div className="blogPageBoxHead1">
            <button type="button" style={{color: '#3C5A99'}}>
              <i className="fab fa-facebook-square"></i>
            </button>
            <button type="button" style={{color: '#0077B5'}}>
              <i className="fab fa-linkedin"></i>
            </button>
            <button type="button" style={{color: '#1DA1F2'}}>
              <i className="fab fa-twitter-square"></i>
            </button>
            <button type="button" style={{color: '#4AC959'}}>
              <i className="fab fa-whatsapp-square"></i>
            </button>
          </div>
        </div>
        <div className="blogPageBoxBody">
          <h2>
            A paragraph is a self-contained unit of a discourse
            in writing dealing with a particular point or idea.
          </h2>
          <p>
            A paragraph is a self-contained unit of a discourse
            in writing dealing with a particular point or idea.
            A paragraph consists of one or more sentences.
            A paragraph is a self-contained unit of a discourse
            in writing dealing with a particular point or idea.
            A paragraph consists of one or more sentences.
          </p>
          <p>
            A paragraph is a self-contained unit of a discourse
            in writing dealing with a particular point or idea.
            A paragraph consists of one or more sentences.
          </p>
        </div>
      </div>
      <div className="blogPageBox">
        <textarea rows="5"
          placeholder="Your Comment ..." />
        <div className="blogPageBoxCommentsBox">
          <h4>ALL COMMENTS ...</h4>
          <div className="blogPageBoxCommentBox">
            <div className="blogPageBoxCommentBoxHead">
              <div className="blogPageBoxCommentBoxHeadImg"></div>
              <div>
                <h5>Username</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <p>
              A paragraph is a self-contained unit of a discourse
              in writing dealing with a particular point or idea.
              A paragraph consists of one or more sentences.
            </p>
          </div>
          <div className="blogPageBoxCommentBox">
            <div className="blogPageBoxCommentBoxHead">
              <div className="blogPageBoxCommentBoxHeadImg"></div>
              <div>
                <h5>Username</h5>
                <h5>12-01-1996 11:30 AM</h5>
              </div>
            </div>
            <p>
              A paragraph is a self-contained unit of a discourse
              in writing dealing with a particular point or idea.
              A paragraph consists of one or more sentences.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
}

export default BlogPage;