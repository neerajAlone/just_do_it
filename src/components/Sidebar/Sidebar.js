import React, {useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from 'firebase/app';
import 'firebase/auth';

import './Sidebar.css';
import Userpic from '../../amar/undraw_profile_pic.svg';

function Sidebar(props) {
  let [signedIn, setsignedIn] = useState(false);
  let [admin, setadmin] = useState(false);
  useEffect(()=>{
    if(auth().currentUser) {
      setsignedIn(true);
      let ssRole = sessionStorage.getItem('roleAs');
      if(ssRole==='signedInAsUserAdmin'||ssRole==='signedInAsMainAdmin') {
        setadmin(true);
      }
    }
  }, [])
  useEffect(()=>{
    let Sidebar = document.querySelector('.Sidebar'),
        Sidebar1 = Sidebar.querySelector('.Sidebar1'),
        Sidebar2 = Sidebar.querySelector('.Sidebar2');
    if(props.open) {
      Sidebar.style.display = 'flex';
      setTimeout(()=>{
        Sidebar1.style.left = '0%';
        Sidebar2.style.left = '0px';
      }, 25)
    } else {
      Sidebar1.style.left = '-100%';
      Sidebar2.style.left = '-320px';
      setTimeout(()=>{
        Sidebar.style.display = 'none';
      }, 345)
    }
  }, [props.open])
  return <div className="Sidebar">
    <div className="Sidebar1"
      onClick={()=>props.sFunc(false)}></div>
    <div className="Sidebar2">
      <NavLink to="/profile">
        <div className="s2ProfileLink">
          <img alt="" src={props.profileImg?props.profileImg:Userpic} />
          <div>
            <div className="s2FlexDiv">
              <h5>UserName</h5>
            </div>
            <div className="s2FlexDiv">
              <h5>email@test.com</h5>
            </div>
          </div>
        </div>
      </NavLink>
      <ul>
        <li>
          <NavLink to="/" onClick={()=>props.sFunc(false)}>
            <div className="s2Link">
              <i className="fas fa-home"></i>
              <h4>HOME</h4>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/student" onClick={()=>props.sFunc(false)}>
            <div className="s2Link">
              <i className="fas fa-graduation-cap"></i>
              <h4>STUDENT</h4>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/client" onClick={()=>props.sFunc(false)}>
            <div className="s2Link">
              <i className="fas fa-user-tie"></i>
              <h4>CLIENT</h4>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/blog" onClick={()=>props.sFunc(false)}>
            <div className="s2Link">
              <i className="fas fa-theater-masks"></i>
              <h4>BLOGS</h4>
            </div>
          </NavLink>
        </li>
        {admin?
          <li>
            <NavLink to="/admin" onClick={()=>props.sFunc(false)}>
              <div className="s2Link">
                <i className="fas fa-user-cog"></i>
                <h4>ADMIN</h4>
              </div>
            </NavLink>
          </li>:null
        }
        <li>
          <NavLink to="/contact" onClick={()=>props.sFunc(false)}>
            <div className="s2Link">
              <i className="fas fa-phone"></i>
              <h4>CONTACT-US</h4>
            </div>
          </NavLink>
        </li>
        {signedIn?
          <li>
            <button type="button"
              style={{backgroundColor: 'transparent'}}
              onClick={()=>auth().signOut().then(()=>{
                props.removeProfile();
                sessionStorage.removeItem('roleAs');
                window.location.reload();
              })}>
              <div className="s2Link">
                <i className="fas fa-sign-out-alt"></i>
                <h4>SIGN-OUT</h4>
              </div>
            </button>
          </li>:
          <li>
            <NavLink to="/signbox" onClick={()=>props.sFunc(false)}>
              <div className="s2Link">
                <i className="fas fa-sign-in-alt"></i>
                <h4>SIGN-IN</h4>
              </div>
            </NavLink>
          </li>
        }
      </ul>
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