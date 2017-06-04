import _  from 'lodash';
import React, { Component } from 'react';

import { View, Dimensions, Text, AsyncStorage, NetInfo, } from 'react-native';
import { connect } from 'react-redux';
import { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { create } from 'react-native-platform-stylesheet';
import { fetchTypeFromAPI } from '../actions/TypeAction';
import { getTypeId, getTypeName, fetchTypeByNameFromAPI } from '../actions/GetTypeAction';
import CalendarList from './CalendarList';
import CalendarListType from './CalendarListType';
import DownloadAllEvent from './commons/DownloadAllEvent';
import { getTypeByNameLocal } from '../actions/LocalDataAction/GetTypeLocalAction';
import { checkNetWorkInfo } from '../actions/CheckNetWorkAction';
import { getEventByTypeLocal } from '../actions/LocalDataAction/GetEventTypeLocalAction';

const ScrollableTabView = require('react-native-scrollable-tab-view');

let tabDataList = [];

let typeID = React.PropTypes.any;
let typeName = React.PropTypes.any;


const apiName = 'fincalendar';
const eventTypeApiName = 'eventtype';
const lang = 'en-gb';
const TypeLocal = [];
const eventTypeLocal = [];

let typeStorageKey = React.PropTypes.string;
typeStorageKey = `${apiName}_${eventTypeApiName}_${lang}`;

let eventTypeStorageKey = React.PropTypes.string;
eventTypeStorageKey = `${apiName}_${lang}_${lang}`;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            tabDataList: []
         };
    }
    componentDidMount() { 
        NetInfo.isConnected.addEventListener('change', this.handleConnectionChange)
    }
 componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);
  }

handleConnectionChange = (isConnected) => {
   this.props.checkNetWorkInfo({ status: isConnected });
     if (this.props.isConnected.status === true) {

        AsyncStorage.getItem(typeStorageKey).then((typeData) => {
                TypeLocal = JSON.parse(typeData);
              
         if (TypeLocal === 0 || TypeLocal === null) {
            this.props.fetchEventType();
         } else if (TypeLocal.length > 0 || TypeLocal !== null) {
            this.props.getTypeByNameLocal(TypeLocal);
         }
        }); 

    } else {
        AsyncStorage.getItem(typeStorageKey).then((typeData) => {
                TypeLocal = JSON.parse(typeData);       
         if (TypeLocal.length > 0 || TypeLocal !== null) {
            this.props.getTypeByNameLocal(TypeLocal);
         }
        }); 
    }
}
    
handleChangeTab(id) {
    typeID = this.props.typeData.typeData[id].ID;
    typeName = this.props.typeData.typeData[id].Name;
AsyncStorage.getItem(eventTypeStorageKey).then((eventTypeData)  => {
    eventTypeLocal = JSON.parse(eventTypeData);
    if (eventTypeLocal === 0 || eventTypeLocal === null || eventTypeLocal !== null) {
         if (this.props.isConnected.status === true) {
             this.props.fetchTypeList(typeID);
        } 
    } else if (eventTypeLocal.length > 0 || eventTypeLocal !== null || this.props.isConnected.status === true) {
        let eventTypeFilter = eventTypeLocal.filter(data => data.EventType.toString() === typeName.toString());
        let eventUnique = _.uniqBy(eventTypeFilter, (x) => {
            return x.Id
        });
        this.props.getEvenTypeLocal(eventUnique);
    }

if (this.props.isConnected.status === false) {
     eventTypeLocal = JSON.parse(eventTypeData);  
      let eventTypeFilter = eventTypeLocal.filter(data => data.EventType.toString() === typeName.toString());
      let eventUnique = _.uniqBy(eventTypeFilter, (x) => {
          return x.Id
      });
        if (eventUnique === null || eventUnique.length < 0) {
            return console.log('CHECKING');
        } else {
             this.props.getEvenTypeLocal(eventUnique);
        }
       
    }
});
   
}
renderNetworkInfo() {
    if (this.props.isConnected.status === true) {
        return (
            <View />
        )
    } else if (TypeLocal === 0 && this.props.isConnected.status === false && TypeLocal.length === null) {     
        return (
            <View
                style={{
                      justifyContent: 'center',
                }}
            >
                <Text 
                style={{
                    backgroundColor: 'rgba(109,109,109, 0.4)',
                    textAlign: 'center'  
            }}>No internet connection</Text>
            <Text>
                No Data Available
            </Text>
            </View>    
        );
    }
    
     else {
        return (
            <View
                style={{
                      justifyContent: 'center',
                }}
            >
                <Text 
                style={{
                    backgroundColor: 'rgba(109,109,109, 0.4)',
                    textAlign: 'center'  
            }}>No internet connection</Text>
            </View>    
        )
    }
}
    render() {
        const { typeData, isFetching } = this.props.typeData;
        if (this.props.isFetching) {
            return(<View />);
        }
        
        tabDataList = typeData;
        const AllEventType = { ID: 0, Name: 'All'}
        tabDataList.unshift(AllEventType)
       
        if (tabDataList.length > 0) {
           tabDataList = tabDataList.slice(0)
        }
        tabDataList = _.uniqBy(tabDataList, (x) => {
            return x.Name
        })

        return (
                <ScrollableTabView
                    onChangeTab={(i) => {
                        this.state.tabDataList = i.i;
                        const typeIds = this.props.typeData.typeData[this.state.tabDataList].ID;
                        const typeNames = this.props.typeData.typeData[this.state.tabDataList].Name;
                        this.props.getId(typeIds);
                         this.props.getName(typeNames);
                        this.handleChangeTab(this.state.tabDataList);
                        
                    }}
                   style={styles.scrollable}
                    scrollWithoutAnimation
                    initialPage={0}
                    locked
                    renderTabBar={() => <ScrollableTabBar 
                                   activeTextColor="white" 
                                 style={{  backgroundColor: '#4d4d4f' }}
                                  inactiveTextColor="white"
                                   underlineColor="white"      
                                />} 
                >
                  {
                     tabDataList.map((types, index) => {
                          if (index === 0){
                         return (
                            <View key={index} tabLabel={types.Name.toUpperCase()} style={{ flex: 1 }}>  
                                <View>{this.renderNetworkInfo()}</View>
                               <CalendarList />
                            </View>
                              );
                          }
                        return (
                           <View
                                tabLabel={types.Name.toUpperCase()}
                                key={index}
                                style={{ flex: 1 }}
                           >
                               <CalendarListType />
                           </View>
                        )
                      })
              }
                </ScrollableTabView>

        )
    }
}
const styles = create({
    container: {
        ios: {
            paddingTop: 0, 
            position: 'absolute', 
            top: 0, 
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        android: {
            paddingTop: 0, 
             position: 'absolute', 
             top: 0,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -8,
        }
    },
  scrollable: {
      ios: {
        flex: 1,
        marginTop: 62,
      },
      android: {
        flex: 1,
        marginTop: 53,

      }
  },
  tabBarActive: {
    ios: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff'
    },
    android: {
        backgroundColor: 'red'
    }
  },
  displayAll: {
      ios: {
        justifyContent: 'center' 
      },
      android: {
         justifyContent: 'center' 
      }
  },
  tabBarUnderLine: {
    ios: {
         backgroundColor: 'rgba(255,255,255,0)'
    },
    android: {
        backgroundColor: 'rgba(255,255,255,0)'
    }
  },
  tabLabelAll: {
    ios: { flexDirection: 'row'
    },
    android: {
     flexDirection: 'row'
    }
  },
  
  styleTab: {
      ios: {
           backgroundColor: '#4d4d4f',
      },
      android: {
           backgroundColor: '#4d4d4f',
      }

  },
  textStyle: {
      ios: {
         color: '#fff'
      },
      android: {
         color: '#fff'
      }
   
  },
  buttonPress: {
      ios: {
        borderColor: '#fff',
        borderStyle: 'solid',
        borderWidth: 1,
        color: '#fff'
      },
      android: {
         borderColor: '#fff',
         borderStyle: 'solid',
         borderWidth: 1,
         color: '#fff'
      }    
  }
});
const mapStateToProps = (state) => {
     state.typeData.typeData = _.uniqBy(state.typeData.typeData, (x) => {
            return x.Name
        });
    return {
        typeData: state.typeData,
        isFetching: state.typeData.isFetching,
        isConnected: state.checkNetWork.isConnected
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchEventType: () => {
            dispatch(fetchTypeFromAPI());
        },
        getId: (theId) => {
            dispatch(getTypeId(theId));
        },
        getName: (theName) => {
            dispatch(getTypeName(theName));
        },
        fetchTypeList: (id) => {
            dispatch(fetchTypeByNameFromAPI(id));
        },
        getTypeByNameLocal: (data) => {
            dispatch(getTypeByNameLocal(data));
        },
        checkNetWorkInfo: (isConnect) => {
            dispatch(checkNetWorkInfo(isConnect));
        },
        getEvenTypeLocal: (data) => {
            dispatch(getEventByTypeLocal(data));
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
