import React, { Component } from 'react';
import { View, Text, NetInfo } from 'react-native';
import Header from './Header';

class Calendar extends Component {

    constructor(props) {
    super(props);
  }
    render() {
        return (
                <Header />
        );
    }
}
export default Calendar;
