import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './Snackbar.css';

function Snackbar(props) {
  useEffect(()=>{
    if(props.snackBar.snack) {
      document.querySelector('.Snackbar')
        .style.display = 'flex';
      setTimeout(()=>{
        document.querySelector('.Snackbar').children[0]
          .style.transform = 'translateY(25px) scale(1)';
      }, 25)
      setTimeout(()=>{
        document.querySelector('.Snackbar').children[0]
          .style.transform = 'translateY(0px) scale(0)';
      }, 1500)
      setTimeout(()=>{
        props.closeSnackbar()
        document.querySelector('.Snackbar')
          .style.display = 'none';
      }, 1600)
    }
  }, [props.snackBar])
  return <div className="Snackbar">
    <p>{props.snackBar.bar}</p>
  </div>
}

function mapStateToProps(state) {
  return {
    snackBar: state.snackBar
  }
}

function mapDispatchToProps(dispatch) {
  return {
    closeSnackbar: ()=>{dispatch({type: 'DONT_SNACK'})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);