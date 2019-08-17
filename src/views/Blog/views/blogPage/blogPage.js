import React, { Fragment, useState } from 'react';

import './blogPage.css';
import blogImg from '../../../../amar/notebook.png';
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

function BlogPage() {
  let [heart, setHeart] = useState(false);

  return <Fragment>
    <div className="blogPage">
      <div className="blogPageHead">
        <h2>Tailwind CSS is a highly customizable.</h2>
        <img alt="" src={blogImg} />
      </div>
      <div className="blogBody">
        <div className="blogBodySection">
          <div className="blogBodySection1">
            <img alt="" src={userImg} />
            <div>
              <h5>Username</h5>
              <h5>12-01-1996 11:30 AM</h5>
            </div>
          </div>
          <div className="blogBodySection1">
            <button type="button"
              style={{marginRight: 30}}
              onClick={()=>setHeart(!heart)}>
              {heart?
                <i style={{color: 'red'}}
                  className="fas fa-heart"></i>:
                <i style={{color: 'green'}}
                  className="far fa-heart"></i>}
            </button>
            <button type="button" style={{color: '#3C5A99'}}
              onClick={()=>shareBlog('FACEBOOK')}>
              <i className="fab fa-facebook-square"></i>
            </button>
            <button type="button" style={{color: '#0077B5'}}
              onClick={()=>shareBlog('LINKEDIN')}>
              <i className="fab fa-linkedin"></i>
            </button>
            <button type="button" style={{color: '#1DA1F2'}}
              onClick={()=>shareBlog('TWITTER')}>
              <i className="fab fa-twitter-square"></i>
            </button>
            <button type="button" style={{color: '#4AC959'}}
              onClick={()=>shareBlog('WHATSAPP')}>
              <i className="fab fa-whatsapp-square"></i>
            </button>
          </div>
        </div>
        <div className="blogBodySection2">
          <div className="blogBodySection21">
            <p>
              A brand is a name, term, design, symbol
              or any other feature that identifies
              one seller's good or service as distinct
              from those of other sellers.
            </p>
            <h3>" Importance is a subjective indicator of value. "</h3>
          </div>
          <div className="blogBodySection21">
            <p>
              A brand is a name, term, design, symbol
              or any other feature that identifies
              one seller's good or service as distinct
              from those of other sellers.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
}

export default BlogPage;