import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { firestore, auth } from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

import './blogPage.css';

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
function BlogExtraContent(props) {
  switch(props.type) {
    case 'image':
      return <img src={props.value} alt="" />
    case 'paragraph':
      return <p>{props.value}</p>
    case 'gap':
      return <div className="blogGap"></div>
    case 'header':
      return <h3>{props.value}</h3>
    case 'code':
      return <textarea rows={props.value.split(/\r|\r\n|\n/).length}
        value={props.value} disabled />
  }
}
function comment(value, setValue, props){
  if(auth().currentUser) {
    const date = Date.now().toString();
    firestore().collection('Blogs').doc(props.match.params.b_id)
      .collection('comments').doc(date)
      .set({ comment: value,
        uImage: auth().currentUser.photoURL,
        uName: auth().currentUser.displayName,
        uUid: auth().currentUser.uid,
      }).then(()=>{
        props.getAllComment([{
          time: date, comment: value,
          uImage: auth().currentUser.photoURL,
          uName: auth().currentUser.displayName,
          uUid: auth().currentUser.uid,
        }, ...props.allComments])
      })
    setValue('');
  } else props.history.push('/signbox');
}

function BlogPage(props) {
  let [bObject, setBObject] = useState(null);
  let [textarea, setTextarea] = useState('');
  let [heart, setHeart] = useState(false);
  let [heartBtnCntrl, setHeartBtnCntrl] = useState(false);
  useEffect(()=>{
    if(props.match.params.b_id){
      let fObject = props.allBlogs && props.allBlogs
        .find(eb=>eb.id === props.match.params.b_id);
      fObject && setBObject(fObject);
      fObject && firestore().collection('Blogs').doc(props.match.params.b_id)
        .update({views: fObject.views+1});
      if(auth().currentUser){
        fObject && fObject.fav_users && fObject.fav_users
          .filter(eUser=>eUser===auth().currentUser.uid)
          .length!==0?setHeart(true):setHeart(false);
      }
      if(props.allComments.length === 0){
        firestore().collection('Blogs').doc(props.match.params.b_id)
          .collection('comments').get().then(res=>{
            if(!res.empty){ let cArray = [];
              res.docs.forEach(doc=>cArray.push({time: doc.id, ...doc.data()}))
              props.getAllComment(cArray);
            }
          })
      }
    }
  }, []);
  function toggleHeart() {
    if(auth().currentUser){ setHeartBtnCntrl(true);
      let fUsers = bObject && bObject.fav_users;
      if(heart) {
        fUsers.splice(fUsers.findIndex(eU=>eU===auth().currentUser.uid), 1)
      } else fUsers.push(auth().currentUser.uid);
      firestore().collection('Blogs').doc(props.match.params.b_id)
        .update({fav_users: fUsers}).then(()=>{
          setHeart(!heart); setHeartBtnCntrl(false);
        })
    } else props.history.push('/signbox');
  }
  return <Fragment>
    <div className="blogPageContainer">
      <div className="blogPageBox">
        <div className="bpbHead">
          <div className="bpbHead1">
            <div className="bpbHead11">
              <img src={bObject && bObject.cImage} alt="" />
              <div>
                <h4>{bObject && bObject.cName}</h4>
                <h4>{bObject && bObject.createdOn}</h4>
              </div>
            </div>
            <button type="button" onClick={toggleHeart}
              disabled={heartBtnCntrl}
              style={{color: heart?'red':'#aaa'}}>
              <i className="fas fa-heart"></i>
            </button>
          </div>
          <div className="bpbHead2">
            <div className="bpbHead21">
              <button type="button"
                style={{backgroundColor: '#4267B2'}}>
                <i className="fab fa-facebook-f"></i>
              </button>
              <button type="button"
                style={{backgroundColor: '#2867B2'}}>
                <i className="fab fa-linkedin-in"></i>
              </button>
              <button type="button"
                style={{backgroundColor: '#1DA1F2'}}>
                <i className="fab fa-twitter"></i>
              </button>
              <button type="button"
                style={{backgroundColor: '#4AC959'}}>
                <i className="fab fa-whatsapp"></i>
              </button>
            </div>
            <div>
              <div className="bpbIconText">
                <i className="fas fa-user"
                  style={{color: '#4885ed'}}></i>
                <h4>{bObject && bObject.views}</h4>
              </div>
              <div className="bpbIconText">
                <i className="fas fa-heart"
                  style={{color: '#D44638'}}></i>
                <h4>{bObject && bObject.fav_users && bObject.fav_users.length}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="bpbBody">
          <div className="bpbBodyHead">
            <p>{bObject && bObject.bTitle}</p>
            <p>{bObject && bObject.bSubTitle}</p>
          </div>
          <div className="bpbBodyBody">
          {bObject && bObject.blogExtraContents
            && bObject.blogExtraContents.map((ebeCont, index)=>{
              return <BlogExtraContent key={index}
                type={ebeCont.type} value={ebeCont.value} />
            })}
          </div>
        </div>
      </div>
      <div className="blogPageBox">
        <div className="blogPageBox2Head">
          <textarea rows="5" value={textarea}
            onChange={e=>setTextarea(e.target.value)}
            placeholder="Your Comment ..." />
          <button type="button"
            onClick={()=>comment(textarea, setTextarea, props)}
            >COMMENT</button>
        </div>
        <div className="blogPageBoxCommentsBox">
          <h4>ALL COMMENTS ...</h4>
          {props.allComments && props.allComments.map((eComment, index)=>{
            return <div className="blogPageBoxCommentBox" key={index}>
              <div className="blogPageBoxCommentBoxHead">
                <div className="blogPageBoxCommentBoxHeadImg">
                  <img src={eComment.uImage} alt="" />
                </div>
                <div>
                  <h5>{eComment.uName}</h5>
                  <h5>{eComment.time}</h5>
                </div>
              </div>
              <p>{eComment.comment}</p>
            </div>
          })}
        </div>
      </div>
    </div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    allBlogs: state.reqArrays.allBlogs,
    allComments: state.reqArrays.blogAllComment
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllComment: payload=>{dispatch({type: 'RETRIEVE_ALL_COMMENT_BLOG', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);