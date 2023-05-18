import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import windowSize from 'react-window-size';
import { withTranslation } from 'react-i18next';

import NavIcon from "./../NavIcon";
import NavBadge from "./../NavBadge";
// import * as actionTypes from "../../../../../../store/actions";
import { collapseMenu, navContentLeave } from '../../../../../../store/navigation-slice';

class NavItem extends Component {
  render() {
    let mainContent = '';
    const { t } = this.props;
    let itemTitle = t(this.props.item.title);
    if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes(this.props.item.role)) {
      if (this.props.item.icon) {
        itemTitle = <span className="pcoded-mtext">{t(this.props.item.title)}</span>;
      }

      let itemTarget = '';
      if (this.props.item.target) {
        itemTarget = '_blank';
      }

      let subContent;
      if (this.props.item.external) {
        subContent = (
          <a href={this.props.item.url} target='_blank' rel='noopener noreferrer'>
            <NavIcon items={this.props.item} />
            {itemTitle}
            <NavBadge layout={this.props.layout} items={this.props.item} />
          </a>
        );
      } else {
        subContent = (
          <>
            <NavLink
              to={this.props.item.url}
              className="nav-link"
              exact={true}
              target={itemTarget}>
              <NavIcon items={this.props.item} />
              {itemTitle}
              <NavBadge layout={this.props.layout} items={this.props.item} />
            </NavLink>
          </>
        );
      }

      if (this.props.layout === 'horizontal') {
        mainContent = (
          <li onClick={this.props.onItemLeave}>{subContent}</li>
        );
      } else {
        if (this.props.windowWidth < 992) {
          mainContent = (
            <li className={this.props.item.classes} onClick={this.props.onItemClick}>{subContent}</li>
          );
        } else {
          mainContent = (
            <li className={this.props.item.classes}>{subContent}</li>
          );
        }
      }
    }

    // const { t } = this.props;
    // let itemTitle = t(this.props.item.title);
    // if (this.props.item.icon) {
    //   itemTitle = <span className="pcoded-mtext">{t(this.props.item.title)}</span>;
    // }

    // let itemTarget = '';
    // if (this.props.item.target) {
    //   itemTarget = '_blank';
    // }

    // let subContent;
    // if (this.props.item.external) {
    //   subContent = (
    //     <a href={this.props.item.url} target='_blank' rel='noopener noreferrer'>
    //       <NavIcon items={this.props.item} />
    //       {itemTitle}
    //       <NavBadge layout={this.props.layout} items={this.props.item} />
    //     </a>
    //   );
    // } else {
    //   subContent = (
    //     <NavLink
    //       to={this.props.item.url}
    //       className="nav-link"
    //       exact={true}
    //       target={itemTarget}>
    //       <NavIcon items={this.props.item} />
    //       {itemTitle}
    //       <NavBadge layout={this.props.layout} items={this.props.item} />
    //     </NavLink>
    //   );
    // }
    // let mainContent = '';
    // if (this.props.layout === 'horizontal') {
    //   mainContent = (
    //     <li onClick={this.props.onItemLeave}>{subContent}</li>
    //   );
    // } else {
    //   if (this.props.windowWidth < 992) {
    //     mainContent = (
    //       <li className={this.props.item.classes} onClick={this.props.onItemClick}>{subContent}</li>
    //     );
    //   } else {
    //     mainContent = (
    //       <li className={this.props.item.classes}>{subContent}</li>
    //     );
    //   }
    // }

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
    collapseMenu: state.navigation.collapseMenu
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onItemClick: () => dispatch(collapseMenu()),
    onItemLeave: () => dispatch(navContentLeave())
  }
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(windowSize(NavItem))));
