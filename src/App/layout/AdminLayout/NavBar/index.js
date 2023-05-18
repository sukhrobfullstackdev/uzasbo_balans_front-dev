import React, { Component } from 'react';
import { connect } from 'react-redux';

import NavLeft from "./NavLeft";
import NavRight from "./NavRight";
// import DEMO from "../../../../store/constant";
// import * as actionTypes from "../../../../store/actions";
import logo from '../../../../assets/images/uzasbo.png';
import { collapseMenu } from '../../../../store/navigation-slice';

const demo = '#!';
class NavBar extends Component {
  render() {
    let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', this.props.headerBackColor];
    if (this.props.headerFixedLayout) {
      headerClass = [...headerClass, 'headerpos-fixed'];
    }

    let toggleClass = ['mobile-menu'];
    if (this.props.collapseMenu) {
      toggleClass = [...toggleClass, 'on'];
    }

    return (
      <>
        <header className={headerClass.join(' ')}>
          <div className="m-header">
            <a className={toggleClass.join(' ')} id="mobile-collapse1" href={demo} onClick={this.props.onToggleNavigation}><span /></a>
            <a href={demo} className="b-brand">
              {/* <div className="b-bg">
                <i className="feather icon-trending-up" />
              </div>
              <span className="b-title">Datta Able</span> */}
              <img src={logo} alt="UzASBO" style={{ transition: 'opacity .5s ease-in-out' }} />
            </a>
          </div>
          <a className="mobile-menu" id="mobile-header" href={demo}><i className="feather icon-more-horizontal" /></a>
          <div className="collapse navbar-collapse">
            <NavLeft />
            <NavRight rtlLayout={this.props.rtlLayout} />
          </div>
        </header>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    rtlLayout: state.navigation.rtlLayout,
    headerBackColor: state.navigation.headerBackColor,
    headerFixedLayout: state.navigation.headerFixedLayout,
    collapseMenu: state.navigation.collapseMenu
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleNavigation: () => dispatch(collapseMenu()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
