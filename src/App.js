import React, {Component} from 'react';
import { connect } from 'react-redux';
import { auth, functions, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore';

import './App.css';
import Navbar from './components/Navbar/Navbar';
import Snackbar from './components/Snackbar/Snackbar';
import Sidebar from './components/Sidebar/Sidebar';
import Routes from './routes';
import Loading from './components/Loading/Loading';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebar: false
    }
  }

  sidebarToggle =(sidebar)=> this.setState({sidebar});
  
  componentWillMount() {
    if(auth().currentUser) {
      console.log(auth().currentUser)
      auth().currentUser.getIdTokenResult(true)
        .then(result=>{
          if(result.claims.roleA$) {
            // main-admin OR user-admin
            if(result.claims.roleA$ === 'U$ER-ADM!N') {
              // user-admin
              firestore().collection('User-Admin').doc(auth().currentUser.uid).get()
                .then(uData=>{
                  this.props.add_profile({
                    _id: auth().currentUser.uid,
                    username: auth().currentUser.displayName,
                    image: auth().currentUser.photoURL,
                    email: auth().currentUser.email,
                    mobile: uData.data().mobile,
                    joined_at: uData.data().joined_at
                  })
                  if(!sessionStorage.getItem('roleAs')) {
                    sessionStorage.setItem('roleAs', 'signedInAsUserAdmin')
                    window.location.href = '/'
                  }
                })
            } else if(result.claims.roleA$ === 'MA!N-ADM!N') {
              // main-admin
              firestore().collection('Main-Admin').doc(auth().currentUser.uid).get()
                .then(mData=>{
                  if(mData.exists) {
                    this.props.add_profile({
                      _id: auth().currentUser.uid,
                      username: auth().currentUser.displayName,
                      image: auth().currentUser.photoURL,
                      email: auth().currentUser.email,
                      mobile: mData.data().mobile,
                      joined_at: mData.data().joined_at
                    })
                    if(!sessionStorage.getItem('roleAs')) {
                      sessionStorage.setItem('roleAs', 'signedInAsMainAdmin')
                      window.location.href = '/'
                    }
                  } else {
                    firestore().collection('Main-Admin').doc(auth().currentUser.uid)
                      .set({ username: auth().currentUser.displayName,
                        mobile: '', joined_at: Date.now()})
                      .then(()=>window.location.reload()).catch(err=>console.log(err.message));
                  }
                })
            } else auth().signOut();
          } else {
            // check for main-admin or student
            functions().httpsCallable('settingClaimsForMainAdmin')({honey: 'honey'})
              .then(funcData=>{
                if(!funcData.data) {
                  // student
                  firestore().collection('Students')
                    .doc(auth().currentUser.uid).get()
                    .then(sData=>{
                      //console.log(sData)
                      if(sData.exists) {
                        // backend data exists
                        this.props.add_profile({
                          _id: auth().currentUser.uid,
                          username: auth().currentUser.displayName,
                          image: auth().currentUser.photoURL,
                          email: auth().currentUser.email,
                          mobile: sData.data().mobile,
                          joined_at: sData.data().joined_at
                        })
                      } else {
                        // backend data doesn't exists
                        if(auth().currentUser.displayName && auth().currentUser.photoURL) {
                          // first time signed in with google
                          firestore().collection('Students').doc(auth().currentUser.uid)
                            .set({
                              email: auth().currentUser.email, username: auth().currentUser.displayName,
                              mobile: '', joined_at: Date.now(), image: auth().currentUser.photoURL
                            }).then(()=>window.location.reload()).catch(err=>console.log(err.message))
                        } else {
                          // first time signed in with email and password
                          firestore().collection('Students').doc(auth().currentUser.uid)
                            .set({
                              email: auth().currentUser.email, username: '', mobile: '',
                              joined_at: Date.now(), image: ''
                            }).then(()=>window.location.reload()).catch(err=>console.log(err.message))
                        }
                      }
                    })
                } else window.location.reload()
              })
          }
        })
    }
  }
  render() {
    const { sidebar } = this.state;
    const { profile } = this.props;
    return <div className="App">
      <Navbar sFunc={this.sidebarToggle} />
      <div className="Router_View">
        <Routes />
      </div>
      <Snackbar />
      <Sidebar open={sidebar} sFunc={this.sidebarToggle} />
      <Loading load={!auth().currentUser?false:(profile._id?false:true)} />
    </div>
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile
  }
}
function mapDispatchToProps(dispatch) {
  return {
    add_profile: (payload)=>{dispatch({type: 'ADD_PROFILE', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
