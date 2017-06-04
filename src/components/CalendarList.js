import _ from 'lodash';
import React, { Component } from 'react';
import { 
    View, 
    Text, 
    ActivityIndicator, 
    Platform, 
    Dimensions, 
    StyleSheet, 
    AsyncStorage,
    NetInfo
} from 'react-native';
import { connect } from 'react-redux';

import { create } from 'react-native-platform-stylesheet';
import {
	MediaQueryStyleSheet
} from 'react-native-responsive';

import { fetchEventFromAPI, fetchMoreEventFromAPI } from '../actions/EventAction';
import { getEventLocal, getMoreEventLocal, getMoreEventLocalOffline } from '../actions/LocalDataAction/GetEventLocalAction';
import CalendarListItem from './CalendarListItem';
import TabletDetailComponent from './TabletDetailComponent';
import { checkNetWorkInfo } from '../actions/CheckNetWorkAction';


const window = Dimensions.get('window');
let removeIds = '';
let lastDate = '';

let removeIdss = '';
let lastDatee = '';

let pagesize = 10;
const apiName = 'fincalendar';
const lang = 'en-gb';

let eventStorageKey = React.PropTypes.string;
let eventStorageKeyMore = React.PropTypes.string;

eventStorageKey = `${apiName}_${lang}`;
eventStorageKeyMore = `${lang}_${apiName}`;

const eventLocal = [];
const moreEventLocal = [];
const moreEventLocals = [];
const lastDates = '';
const originLastDate = '';
let TTL = 300000;
class CalendarList extends Component {

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this.checkNetWorkStatus);

        AsyncStorage.getItem(eventStorageKey).then((eventDatas) => {
            eventLocal = eventDatas;
            if (eventLocal === 0 || eventLocal === null) {
                if (this.props.isConnected.status === true) {
                     this.props.fetchEvent();
                }
                
            } else if (eventLocal.length > 0 || eventLocal.length !== null || this.props.isConnected === false) {
                eventLocal = JSON.parse(eventDatas).data;
                this.props.getEventLocal(eventLocal);
            }
        });
    }

    checkNetWorkStatus = (isConnected) => {
        this.props.checkNetWorkInfo({ status: isConnected});
    }
onEndReach = () => {
    this.handleEndReach();  
}

    handleEndReach() {
        const { eventData} = this.props.eventData;
        lastDate = eventData[eventData.length - 1].EventDate;
        originLastDate = eventData[eventData.length - 1].EventDate;
        

        const filterData = eventData.filter(data => data.EventDate.toString() === lastDate.toString());
        
        if (filterData.length > 0) {
            filterData.forEach(item => {
                removeIds = item.Id + ',';
            });
        }

        if (removeIds.length > 0) {
            removeIds = removeIds.slice(0, -1);
        }
        lastDate = lastDate.replace(new RegExp('\\-', 'g'), '').replace(new RegExp('\\:', 'g'), '');

        if (lastDate.indexOf('.') > 0) {
            lastDate = lastDate.substring(0, lastDate.indexOf('.'));
        }


        if (this.props.isConnected.status === true) {
            this.props.fetchMoreEvent(lastDate, removeIds, originLastDate); 
        }

   
    if (this.props.isConnected.status === false) {
        AsyncStorage.getItem(eventStorageKeyMore).then((mEventData) => {
            moreEventLocal = JSON.parse(mEventData);
            let moreEventLocalUnique = _.uniqBy(moreEventLocal, (x) => {
                return x.Id;
            });
                if (moreEventLocalUnique.length > 0  || moreEventLocalUnique !== null) {
                    this.props.getMoreEventLocalOffLine(moreEventLocalUnique, originLastDate, removeIds);
                }               
        });
    }    

    }
renderFooter = () => {
     const { moreEventData } = this.props.eventData;
    if (Platform.OS === 'ios') {
        
        if (moreEventData.length > 0) {
            return (<ActivityIndicator size={'small'} />);  
        } 
            return (<View />);
         
      
    }   
}
    
renderTablet() {
const { eventData } = this.props.eventData;

    if (window.width > 500) {
        return (
           <TabletDetailComponent eventList={eventData}/>
        );
    }
}
    render () {
        const { eventData, isFetching} = this.props.eventData;

        if (isFetching) {
            return (< ActivityIndicator />);
        }
        return (
          
                 <View style={splitStyle.container}> 
                     <View style={splitStyle.left}>
                         <CalendarListItem 
                        eventList={eventData}
                        onEndReached={this.onEndReach}  
                        renderFooter={this.renderFooter}   
                    />           
                     </View>
                   <View style={splitStyle.right}>
                       {this.renderTablet()}
                   </View>
                </View>
               
        )
    }
}
const splitStyle = MediaQueryStyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',  
        height: 550,
    },
    left: {},
    right: {}
},
 {
    '@media (min-device-width: 500)': {
        container: {
            flexDirection: 'row',
            height: 920
        },
        left: {
            flex: 4,
            borderStyle: 'solid',
            borderRightWidth: 1,
            borderRightColor: 'lightgrey'
        },
        right: {
            flex: 6
        }
    },
    '@media(max-device-width: 370)': {
        container: {
            flexDirection: 'row',
            height: 400
        }
    }
});

const mapStateToProps = (state) => {
    state.eventData.eventData = state.eventData.eventData.concat(state.eventData.moreEventData);

    state.eventData.eventData = _.unionBy(state.eventData.eventData, (x) => {
        return x.Id;
    });
    return {
        eventData: state.eventData,
        moreEventData: state.eventData,
        isConnected: state.checkNetWork.isConnected
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEvent: () => {
            dispatch(fetchEventFromAPI());
        },
        fetchMoreEvent: (lstDate, rmvId, orgLastDate) => {
            dispatch(fetchMoreEventFromAPI(lstDate, rmvId, orgLastDate));
        },
        getEventLocal: (data) => {
            dispatch(getEventLocal(data));
        },
        getMoreEventLocal: (data, lstDates, rmvIds) => {
            dispatch(getMoreEventLocal(data, lstDates, rmvIds))
        },
        checkNetWorkInfo: (isConnect) => {
            dispatch(checkNetWorkInfo(isConnect));
        },
        getMoreEventLocalOffLine: (data, lstDates, rmvIds) => {
            dispatch(getMoreEventLocalOffline(data, lstDates, rmvIds));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarList);
