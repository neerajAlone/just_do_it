import React, {useEffect} from 'react';

import './AdminModal.css';
import AdminModalContent from './AdminModalContent/AdminModalContent';

function AdminModal(props) {
  useEffect(()=>{
    let AdminModal = document.querySelector('.AdminModal');
    let AdminModal2 = document.querySelector('.AdminModal2');
    if(props.openMod) {
      AdminModal.style.display = 'flex';
      setTimeout(()=>{
        AdminModal2.style.transform = 'scale(1.1)';
      }, 20)
      setTimeout(()=>{
        AdminModal2.style.transform = 'scale(1)';
      }, 240);
    } else {
      AdminModal2.style.transform = 'scale(1.1)';
      setTimeout(()=>{
        AdminModal2.style.transform = 'scale(0)';
      }, 220);
      setTimeout(()=>{
        AdminModal.style.display = 'none';
      }, 440);
    }
  }, [props.openMod]);
  return <div className="AdminModal">
    <div className="AdminModal1"
      onClick={()=>{
        props.mFunc(false, props.modIndex);
        setTimeout(()=>{props.mFunc(false, 0)}, 440);
      }}>
    </div>
    <div className="AdminModal2">
      <AdminModalContent index={props.modIndex} />
    </div>
  </div>
}

export default AdminModal;