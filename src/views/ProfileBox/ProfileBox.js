import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth, storage, firestore } from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

import './ProfileBox.css';
import svgImage from '../../amar/undraw_files.svg';
import svgImagePic from '../../amar/undraw_profile_pic.svg';

class ProfileBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '', imageFile: null,
      uploadState: false,
      pErrorP: '',
      profileUpdated: false,
      username: '', mobile: '',
      removeAccountState: false,
      raEmail: '', raPassword: ''
    }
  }

  inputChanged =e=> {
    this.setState({[e.target.name]: e.target.value});
  }
  fileInputChanged =e=> {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload =()=> {
      this.setState({image: reader.result})
    }
    this.setState({imageFile: e.target.files[0]})
  }
  crossBtn =()=> {
    this.setState({
      uploadState: false, image: '',
      imageFile: null
    })
    this.fileInputTag.value = '';
  }
  cloudBtn =()=> {
    const { image, imageFile } = this.state;
    if(image && imageFile) {
      storage().refFromURL(`gs://developer-wizard.appspot.com/students/${imageFile.name}`)
        .put(imageFile).on('state_changed',
          null, err=>this.setState({pErrorP: err.message}),
          ()=>{
            storage().refFromURL(`gs://developer-wizard.appspot.com/students/${imageFile.name}`)
              .getDownloadURL().then(url=>this.setState({image: url, uploadState: true}))
          })
    } else console.log('IMAGE OR IMAGEFILE IS MISSING !');
  }
  updateProfile =()=> {
    const { image, username, mobile, uploadState } = this.state;
    const { profile } = this.props;
    if(!profile.image && !profile.username) {
      if(!uploadState||username===''||mobile==='') {
        this.setState({pErrorP: 'REQUIRED FIELDS R EMPTY'})
      } else {
        auth().currentUser.updateProfile({
          displayName: username,
          photoURL: image
        }).then(()=>{
          if(sessionStorage.getItem('roleAs')) {
            return firestore().collection('User-Admin').doc(profile._id)
              .update({username, mobile})
          } else {
            return firestore().collection('Students').doc(profile._id)
              .update({image, username, mobile})
          }
        }).then(()=>{
          this.setState({profileUpdated: true})
          window.location.href = '/';
        })
      }
    } else {
      let ssRole = sessionStorage.getItem('roleAs');
      if(ssRole) {
        if(ssRole === 'signedInAsUserAdmin') {
          firestore().collection('User-Admin').doc(profile._id)
            .update({ image: profile.image,
              username: profile.username,
              mobile }).then(()=>window.location.href = '/')
        } else {
          firestore().collection('Main-Admin').doc(profile._id)
            .update({mobile}).then(()=>window.location.href = '/')
        }
      } else {
        firestore().collection('Students').doc(profile._id)
          .update({mobile}).then(()=>window.location.href = '/')
      }
    }
  }

  componentWillMount() {
    onbeforeunload =()=> {
      if(this.state.uploadState && !this.state.profileUpdated) {
        storage().refFromURL(`gs://developer-wizard.appspot.com/students/${this.state.imageFile.name}`)
          .delete()
      } 
    }
  }
  render() {
    const { 
      image, uploadState, username, mobile,
      removeAccountState, raEmail, raPassword,
      pErrorP
    } = this.state;
    const { profile } = this.props;
    if(auth().currentUser) {
      return <Fragment>
        <div className="profileBoxes">
          <div className="profileBox">
            <img alt="" src={svgImage} />
            <p>
              " Live as if you were to die tomorrow.
              Learn as if you were to live forever. "
            </p>
            <p>
              " Be the change that you wish to
              see in the world. "
            </p>
            <h4 style={{letterSpacing: 1}}>
              by Mahatma Gandhi</h4>
          </div>
          <div className="profileBox">
            <div className="profileForm">
              <p>{pErrorP?pErrorP:'Change happens, when you change.'}</p>
              <div className="profileImageDiv">
                <div className="profileImage">
                  <img alt="" src={(profile.image)?profile.image:(image?image:svgImagePic)} />
                </div>
                {(profile.image?false:!uploadState)?
                  <div className="profileImageCntrl">
                    <button type="button"
                      onClick={()=>{this.fileInputTag.click()}}
                      style={{opacity: !image?1:0.4}}
                      disabled={!image?false:true}>
                      <i className="fas fa-plus"></i>
                    </button>
                    <button type="button"
                      onClick={this.crossBtn}>
                      <i className="fas fa-times"></i>
                    </button>
                    <button type="button" onClick={this.cloudBtn}
                      style={{opacity: image?1:0.4}} disabled={image?false:true}>
                      <i className="fas fa-cloud-upload-alt"></i>
                    </button>
                  </div>:
                  <div className="pImgUploadStatus">
                    {uploadState?
                      <div>
                        <h3>IMAGE UPDATED</h3>
                        <h3>SUCCESSFULLY !</h3>
                      </div>:null
                    }
                  </div>
                }
                <input type="file" ref={r=>{this.fileInputTag=r}}
                  onChange={this.fileInputChanged}
                  style={{display: 'none'}} />
              </div>
              <div className="formField">
                <h5>PROFILE-ID</h5>
                <input type="text" placeholder="PROFILE-ID"
                  value={profile._id?profile._id:''}
                  style={{fontSize: 22}} disabled />
              </div>
              <div className="formField">
                <h5>JOINED-AT</h5>
                <input type="text" placeholder="JOINED-AT"
                  value={profile.joined_at?profile.joined_at:''} disabled />
              </div>
              <div className="formField">
                <h5>USERNAME</h5>
                <input type="text" placeholder="USERNAME"
                  name="username" disabled={profile.username?true:false}
                  value={profile.username?profile.username:username}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <div className="formField">
                <h5>MOBILE</h5>
                <input type="text" placeholder="MOBILE"
                  name="mobile" disabled={profile.mobile?true:false}
                  value={profile.mobile?profile.mobile:mobile}
                  onChange={this.inputChanged} autoComplete="off" />
              </div>
              <div className="formField"
                style={{marginBottom: 50,
                opacity: (!profile.image || !profile.username || !profile.mobile)?1:0.5}}>
                <button type="button" onClick={this.updateProfile}
                  disabled={(!profile.image || !profile.username || !profile.mobile)?false:true}
                  >UPDATE PROFILE</button>
              </div>
              {!removeAccountState?
                <h4 className="ph4Tag"
                  onClick={()=>this.setState({removeAccountState: true})}
                  >REMOVE ACCOUNT</h4>:
                <div>
                  <div className="formField">
                    <h5>EMAIL</h5>
                    <input type="email" placeholder="EMAIL" name="raEmail"
                      value={raEmail} onChange={this.inputChanged} />
                  </div>
                  <div className="formField">
                    <h5>PASSWORD</h5>
                    <input type="email" placeholder="PASSWORD" name="raPassword"
                      value={raPassword} onChange={this.inputChanged} />
                  </div>
                  <div className="formField prBtns">
                    <button type="button"
                      style={{backgroundColor: '#db3236'}}
                      onClick={()=>this.setState({removeAccountState: false})}
                      >CANCEL</button>
                    <button type="button"
                      style={{backgroundColor: '#3cba54'}}
                      >CONFIRM</button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </Fragment>
    } else return <Redirect to="/signbox" />
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile
  }
}
function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBox);
