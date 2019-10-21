import React, {useEffect, useState} from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from 'firebase/app';
import 'firebase/auth';

import './Sidebar.css';
import Userpic from '../../amar/undraw_profile_pic.svg';

function Sidebar(props) {
  let [signedIn, setsignedIn] = useState(false);
  useEffect(()=>{
    if(auth().currentUser) setsignedIn(true);
  }, [])
  useEffect(()=>{
    let body = document.querySelector('body'),
        Sidebar = document.querySelector('.Sidebar'),
        Sidebar1 = Sidebar.querySelector('.Sidebar1'),
        Sidebar2 = Sidebar.querySelector('.Sidebar2');
    if(props.open) {
      body.style.overflow = 'hidden';
      Sidebar.style.display = 'flex';
      setTimeout(()=>{
        Sidebar1.style.left = '0%';
        Sidebar2.style.left = '0px';
      }, 25)
    } else {
      body.style.overflow = 'hidden scroll';
      Sidebar1.style.left = '-100%';
      Sidebar2.style.left = '-260px';
      setTimeout(()=>{
        Sidebar.style.display = 'none';
      }, 345)
    }
  }, [props.open])
  return <div className="Sidebar">
    <div className="Sidebar1"
      onClick={()=>props.sFunc(false)}></div>
    <div className="Sidebar2">
      <div className="Sidebar2Head">
        <Link to="/profile">
          <div className="s2HeadImg">
            <img src={Userpic} alt="" />
          </div>
        </Link>
      </div>
      <div className="Sidebar2Body">
        <li>
          <NavLink to="/courses">
            <div className="s2Link"
              onClick={()=>props.sFunc(false)}>
              <i className="fas fa-graduation-cap"></i>
              <h4>COURSE</h4>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/courses">
            <div className="s2Link"
              onClick={()=>props.sFunc(false)}>
              <i className="fas fa-calendar-day"></i>
              <h4>EVENTS</h4>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/blogs">
            <div className="s2Link"
              onClick={()=>props.sFunc(false)}>
              <i className="fas fa-book"></i>
              <h4>BLOGS</h4>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/portfolio">
            <div className="s2Link"
              onClick={()=>props.sFunc(false)}>
              <i className="fas fa-file-code"></i>
              <h4>PORTFOLIO</h4>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact">
            <div className="s2Link"
              onClick={()=>props.sFunc(false)}>
              <i className="fas fa-mobile"></i>
              <h4>CONTACT-US</h4>
            </div>
          </NavLink>
        </li>
        <li>
          {signedIn?
            <button type="button"
              onClick={()=>{
                props.sFunc(false);
                auth().signOut();
              }}>SIGN-OUT</button>:
            <Link to="/signbox">
              <button type="button"
                onClick={()=>props.sFunc(false)}
                >SIGN-IN</button>
            </Link>
          }
        </li>
      </div>
      <div className="Sidebar2Foot">
        <button type="button" style={{color: '#4267B2'}}>
          <i className="fab fa-facebook-f"></i>
        </button>
        <button type="button" style={{color: '#833AB4'}}>
          <i className="fab fa-instagram"></i>
        </button>
        <button type="button" style={{color: '#2867B2'}}>
          <i className="fab fa-linkedin-in"></i>
        </button>
        <button type="button" style={{color: '#D44638'}}>
          <i className="fas fa-envelope"></i>
        </button>
        <button type="button" style={{color: '#4AC959'}}>
          <i className="fab fa-whatsapp"></i>
        </button>
      </div>
    </div>
  </div>
}

function mapStateToProps(state) {
  return {
    profileImg: state.profile.image
  }
}
function mapDispatchToProps(dispatch) {
  return {
    removeProfile: ()=>{dispatch({type: 'REMOVE_PROFILE'})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);