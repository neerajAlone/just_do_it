import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { functions, firestore } from 'firebase/app';
import 'firebase/functions';
import 'firebase/firestore';

import './MainAdmin.css';
import userImg from '../../../amar/undraw_profile_pic.svg';
import AdminModal from '../AdminModal/AdminModal';

class MainAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalIndex: 0,

      maEmail: '',
      maPassword: '',
      maRePassword: '',
      test: false
    }
  }

  inputChanged =e=> {
    this.setState({[e.target.name]: e.target.value});
  }
  toggleModal =(showModal, modalIndex)=> {
    this.setState({showModal, modalIndex});
  }
  createAdmin =()=> {
    const { maEmail, maPassword, maRePassword } = this.state;
    if(
      maEmail===''||maPassword===''||
      maRePassword===''||maPassword!==maRePassword) {
      console.log('Fields are INVALID')
    } else {
      // user-admin added through FCFs
      functions().httpsCallable('settingClaimsForUserAdmin')({email: maEmail, password: maPassword})
        .then(({data})=>{
          console.log(data)
          if(data.state) {
            this.props.callSnackbar(data.mssg);
            this.setState({maEmail: '', maPassword: '', maRePassword: ''});
          } else this.props.callSnackbar(data.mssg);
        })
    } 
  }
  toggleDisabled =(uid, status)=>{
    functions().httpsCallable('disableUserAdmin')({uid, status})
      .then(({data})=>{
        if(data.state) this.props.callSnackbar(data.mssg)
        else this.props.callSnackbar(data.mssg);
      })
  }
  componentWillMount() {
    firestore().collection('User-Admin')
      .onSnapshot(snapShot=>{
        let emptyArray = [];
        snapShot.docs.forEach(eUserAdmin=>{
          emptyArray.push({
            _id: eUserAdmin.id,
            image: eUserAdmin.data().image,
            email: eUserAdmin.data().email,
            username: eUserAdmin.data().username,
            mobile: eUserAdmin.data().mobile,
            available: eUserAdmin.data().available,
            disabled: eUserAdmin.data().disabled
          })
        })
        console.log(emptyArray);
        this.props.getAllUserAdmins(emptyArray)
      })
  }
  render() {
    const {
      showModal, modalIndex,
      maEmail, maPassword, maRePassword,
    } = this.state;
    const { userAdminArray } = this.props;
    return <Fragment>
      <div className="parentGrid">
        <div className="maChildGrid1">
          <div className="maAddUserAdmin">
            <h1>CREATE ADMIN...</h1>
            <div className="formField">
              <h5>EMAIL</h5>
              <input type="email" placeholder="EMAIL"
                value={maEmail} onChange={this.inputChanged}
                name="maEmail" autoComplete="off" />
            </div>
            <div className="formField">
              <h5>PASSWORD</h5>
              <input type="password" placeholder="PASSWORD"
                value={maPassword} onChange={this.inputChanged}
                name="maPassword" autoComplete="off" />
            </div>
            <div className="formField">
              <h5>RE-PASSWORD</h5>
              <input type="text" placeholder="RE-PASSWORD"
                value={maRePassword} onChange={this.inputChanged}
                name="maRePassword" autoComplete="off" />
            </div>
            <div className="formField">
              <button type="button" onClick={this.createAdmin}
                >CREATE ADMIN</button>
            </div>
          </div>
        </div>
        
        <div className="maChildGrid2">
          <div className="userAdminsList">
            <div className="userAdminBoxes">
              {userAdminArray && userAdminArray.map(euObj=>{
                return <div className="userAdminBox"
                  key={euObj._id}>
                  <div className="userAdminBoxHead">
                    <div className="userAdminBoxHead1">
                      <div className="userAdminImg">
                        <img alt="" src={euObj.image?euObj.image:userImg} />
                      </div>
                      {euObj.available?
                        <i className="fas fa-check-circle" style={{color: '#0F9D58'}}></i>
                        :<i className="fas fa-circle" style={{color: '#DB4437'}}></i>
                      }
                    </div>
                    <div className="userAdminCntrls">
                      {euObj.disabled?
                        <button type="button" style={{color: '#DB4437'}}
                          onClick={()=>this.toggleDisabled(euObj._id, false)}>
                          <i className="fas fa-lock"></i>
                        </button>:
                        <button type="button" style={{color: '#0F9D58'}}
                          onClick={()=>this.toggleDisabled(euObj._id, true)}>
                          <i className="fas fa-unlock"></i>
                        </button>
                      }
                    </div>
                  </div>
                  <div className="userAdminBoxBody">
                    <div className="usDisplayh5">
                      <h5>{euObj.username}</h5>
                    </div>
                    <div className="usDisplayh5">
                      <h5>{euObj.email}</h5>
                    </div>
                    <div className="usDisplayh5">
                      <h5>{euObj.mobile}</h5>
                    </div>
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>
        
        <div className="childGrid3">
          <img src={require('../../../amar/orangeLogo.png')} alt="" />
        </div>
        
        <div className="maChildGrid4">
          <div className="mssgAnduaHistory">
            <div className="mssgAnduaHistory1">
              <div className="mssgAnduaHistory1Head">
                <h4>USER-ADMINS HISTORY</h4>
              </div>
              <div className="mssgAnduaHistory1Body">
                <div className="mssgAnduaHistory1Body1">
                  <div className="maReplyBox">
                    <div className="userAdminMssgBoxHead1">
                      <img alt="" src={userImg} />
                      <div>
                        <h5>Username</h5>
                        <h5>12-01-1996 11:30 AM</h5>
                      </div>
                    </div>
                    <p>
                      Text messaging, or texting, is the act
                      Text messaging, or texting, is the ac
                      of composing and sending electronic messages.
                    </p>
                  </div>
                  <div className="maReplyBox">
                    <div className="userAdminMssgBoxHead1">
                      <img alt="" src={userImg} />
                      <div>
                        <h5>Username</h5>
                        <h5>12-01-1996 11:30 AM</h5>
                      </div>
                    </div>
                    <p>
                      Text messaging, or texting, is the act
                      of composing and sending electronic messages.
                    </p>
                  </div>
                  <div className="maReplyBox">
                    <div className="userAdminMssgBoxHead1">
                      <img alt="" src={userImg} />
                      <div>
                        <h5>Username</h5>
                        <h5>12-01-1996 11:30 AM</h5>
                      </div>
                    </div>
                    <p>
                      Text messaging, or texting, is the act
                      of composing and sending electronic messages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="maChildGrid5">
          <div className="blogContainerHead"></div>
          <div className="blogContainer">
            <div className="blogContainer1">
              <div className="blogBox">
                <div className="blogBoxHead">
                  <img src={userImg} alt="" />
                  <button type="button">
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
                <div className="blogBoxBody">
                  <div className="blogBTile">
                    <h5>Username</h5>
                  </div>
                  <div className="blogBTile">
                    <h5>12-01-1996 11:30 AM</h5>
                  </div>
                  <div className="blogBTile">
                    <h5>BlogTitle</h5>
                  </div>
                </div>
              </div>
              <div className="blogBox"></div>
            </div>
          </div>
        </div>
      </div>
      <AdminModal openMod={showModal} modIndex={modalIndex}
        mFunc={this.toggleModal} />
    </Fragment>
  }
}

function mapStateToProps(state) {
  return {
    userAdminArray: state.reqArrays.userAdmins
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getAllUserAdmins: (payload)=>{dispatch({type: 'RETRIEVE_ALL_USER_ADMINS', payload})},
    callSnackbar: (payload)=>{dispatch({type: 'SNACK_IT', payload})}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainAdmin);