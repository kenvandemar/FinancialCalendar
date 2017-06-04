import _ from 'lodash';
import React, { Component } from 'react';
import {
    View, 
    Text,
    ActivityIndicator,
    Platform,
    AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';

import CalendarListTypeItem from './CalendarListTypeItem';
import { fetchMoreTypeByNameFromAPI } from '../actions/GetTypeAction';
import { getEventByTypeLocal, getMoreEventyByTypeLocal, getMoreEventyByTypeLocalOffline } from '../actions/LocalDataAction/GetEventTypeLocalAction';
import { checkNetWorkInfo } from '../actions/CheckNetWorkAction';

let typeId = '';
let typeName = '';
let originialLastDate = '';
let moreEventTypeStorageKey = React.PropTypes.string;
const apiName = 'fincalendar';
const lang = 'en-gb';

const moreEventTypeLocal = [];

moreEventTypeStorageKey = `${lang}_${apiName}_${apiName}`;
 const pageSize = 10;
 let removeIds = '';
 let lastDate = '';
class CalendarListType extends Component {
    componentWillReceiveProps(nexProps) {

      typeId = nexProps.typeList.typeIdList;
      typeName = nexProps.typeList.typeNameList;
}

 onEndReach = () => {
      this.handleEndReach();
}

handleEndReach() {
  
        const { typeEventData } = this.props.typeList;

        lastDate = typeEventData[typeEventData.length - 1].EventDate;
        originialLastDate = typeEventData[typeEventData.length - 1].EventDate;
        
         const filterData = typeEventData.filter(data => data.EventDate.toString() === lastDate.toString());
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
    const { moreEventData } = this.props.typeList;
    this.props.fetchMoreTypeEvent(typeId, pageSize, lastDate, removeIds, typeName); 
        
   }
    if (this.props.isConnected.status === false) {
        AsyncStorage.getItem(moreEventTypeStorageKey).then((moreEventTypeData) => {
            moreEventTypeLocal = JSON.parse(moreEventTypeData);
            if (moreEventTypeLocal.length > 0 || moreEventTypeLocal !== null) {
                 this.props.getMoreEventByTypeLocalOffLine(moreEventTypeLocal, originialLastDate, removeIds, typeName);
            }
        });
    }      
}

renderFooter = () => {
     const { moreEventData } = this.props.typeList;
    if (Platform.OS === 'ios') {
        if (this.props.dataFilter.length >= 10 || moreEventData.length >= 10) {
            return (<ActivityIndicator size={'small'} />);  
        }  else if (this.props.dataFilter.length < 10 || moreEventData.length === 0) {
             return (<View />);
        }
    }       
}

    render () {
        const { typeEventData, isFetch } = this.props.typeList;
        if (isFetch) {
            return (<ActivityIndicator />)
        }
        return (
          <View>
              <CalendarListTypeItem 
                typeEventList={typeEventData}
                onEndReached={this.onEndReach}
                renderFooter={this.renderFooter}
              />
          </View>
        )
    }
}

const mapStateToProps = (state) => {
    
state.typeEventData.typeEventData = state.typeEventData.typeEventData.filter(obj => obj.EventType.toString() === state.typeEventData.typeNameList.toString());
state.typeEventData.moreEventData = state.typeEventData.moreEventData.filter(obj => obj.EventType.toString() === state.typeEventData.typeNameList.toString());

    state.typeEventData.typeEventData = state.typeEventData.typeEventData.concat(state.typeEventData.moreEventData)
    
    state.typeEventData.typeEventData = _.uniqBy(state.typeEventData.typeEventData, (x) => {
        return x.Id;
    });

    return {
        typeList: state.typeEventData,
        isConnected: state.checkNetWork.isConnected,
        typeName: state.typeEventData.typeNameList,
        dataFilter: state.typeEventData.dataFilter
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchMoreTypeEvent: (typeId, pageSize, lstDate, rmvIds, tName) => {
            dispatch(fetchMoreTypeByNameFromAPI(typeId, pageSize, lstDate, rmvIds, tName));
        },
        getEventByTypeLocal: (data) => {
            dispatch(getEventByTypeLocal(data));
        },
        getMoreEventByTypeLocal: (data, lstDates, rmvIds) => {
            dispatch(getMoreEventyByTypeLocal(data, lstDates, rmvIds));
        },
        getMoreEventByTypeLocalOffLine: (data, lstDates, rmvIds) => {
            dispatch(getMoreEventyByTypeLocalOffline(data, lstDates, rmvIds, typeName));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CalendarListType);