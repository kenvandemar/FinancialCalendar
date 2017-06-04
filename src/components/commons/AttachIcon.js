import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { fetchAttachmentFromAPI } from '../../actions/AttachmentAction';
import Icon from 'react-native-vector-icons/Entypo';

const dataSources = [];


class AttIcon extends Component {
    componentDidMount() {
        dataSources = this.props.attachment;
       
        this.props.fetchAttachment(dataSources.Id);
    }
renderIcon() {
    if (this.props.attData.attachmentData.length > 0) {
        return (
            <Icon
                name='attachment'
            />
        )
    }
}
    render () {
        return (
            <Text>
            {this.renderIcon()}
            </Text>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        attData: state.attachmentData
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchAttachment: (id) => {
            dispatch(fetchAttachmentFromAPI(id));
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AttIcon);