import React, {Fragment, useEffect} from 'react';
import { connect } from 'react-redux';

import './Home.css';

function Home(props) {
  function homeHeader1ImgAni() {
    let hImg = document.querySelector('.hImg');
    setTimeout(()=>{
      hImg.style.transform = 'scale(1.2)';
    }, 20);
    setTimeout(()=>{
      hImg.style.transform = 'scale(1)';
    }, 385)
  }

  useEffect(()=>{
    homeHeader1ImgAni()
  }, [])

  return <Fragment>
    <div className="homeHeader">
      <div className="homeHeader1">
        <div className="quotes">
          <p>
            " Success is not final; failure is not
            fatal: It is the courage to continue that counts. "
          </p>
          <h4> -- Winston S. Churchill</h4>
          <p style={{marginTop: 35}}>
            " Try not to become a man of success.
            Rather become a man of value. "
          </p>
          <h4> -- Albert Einstein</h4>
        </div>
      </div>
      <div className="homeHeader1">
        <img src={require('../../amar/orangeLogo.png')}
          alt="" className="hImg" />
      </div>
    </div>
    <div className="homeBox">
      <div className="homeBox1">
        <img src={require('../../amar/pic2.png')} alt="" />
      </div>
      <div className="homeBox1">
        <p>
          Here we serve both Clients and Student with our best Knowledge
          in Information Technology. 
        </p>
      </div>
    </div>
    <div className="homeBox hb2">
      <div className="homeBox1">
        <p>
          For Students we provide great courses based on Web &
          Mobile development, also on different computer languages.
        </p>
      </div>
      <div className="homeBox1">
        <img src={require('../../amar/pic10.png')} alt="" />
      </div>
    </div>
    <div className="homeBox">
      <div className="homeBox1">
        <img src={require('../../amar/pic11.png')} alt="" />
      </div>
      <div className="homeBox1">
        <p>
          For Clients we provide them better solution &
          development services from our top class
          developers.
        </p>
      </div>
    </div>
    <div className="homeBox hb2">
      <div className="homeBox1">
        <p>
          We always believe in our knowledge and
          ability for better and successful future
          for all who need us.
        </p>
      </div>
      <div className="homeBox1">
        <img src={require('../../amar/pic1.png')} alt="" />
      </div>
    </div>
    <div className="extraBox"></div>
  </Fragment>
}

function mapStateToProps(state) {
  return {
    snackBar: state.snackBar
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openSnackbar: (payload)=>{dispatch({type: 'SNACK_IT', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);