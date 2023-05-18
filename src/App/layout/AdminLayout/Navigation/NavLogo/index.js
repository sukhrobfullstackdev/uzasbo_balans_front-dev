import React from 'react';
// import DEMO from './../../../../../store/constant';
import logo from '../../../../../assets/images/uzasbo.png';

const demo = '#!';
const navLogo = (props) => {
  let toggleClass = ['mobile-menu'];
  if (props.collapseMenu) {
    toggleClass = [...toggleClass, 'on'];
  }

  return (
    <>
      <div className="navbar-brand header-logo">
        <a href='/dashboard/default' className="b-brand">
          {/* <div className="b-bg">
            <i className="feather icon-uzasbo" />
          </div> */}
          <img src={logo} alt="UzASBO" style={{ transition: 'opacity .5s ease-in-out' }} />
          {/* <span className="b-title">UzASBO</span> */}
        </a>
        <a href={demo} className={toggleClass.join(' ')} id="mobile-collapse" onClick={props.onToggleNavigation}><span /></a>
      </div>
    </>
  );
};

export default navLogo;
