import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth } from 'firebase/app';
import 'firebase/auth';

import './Navbar.css';
import defaultImg from '../../amar/undraw_profile_pic.svg';

function Navbar(props) {
  let [signedIn, setsignedIn] = useState(false);
  let [admin, setadmin] = useState(false);
  useEffect(()=>{
    if(auth().currentUser) {
      let ssRole = sessionStorage.getItem('roleAs');
      setsignedIn(true);
      if(ssRole==='signedInAsUserAdmin'||ssRole==='signedInAsMainAdmin') {
        setadmin(true);
      }
    }
  }, [])
  return <div className="Navbar">
    <div className="Navbar1">
      <button type="button" className="sideBarBtn"
        onClick={()=>props.sFunc(true)}>
        <i className="fas fa-cannabis"></i>
      </button>
      <div className="NavbarLogo">
        <Link to="/">
          <img src={require('../../amar/whiteLogo.png')} alt="" />
        </Link>
      </div>
      <div className="NavbarLink">
        {signedIn?
          <li>
            <Link to="/profile">
              <img src={props.profileImg?props.profileImg:defaultImg} alt="" />
            </Link>
          </li>:null
        }
        <li>
          <NavLink to="/student">STUDENT</NavLink>
        </li>
        <li>
          <NavLink to="/client">CLIENT</NavLink>
        </li>
        {admin?
          <li>
            <NavLink to="/admin">ADMIN</NavLink>
          </li>:null
        }
        <li>
          <NavLink to="/contact">CONTACT-US</NavLink>
        </li>
        {!signedIn?
          <li>
            <NavLink to="/signbox">SIGN-IN</NavLink>
          </li>:
          <li>
            <button type="button"
              onClick={()=>{
                auth().signOut().then(()=>{
                  props.removeProfile();
                  sessionStorage.removeItem('roleAs');
                  window.location.reload();
                })
              }}
              >SIGN-OUT</button>
          </li>
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);