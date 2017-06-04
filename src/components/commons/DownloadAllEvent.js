import React, { Component } from 'react';
import { View, Text, Modal, Dimensions, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStyles, minWidth, maxWidth, minHeight, maxHeight } from 'react-native-media-queries';
import RNCalendarEvents from 'react-native-calendar-events';

import { connect } from 'react-redux';
import { fetchICalendarFromAPI } from '../../actions/iCalendarAction';

const {height, width} = Dimensions.get('window');

class DownloadAllEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisibles: false,
        }
    }
 componentWillMount() {
        this.authorCalendarStatus();
        this.authorCalendarStore();
    }
componentWillReceiveProps(nextProps) {
        if (nextProps.iCalendars.length > 0) {
            this.bindCalendar(nextProps.iCalendars)
        }
    }
// Authorize Calendar Status
    authorCalendarStatus() {
        RNCalendarEvents.authorizationStatus()
        .then(status => {
            console.log('STATUS', status);
        })
        .catch(error => {
             console.log('ERROR', error);
        });
    }
  // authorCalendarStatus
    authorCalendarStore() {
        RNCalendarEvents.authorizeEventStore().then(status => {
               console.log('STATUS', status);
        }).catch(error => {
               console.log('STATUS', status);
        });
    }
setModalVisible(visible) {
    this.setState({ modalVisibles: visible });
} 
saveCalendar() {
this.props.fetchICalendar();
    if (this.props.isLoadings) {
        return(<View />);
    }
    this.setModalVisible(!this.state.modalVisibles);
}

bindCalendar(data) {
        data.forEach(cal => {
         
         let evtDate = new Date(cal.EventDate);
             evtDate = evtDate.toISOString();
             
            
        let evtEndDate = new Date(cal.EventEndDate);
        evtEndDate = evtEndDate.toISOString();


            RNCalendarEvents.saveEvent(`NovoZyme - ${cal.Title}`, {
                location: `${cal.Location}`,
                notes: `${cal.Text}`,
                startDate: `${evtDate}`,
                endDate: `${evtEndDate}`
            }).then(id => { 

            RNCalendarEvents.fetchAllEvents(evtDate, evtEndDate)
                .then(listEvent => {
                    for (let i = 1; i < listEvent.length; i++) {
                        if (listEvent[i].calendar.id) {
                            RNCalendarEvents.removeFutureEvents(id).then(success => {
                                  console.log('REMOVE SUCCESS FULL', success);
                            }).catch(err => {
                                 console.log('SORRY ERROR', err);
                            });
                        }
                    }
                }).catch(err => {
                 console.log('THE ERROR', err);
            });
            })
            .catch(error => {
                 console.log('THE ERROR', error);
        }, setTimeout(() => {
           this.setModalVisible(!this.state.modalVisibles);
        }, 50));
    });
      this.setModalVisible(!this.state.modalVisibles);
}
    render () {
        return (
            <View>
                <Icon 
                    onPress={() => {
                        this.setModalVisible(true)
                    }}
                        name='ios-download-outline'
                        style={[ styles.headerIconStyle2, styles.headerIconIphone4]}
                />


        <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisibles}
         onRequestClose={() => this.setModalVisible(!this.state.modalVisibles)}
        >
         <View 
            style={{
              marginTop: 0, 
              backgroundColor: 'rgba(0,0,0,0.8)',
              width: 400,
              height: 800
            }}>
          <View>

            <View
              style={[styles.modalPhone, styles.modalIphone4]}
            >
            <View
              style={{ marginTop: 20 }}
            >
               <Text 
                   style={{
                     textAlign: 'center',
                     fontSize: 25, 

                   }}
              >
                            Download  Events
                </Text>
                <Icon
                     name='ios-download-outline'
                     style={{ color: '#000',
                              fontSize: 85,    
                              textAlign: 'center', }}
                 />
                <Text 
                    style={{ fontSize: 19,
                            textAlign: 'center'
                   }}
                >
                    Downloading will add the {'\n'}
                     events in your device calendar. {'\n'}
                     You can delete them anytime.
                 </Text>
            </View>
                   <TouchableHighlight
                    onPress={this.saveCalendar.bind(this)}
                      underlayColor='#f7f7f7'
                    >
                            <View 
                                   style={{ 
                                     flexDirection: 'row', 
                                     justifyContent: 'center',                                                                              
                                    }}
                             >
                                    <Icon 
                                        name='ios-checkmark-outline'
                                        style={{ color: '#000',
                                              fontSize: 70 }}                      
                                        /> 
                                    <Text 
                                        style={{
                                           marginTop: 30,
                                            fontSize: 18,
                                             marginLeft: 10 }}       
                                    >
                                        Yes
                                    </Text>
                                 </View>                   
                              </TouchableHighlight>  
                                    <TouchableHighlight
                                        underlayColor={'#fff'}
                                         onPress={() => this.setModalVisible(!this.state.modalVisibles)}
                                    >
                                    <View 
                                        style={{ 
                                            flexDirection: 'row', 
                                            justifyContent: 'center',
                                            borderTopColor: '#ddd',
                                            borderTopWidth: 1,
                                            borderStyle: 'solid',
                                            marginTop: -10,
                                            paddingTop: -10
                                        }}
                                    >
                                  
                                <Icon 
                                        name='ios-close-outline'
                                        style={{
                                          color: '#000',
                                          fontSize: 70,
                                        }}                      
                                        /> 
                                    <Text 
                                        style={{ marginTop: 20, 
                                           fontSize: 18, 
                                            marginLeft: 10
                                          }}
                                    >
                                        No
                                    </Text>
                                        </View>                   
                       </TouchableHighlight> 

            </View>
          </View>
         </View>
        </Modal>
            </View>
        )
    }
}

const base = {
    defaultBg: {
             backgroundColor: '#fff',
             position: 'relative'
    },
    headerStyle: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30
    },
    headerStyleAndroid: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    headerTitleStyle: {
            color: '#fff',
            fontSize: 20,
            marginLeft: 20 * width / 100
    },
    headerTitleStyle2: {
            fontSize: 20, 
            color: '#fff'
    },
    headerIconStyle2: {
            color: '#fff',
            marginLeft: 20 * width / 100, 
           marginTop: -0.4,
           fontSize: 28
    },
    closeBtn: {
        marginTop: 30, 
        fontSize: 18, 
        marginLeft: 10
    },
    iconStyle: {
        color: '#000',
        fontSize: 85,    
        textAlign: 'center', 
    },
    downloadTextStyle: {
        textAlign: 'center',
        fontSize: 25,       
    },
    downloadDescStyle: {
        fontSize: 19,
        textAlign: 'center'
    },
    decisionStyle: {
        color: '#000',
        fontSize: 70,
    },
    headerStyleDetail: {},
    modalPhone: {},
    modalIphone4: {},
    headerIconIphone4: {}
};

const styles = createStyles(
    base,
        maxHeight(480, {
               modalIphone4: {
                    width: 270,
                    height: 350,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: 70,
                    marginRight: 80
               },
               headerIconIphone4: {
                   color: '#fff',
                    marginLeft: 13 * width / 100, 
                marginTop: -0.4,
                fontSize: 28
               }
    }),
    minHeight(480, {
            headerStyleDetail: {
                marginLeft: -20 * width / 100
            }, 
            modalPhone: {
                width: 280,
                height: 350,
                backgroundColor: '#fff',
                borderRadius: 5,
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 130,
                marginRight: 30
            }
    }),
    minHeight(768, {
        headerStyle: {
            marginTop: 30,
            paddingLeft: 250
        },
        headerTitleStyle3: {
           color: '#fff',
           fontSize: 20
        },
        headerIconStyle2: {
            color: '#fff',
            fontSize: 30, 
            marginLeft: 28 * width / 100
        }
    }),
);
const mapStateToProps = (state) => {
    return {
        iCalendars: state.iCalendarData.iCalData,
        isLoadings: state.iCalendarData.isLoadings
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchICalendar: () => {
            dispatch(fetchICalendarFromAPI())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DownloadAllEvent);

