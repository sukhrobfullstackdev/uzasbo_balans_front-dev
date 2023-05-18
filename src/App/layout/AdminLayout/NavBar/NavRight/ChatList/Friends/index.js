import React, { Component } from 'react';

import friend from './friends';
import Friend from './Friend';
import Chat from './Chat';
class Friends extends Component {
  state = {
    chatOpen: false,
    user: []
  };

  // componentWillReceiveProps = (nextProps) => {
  //   if (!nextProps.listOpen) {
  //     this.setState({ chatOpen: false, user: [] });
  //   }
  // };

  render() {
    const friendList = (friend).map(f => {
      return <Friend key={f.id} data={f} activeId={this.state.user.id} clicked={() => this.setState({ chatOpen: true, user: f })} />;
    });
    return (
      <>
        {friendList}
        <Chat user={this.state.user} chatOpen={this.state.chatOpen} listOpen={this.props.listOpen} closed={() => this.setState({ chatOpen: false, user: [] })} />
      </>
    );
  }
}

export default Friends;
