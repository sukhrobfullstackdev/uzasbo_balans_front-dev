import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import windowSize from 'react-window-size';

import NavLogo from './NavLogo';
import NavContent from './NavContent';
import OutsideClick from './OutsideClick';
import navigation from '../../../../menu-items/menu-items';
import adminNavigation from '../../../../menu-items/admin-menu-items';
import dashboardNavigation from '../../../../menu-items/dashboard-menu-items';
import { changeLayout, collapseMenu } from '../../../../store/navigation-slice';

class Navigation extends Component {
  resize = () => {
    const contentWidth = document.getElementById('root').clientWidth;

    if (this.props.layout === 'horizontal' && contentWidth < 992) {
      this.props.onChangeLayout('vertical');
    }
  };

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  render() {
    let navClass = [
      'pcoded-navbar',
    ];

    let navigationMenu = navigation.items;
    if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('UserView')) {
      navigationMenu = adminNavigation.items;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('Dashboard')){
      navigationMenu = dashboardNavigation.items;
    }

    if (this.props.preLayout !== null && this.props.preLayout !== '' && this.props.preLayout !== 'layout-6' && this.props.preLayout !== 'layout-8') {
      navClass = [...navClass, this.props.preLayout];
    } else {
      navClass = [
        ...navClass,
        this.props.layoutType,
        this.props.navBackColor,
        this.props.navBrandColor,
        'drp-icon-' + this.props.navDropdownIcon,
        'menu-item-icon-' + this.props.navListIcon,
        this.props.navActiveListColor,
        this.props.navListTitleColor,
      ];

      if (this.props.layout === 'horizontal') {
        navClass = [...navClass, 'theme-horizontal'];
      }

      if (this.props.navBackImage) {
        navClass = [...navClass, this.props.navBackImage];
      }

      if (this.props.navIconColor) {
        navClass = [...navClass, 'icon-colored'];
      }

      if (!this.props.navFixedLayout) {
        navClass = [...navClass, 'menupos-static'];
      }

      if (this.props.navListTitleHide) {
        navClass = [...navClass, 'caption-hide'];
      }
    }

    if (this.props.windowWidth < 992 && this.props.collapseMenu) {
      navClass = [...navClass, 'mob-open'];
    } else if (this.props.collapseMenu) {
      navClass = [...navClass, 'navbar-collapsed'];
    }

    if (this.props.preLayout === 'layout-6') {
      document.body.classList.add('layout-6');
      document.body.style.backgroundImage = this.props.layout6Background;
      document.body.style.backgroundSize = this.props.layout6BackSize;
    }

    if (this.props.preLayout === 'layout-8') {
      document.body.classList.add('layout-8');
    }

    // if (this.props.layoutType === 'dark') {
    //   document.body.classList.add('datta-dark');
    // } else {
    //   document.body.classList.remove('datta-dark');
    // }

    if (this.props.rtlLayout) {
      document.body.classList.add('datta-rtl');
    } else {
      document.body.classList.remove('datta-rtl');
    }
    //+9989946404188








    

    if (this.props.boxLayout) {
      document.body.classList.add('container');
      document.body.classList.add('box-layout');
    } else {
      document.body.classList.remove('container');
      document.body.classList.remove('box-layout');
    }

    let navContent = (
      <div className="navbar-wrapper">
        <NavLogo collapseMenu={this.props.collapseMenu} windowWidth={this.props.windowWidth} onToggleNavigation={this.props.onToggleNavigation} />
        <NavContent navigation={navigationMenu} />
      </div>
    );
    if (this.props.windowWidth < 992) {
      navContent = (
        <OutsideClick>
          <div className="navbar-wrapper">
            <NavLogo collapseMenu={this.props.collapseMenu} windowWidth={this.props.windowWidth} onToggleNavigation={this.props.onToggleNavigation} />
            <NavContent navigation={navigationMenu} />
          </div>
        </OutsideClick>
      );
    }

    return (
      <>
        <nav className={navClass.join(' ')}>
          {navContent}
        </nav>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    layout: state.navigation.layout,
    preLayout: state.navigation.preLayout,
    collapseMenu: state.navigation.collapseMenu,
    layoutType: state.navigation.layoutType,
    navBackColor: state.navigation.navBackColor,
    navBackImage: state.navigation.navBackImage,
    navIconColor: state.navigation.navIconColor,
    navBrandColor: state.navigation.navBrandColor,
    layout6Background: state.navigation.layout6Background,
    layout6BackSize: state.navigation.layout6BackSize,
    rtlLayout: state.navigation.rtlLayout,
    navFixedLayout: state.navigation.navFixedLayout,
    boxLayout: state.navigation.boxLayout,
    navDropdownIcon: state.navigation.navDropdownIcon,
    navListIcon: state.navigation.navListIcon,
    navActiveListColor: state.navigation.navActiveListColor,
    navListTitleColor: state.navigation.navListTitleColor,
    navListTitleHide: state.navigation.navListTitleHide
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleNavigation: () => dispatch(collapseMenu()),
    onChangeLayout: (layout) => dispatch(changeLayout(layout)),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(windowSize(Navigation)));
