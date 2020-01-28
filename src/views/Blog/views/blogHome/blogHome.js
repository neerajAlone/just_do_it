import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './blogHome.css';

function BlogHome(props) {
  useEffect(()=>{
  }, [])

  return <Fragment>
    <div className="blogContainer">
      <div className="blogBoxes">
      {props.allTrimmedBlogs && props.allTrimmedBlogs
        .filter(eBlog=>eBlog.status === true)
        .map((eBlog, index)=>{
          return <div className="blogBox" key={index}>
            <Link to={`/blogs/blog/${eBlog.id}`}>
              <div className="blog">
                <div className="blogBody">
                  <p>{eBlog.title}</p>
                  <p>{eBlog.subTitle}</p>
                  <img src={eBlog.image && eBlog.image.value} alt="" />
                </div>
                <div className="blogFoot">
                  <div className="bIconText">
                    <i className="fas fa-user"
                      style={{color: '#4885ed'}}></i>
                    <h5>{eBlog.views}</h5>
                  </div>
                  <div className="bIconText">
                    <i className="fas fa-heart"
                      style={{color: '#D44638'}}></i>
                    <h5>{eBlog.heart}</h5>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        })}
      </div>
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    allBlogs: state.reqArrays.allBlogs,
    allTrimmedBlogs: state.reqArrays.allTrimmedBlogs,
  }
}

export default connect(mapStateToProps, null)(BlogHome);