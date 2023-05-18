import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// import DEMO from "../../../../../../store/constant";
// import * as actionTypes from "../../../../../../store/actions";
import NavIcon from './../NavIcon';
import NavBadge from './../NavBadge';
import NavItem from "../NavItem";
import LoopNavCollapse from './index';
import { withTranslation } from 'react-i18next';
import { collapseToggle, navCollapseLeave } from '../../../../../../store/navigation-slice';

const demo = '#!';
class NavCollapse extends Component {
  componentDidMount() {
    const currentIndex = ((document.location.pathname).toString().split('/')).findIndex(id => id === this.props.collapse.id);
    if (currentIndex > -1) {
      this.props.onCollapseToggle(this.props.collapse.id, this.props.type);
    }
  }

  render() {
    const { isOpen, isTrigger } = this.props;
    const { t } = this.props;
    let navItems = '';
    if (this.props.collapse.children) {
      const collapses = this.props.collapse.children;

      // const filteredData = collapses.filter(item => {
      //   return (JSON.parse(localStorage.getItem('userInfo')).Roles.includes(item.role) === true);
      // })

      // if (filteredData.lengh !== 0) {
      //   navItems = Object.keys(filteredData).map(item => {
      //     item = filteredData[item];
      //     switch (item.type) {
      //       case 'collapse':
      //         return <LoopNavCollapse key={item.id} collapse={item} type="sub" />;
      //       case 'item':
      //         return <NavItem layout={this.props.layout} key={item.id} item={item} />;
      //       default:
      //         return false;
      //     }
      //   });
      // }

      // console.log(filteredData);

      navItems = Object.keys(collapses).map(item => {
        item = collapses[item];
        switch (item.type) {
          case 'collapse':
            return <LoopNavCollapse key={item.id} collapse={item} type="sub" />;
          case 'item':
            return <NavItem layout={this.props.layout} key={item.id} item={item} />;
          default:
            return false;
        }
      });
    }

    let itemTitle = t(this.props.collapse.title);
    if (this.props.collapse.icon) {
      itemTitle = <span className="pcoded-mtext">{t(this.props.collapse.title)}</span>;
    }

    let navLinkClass = ['nav-link'];

    let navItemClass = ['nav-item', 'pcoded-hasmenu'];
    const openIndex = isOpen.findIndex(id => id === this.props.collapse.id);
    if (openIndex > -1) {
      navItemClass = [...navItemClass, 'active'];
      if (this.props.layout !== 'horizontal') {
        navLinkClass = [...navLinkClass, 'active'];
      }
    }

    const triggerIndex = isTrigger.findIndex(id => id === this.props.collapse.id);
    if (triggerIndex > -1) {
      navItemClass = [...navItemClass, 'pcoded-trigger'];
    }

    const currentIndex = ((document.location.pathname).toString().split('/')).findIndex(id => id === this.props.collapse.id);
    if (currentIndex > -1) {
      navItemClass = [...navItemClass, 'active'];
      if (this.props.layout !== 'horizontal') {
        navLinkClass = [...navLinkClass, 'active'];
      }
    }

    const subContent = (
      <>
        <a href={demo} className={navLinkClass.join(' ')} onClick={() => this.props.onCollapseToggle(this.props.collapse.id, this.props.type)}>
          <NavIcon items={this.props.collapse} />
          {itemTitle}
          <NavBadge layout={this.props.layout} items={this.props.collapse} />
        </a>
        <ul className="pcoded-submenu">
          {navItems}
        </ul>
      </>
    );
    let mainContent = '';
    if (this.props.layout === 'horizontal') {
      mainContent = (
        <li className={navItemClass.join(' ')} onMouseLeave={() => this.props.onNavCollapseLeave(this.props.collapse.id, this.props.type)} onMouseEnter={() => this.props.onCollapseToggle(this.props.collapse.id, this.props.type)}>
          {subContent}
        </li>
      );
    } else {
      mainContent = (
        <li className={navItemClass.join(' ')}>
          {subContent}
        </li>
      );
    }

    return (
      <>
        {mainContent}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    layout: state.navigation.layout,
    isOpen: state.navigation.isOpen,
    isTrigger: state.navigation.isTrigger
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onCollapseToggle: (id, type) => dispatch(collapseToggle({ menu: { id: id, type: type } })),
    onNavCollapseLeave: (id, type) => dispatch(navCollapseLeave({ menu: { id: id, type: type } }))
  }
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(NavCollapse)));
