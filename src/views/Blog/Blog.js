import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { firestore } from 'firebase';
import 'firebase/firestore';

import { BlogRoutes } from '../../routes';

function Blog(props) {
  useEffect(()=>{
    if(props.allBlogs.length === 0||props.allTrimmedBlogs.length === 0) {
      firestore().collection('Blogs').get()
        .then(res=>{ let bArray = [], rbArray = [];
          res.docs.forEach(doc=>{
            bArray.push({id: doc.id, ...doc.data()});
          });
          props.getAllBlogs(bArray);
          bArray && bArray.forEach(blog=>{
            let eachBlogObject = {};
            eachBlogObject.id = blog.id;
            eachBlogObject.cUid = blog.cUid;
            eachBlogObject.cImage = blog.cImage;
            eachBlogObject.cName = blog.cName;
            eachBlogObject.createdOn = blog.createdOn;
            eachBlogObject.title = blog.bTitle;
            eachBlogObject.subTitle = blog.bSubTitle;
            eachBlogObject.views = blog.views;
            eachBlogObject.heart = blog.fav_users && blog.fav_users.length;
            eachBlogObject.status = blog.status;
            eachBlogObject.image = blog.blogExtraContents
              .find(bi=>bi.type === 'image');
            rbArray.push(eachBlogObject);
          })
          props.getAllTrimmedBlogs(rbArray);
        })
    }
  }, [])
  return <Fragment>
    <div style={{ width: '100%',
        padding: '0 6px', display: 'flex',
        boxSizing: 'border-box',
      }}><Link to="/blogs"><h1 style={{
        fontWeight: 'normal',
        letterSpacing: 3,
        color: 'orangered'
      }}>BLOGS</h1></Link>
    </div>
    <BlogRoutes />
  </Fragment>
}

function mapStateToProps(state) {
  return {
    allBlogs: state.reqArrays.allBlogs,
    allTrimmedBlogs: state.reqArrays.allTrimmedBlogs,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllBlogs: payload=>{dispatch({type: 'RETRIEVE_ALL_BLOGS', payload})},
    getAllTrimmedBlogs: payload=>{dispatch({type: 'RETRIEVE_ALL_TRIMMED_BLOGS', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
