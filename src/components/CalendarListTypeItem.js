import React, { Component, PureComponent } from 'react';
import { 
    View, 
    Text,
    ListView,
    Platform,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import dateFormat from 'dateformat';
import { createStyles, minWidth, maxHeight } from 'react-native-media-queries';
import {
    Actions,
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';

import TabletDetailComponent from './TabletDetailComponent';
import { getEventDataNow } from '../actions/GetEventAction';
import { fetchAttachmentFromAPI } from '../actions/AttachmentAction';

const dataSources = React.PropTypes.array;
const nextDataSources = React.PropTypes.array;
let newData = [];
let theData = [];
const window = Dimensions.get('window');
const { height, width } = Dimensions.get('window');

let currentGroup = '';
let currentIndex = -1;
let eventDatas = [];

class componentName extends PureComponent {
     constructor(props) {
        super(props);
        this.state = {
            dataBlob: [],
            layout: {
                height,
                width
            },
           dataSource: new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2,
                    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
                }),
        }
        this.onLayout = this.onLayout.bind(this);
    }
onLayout = event => {
    this.setState({
      layout: {
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      }
    });
  }
  componentDidMount() {
     
      dataSources = this.props.typeEventList;
          if (dataSources.length > 0) {
                 this.loadEventData(dataSources)
                 dataSources=[];
          }
    if (window.width > 500) {
             if (dataSources.length > 0) {
                 this.props.getEventd(dataSources[0]);
                 this.props.fetchAttachment(dataSources[0].Id);
                 this.passState.bind(dataSources[0]);
             }
         }
  }

    componentWillReceiveProps(nextProp) {
        nextDataSources = nextProp.typeEventList;
        this.loadEventData(nextDataSources);
    }

passState(itemDetail) {
    return <TabletDetailComponent eventListDetail={itemDetail} />
}

loadEventData(data) {
   const tempData = [];
   const dataBlob = []
 theData = data;

   data.forEach(item => {
       const event = item;
       const date = new Date(item.EventDate);
       const group = dateFormat(date, 'mmmm yyyy');
       if (currentGroup !== group) {
           currentGroup = group;
           currentIndex++;
           eventDatas.push({ divider: currentGroup, data: []});
       }
       eventDatas[currentIndex].data.push(event)
       tempData[eventDatas[currentIndex].divider] = eventDatas[currentIndex].data;
     
        
       const newDataSource = this.state.dataSource.cloneWithRowsAndSections(tempData);
    this.setState({
        dataSource: newDataSource
    });
   })
}
renderItems(itemData) {
    if (window.width) {
        return (
        <View onLayout={this.onLayout}>
            <Text style={stylePhone.iEvenType}>
                        {itemData.EventType}
                </Text>
                <Text style={{ ...stylePhone.iContentStyle, ...stylePhone.iContenStyle2, ...styles.dateIphone4 }}>
                    {dateFormat(itemData.EventDate, 'mm/dd/yyyy')}  {dateFormat(itemData.EventDate, 'HH:MM')}
                </Text>
                
                                 
                 <Icon
                    name='chevron-thin-right'
                    style={{...stylePhone.iIconStyle, ...styles.iconIphone4}}
                 />     
                    <View 
                        style={stylePhone.iTitleStyle}
                    >
                    <Text style={stylePhone.iTitleStyle2}>  
                         {itemData.Title}
                      </Text>
                </View>   
            </View>     
        );
    } else if (window.width > 400) {
        <View onLayout={this.onLayout}>
            <Text style={styles.evenType}>
                        {itemData.EventType}
                </Text>
                <Text style={{ ...styles.contentStyle, ...styles.contenStyle2 }}>
                    {dateFormat(itemData.EventDate, 'mm/dd/yyyy')}  {dateFormat(itemData.EventDate, 'HH:MM')}
                </Text>
                
                                 
                 <Icon
                    name='chevron-thin-right'
                    style={{...stylePhone.iIconStyle, ...styles.iconIphone4}}
                 />     
                    <View 
                        style={styles.titleStyle}
                    >
                    <Text style={styles.titleStyle2}>  
                         {itemData.Title}
                      </Text>
                </View>   
            </View>     
    }
}
renderItem(item){
    return (
        <TouchableOpacity
            activeOpacity={0}
            onPress={() => {
                if (window.width <= 500) {
                    Actions.calendarDetail({ eventDetail: item})
                } else if (window.width > 500) {
                    this.props.getEventd(item);
                    this.passState.bind(this.props.eventItems);
                    this.props.fetchAttachment(item.Id)
                }
                
            }}
        >  
            <View
                onLayout={this.onLayout}
                style={{ flexDirection: 'row', flex: 1}}
            >           
                 {this.renderItems(item)}
              </View>
        </TouchableOpacity>
    )
}

renderHeader = (sectionData, sectionId) => {
    if (Platform.OS === 'ios') {
    return (
        <View style={stylePhone.iSection}>
            <Text style={stylePhone.itimeStyle}>
                     {sectionId}
            </Text>
        </View>
    );
    } else if(Platform.OS === 'android') {
    return (
        <View style={stylePhone.androidSection}>
            <Text style={stylePhone.androidTimeStyle}>
                     {sectionId}
            </Text>
        </View>
    );
    }
}

    render () {
        return (
           <ListView
            enableEmptySections
            stickySectionHeadersEnabled
            dataSource={this.state.dataSource}
            renderRow={(data) => this.renderItem(data)}
            renderSectionHeader={this.renderHeader}
            onEndReached={this.props.onEndReached}
            onEndReachedThreshold={1}
            renderFooter={this.props.renderFooter}
           />
        )
    }
}

const base = {
    evenType: {},
    timeStyle: {},
    contentStyle: {},
    contenStyle2: {},
    titleStyle: {},
    iconStyle: {},
    titleStyle2: {},
    iconIphone4: {},
    dateIphone4: {}
};

const styles = createStyles(
base,
maxHeight (480, {
    iconIphone4: {
        marginLeft: 85 * width / 100,
        marginTop: -4 * height /100
    },
    dateIphone4: {
        marginLeft: 8 * width / 100
    }
}),
 minWidth(768, {
 chosenBackground: {
        backgroundColor: '#ddd'
    },
    unChonsenBackground: {
        backgroundColor: '#fff'
    },
    generalStyle: { 
        flex: 1,
    },
    timeStyle: {
        height: 50,
        backgroundColor: '#f7f7f7',
        paddingTop: 15,  
        paddingLeft: 15,  
        fontSize: 18,
        fontWeight: '500'
    },
    contentStyle: {
        color: '#999',
        fontSize: 15,
        paddingBottom: 10
    },
    contenStyle2: {
        marginLeft: 25
    },
    evenType: {
        paddingLeft: 25,
        color: '#000',
        fontSize: 18,
        paddingBottom: 8,
        paddingTop: 10,
        fontWeight: '500',
    },
    titleStyle: {
            borderRightWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            borderStyle: 'solid',  
            paddingBottom: 5,
            paddingTop: 5,
            marginLeft: 25
    },
    titleStyle2: {
        color: '#999',
        fontSize: 15,
        paddingBottom: 1 * height / 100,
    },
    iconStyle: {
        flex: 1,
        color: '#cdccd1',
        fontSize: 2 * height / 100,    
        marginLeft: 35 * width / 100,
        marginTop: -4 * width / 100,
        marginBottom: 7,    
    }
})    
);

const stylePhone = {
    iSection: {
        height: 30,
        backgroundColor: '#f7f7f7',
        marginBottom: 10
    },
    androidSection: {
        height: 30,
        backgroundColor: '#f7f7f7',
        paddingLeft: 10
    },
    iTimeStyle: {
        fontSize: 18,
        fontWeight: '500'
    },
    androidTimeStyle: {
        fontSize: 18,
        color: '#000'
    },
    iContentStyle: {
        color: '#999',
        fontSize: 2.5 * height / 100,
        paddingBottom: 1.5 * height / 100,
    },
    iContenStyle2: {
        marginLeft: 7 * width / 100
    },
    iEvenType: {
        paddingLeft: 25,
        color: '#000',
        fontSize: 18,
        paddingBottom: 8,
        paddingTop: 10,
        fontWeight: '500',
    },
    iTitleStyle: {
            borderRightWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            borderStyle: 'solid',  
            paddingBottom: 5,
            paddingTop: 5,
            marginLeft: 25
    },
    iTitleStyle2: {
        color: '#999',
        fontSize: 2.5 * height / 100,
        paddingBottom: 1 * height / 100,
    },
    iIconStyle: {
        flex: 1,
        color: '#cdccd1',
        fontSize: 2 * height / 100,    
        marginLeft: 90 * width / 100,
        marginTop: -7.5 * width / 100,
        marginBottom: 1 * width / 100,    
    },
     itimeStyle: {
        height: 50,
        backgroundColor: '#f7f7f7',
        paddingTop: 15,  
        paddingLeft: 15,  
        fontSize: 18,
        fontWeight: '500',
        paddingRight: 100 * width / 100
    },
};
const mapStateToProps = (state) => {
    return {
        eventDatas: state.eventData,
        eventItems: state.getEvent.eventList,
        attData: state.attachmentData
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getEventd: (evtd) => {
            dispatch(getEventDataNow(evtd));
        },
        fetchAttachment: (id) => {
            dispatch(fetchAttachmentFromAPI(id));
        }
    }
}

export default componentName