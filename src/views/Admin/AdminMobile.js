import React, {Fragment} from 'react'

function AdminMobile(props) {
  return <Fragment>
    <div style={{
      width: 350, height: 'auto',
      textAlign: 'center',
      margin: '100px auto 0 auto',
    }}>
      <i className="fas fa-skull-crossbones"
        style={{fontSize: 100, color: 'red'}}></i>
      <p style={{
        textTransform: 'uppercase', fontSize: 25,
        letterSpacing: 2, marginTop: 20,
        fontWeight: 'bold', color: 'gray'
      }}>
        u can't access this route on <b style={{color: 'red'}}>mobile dimensions</b>,
        so please try on laptop or desKtop.
      </p>
    </div>
  </Fragment>
}

export default AdminMobile;