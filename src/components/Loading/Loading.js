import React from 'react';

function Loading(props) {
  return <div style={{
    width: '100%', height: '100%',
    backgroundColor: 'white',
    position: 'fixed', top: 0,
    left: 0, zIndex: 1500,
    display: props.load?'flex':'none',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <img src={require('../../amar/developerWizardsLogoOrange.png')}
      alt="" width="200" height="auto" />
  </div>
}

export default Loading;