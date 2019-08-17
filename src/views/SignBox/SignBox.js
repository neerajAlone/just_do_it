import React, {Fragment, Component} from 'react';
import { auth, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import './SignBox.css';
import svgImg from '../../amar/undraw_Tree.svg';

class SignBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      re_password: '',
      errorP: null,
      signin: true
    }
  }

  inputChange =e=> {
    this.setState({[e.target.name]: e.target.value});
  }
  googleSignInFunc =()=> {
    let provider = new auth.GoogleAuthProvider();
    auth().signInWithPopup(provider)
      .then(()=>{window.location.reload()})
      .catch((err)=>console.log(err))
  }
  signUp =()=> {
    const { email, password, re_password } = this.state;
    if(
      email===''||password===''||re_password===''||
      password!==re_password) {
      this.setState({errorP: 'Something is INVALID follow below INSTRUCTION.'})
    } else {
      auth().createUserWithEmailAndPassword(email, password)
        .then(({user})=>{
          return firestore().collection('Students').doc(user.uid)
            .set({ email: user.email, username: '',
              mobile: '', image: '', joined_at: Date.now()
            })
        })
        .then(()=>window.location.reload())
        .catch(err=>this.setState({errorP: err.message}))
    }
  }
  signIn =()=> {
    const { email, password } = this.state;
    if(email===''||password==='') {
      this.setState({errorP: 'Fields are INVALID'});
    } else {
      auth().signInWithEmailAndPassword(email, password)
        .then(()=>{
          this.setState({errorP: '', email: '', password: ''});
          window.location.href = '/';
        }).catch(err=>this.setState({errorP: err.message}));
    }
  }

  componentWillMount() {
    if(auth().currentUser) this.props.history.push('/');
  }
  render() {
    const {
      email, errorP,
      password, re_password, signin
    } = this.state;
    return <Fragment>
      <h1 className="SignBoxTitle">JOIN WITH US...</h1>
      <div className="SignBoxContainer">
        <div className="SignBoxs">
          <img alt="" src={svgImg} />
          <div className="SignBoxsQuote">
            <p>" With great power, comes great responsibility. "</p>
            <h4>-- Uncle Ben (SpiderMan).</h4>
          </div>
        </div>
        <div className="SignBoxs">
          <p className="sErrorP"
            style={{color: errorP?'red':'green'}}
            >{errorP?errorP:(signin?'HELLO GUYS.':'AS U SIGN-UP, UR LOGGED IN AS STUDENT.')}</p>
          <div className="SignBoxForms">
            <div className="SignBoxForm"
              style={{opacity: signin?0:1, zIndex: signin?1:2,
              transform: `scale(${signin?0:1})`}}>
              <div className="formField">
                <h5>EMAIL</h5>
                <input type="email" placeholder="EMAIL" name="email"
                  value={email} onChange={this.inputChange} />
              </div>
              <div className="formField">
                <h5>PASSWORD</h5>
                <input type="password" placeholder="PASSWORD"
                  name="password" value={password}
                  onChange={this.inputChange} />
              </div>
              <div className="formField">
                <h5>RE-PASSWORD</h5>
                <input type="password" placeholder="RE-PASSWORD"
                  name="re_password" value={re_password}
                  onChange={this.inputChange} />
              </div>
              <div className="formField">
                <button type="button" onClick={this.signUp}
                  >SIGN-UP</button>
              </div>
              <div className="formField">
                <h4 onClick={()=>this.setState({signin: true})}
                  >SIGN-IN</h4>
              </div>
            </div>
            <div className="SignBoxForm"
              style={{opacity: !signin?0:1, zIndex: !signin?1:2,
              transform: `scale(${!signin?0:1})`}}>
              <div className="formField">
                <h5>EMAIL</h5>
                <input type="email" placeholder="EMAIL" name="email"
                  value={email} onChange={this.inputChange} />
              </div>
              <div className="formField">
                <h5>PASSWORD</h5>
                <input type="password" placeholder="PASSWORD" name="password"
                  value={password} onChange={this.inputChange} />
              </div>
              <div className="formField">
                <button type="button"
                  onClick={this.signIn}>SIGN-IN</button>
              </div>
              <div className="formField googleSign">
                <p>OR</p>
                <button type="button"
                  onClick={this.googleSignInFunc}>GOOGLE</button>
              </div>
              <div className="formField">
                <h4 onClick={()=>this.setState({signin: false})}
                  >SIGN-UP</h4>
              </div>
            </div>
          </div>
          {!signin?
            <div className="formField">
              <h5>INSTRUCTION TO SIGN-UP</h5>
              <ul>
                <li>All Fields must be filled.</li>
                <li>EMAIL must have @EMAIL-END.com.</li>
                <li>
                  PASSWORD must have length >=7 and must
                  contain atleast one Capital letter,
                  one Small letter and one Symbol from ().
                </li>
                <li>PASSWORD and RE-PASSWORD must be matched.</li>
              </ul>
            </div>:null
          }
        </div>
      </div>
    </Fragment>
  }
}

export default SignBox;