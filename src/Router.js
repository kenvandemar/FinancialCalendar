import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Dimensions, Platform, Modal } from 'react-native';
import { 
    Scene, 
    Router,
} from 'react-native-router-flux';
import { createStyles, minWidth, maxWidth, minHeight, maxHeight } from 'react-native-media-queries';
import { create } from 'react-native-platform-stylesheet';
import Calendar from './components/Calendar';
import CalendarDetail from './components/CalendarDetail';
import DownloadAllEvent from './components/commons/DownloadAllEvent';


const {height, width} = Dimensions.get('window');

class Routers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: {
                height: height,
                width: width
            },
            show: false,
            modalVisibles: false,
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

setModalVisible(visible) {
    this.setState({ modalVisibles: visible });
} 


  renderTitle() {
      if (Platform.OS === 'ios') {
          return (
            <View 
                onLayout={this.onLayout}
                style={{ ...styles.headerStyleIphopne}}>
                <Text 
                    style={{...styles.headerTitleStyle, ...styles.headerTitleStyle3}}>
                        Financial Calendar
                </Text>
                <DownloadAllEvent />
            </View>
          );
      } else if (Platform.OS === 'android') {
            return (
            <View 
                onLayout={this.onLayout}
                style={{ ...styles.headerStyleAndroid}}>
                <Text 
                    style={{...styles.headerTitleStyle, ...styles.headerTitleStyle3}}>
                        Financial Calendar
                </Text>
                <DownloadAllEvent />
            </View>
          );
      }
  }
    render() {
        return(
            <Router
                navigationBarStyle={{ backgroundColor: '#4d4d4f', borderBottomColor: '#4d4d4f' }}
                titleStyle={{ color: '#fff'}}
                backTitle='Back'
                backButtonTextStyle={{ color: '#fff' }}
            >
                <Scene key='main'>
                    <Scene
                        key='Calendar'
                        component={Calendar}
                        renderTitle={() =>
                            this.renderTitle()
                        }
                    />

                    <Scene 
                        key='calendarDetail'
                        component={CalendarDetail}
                         renderTitle={() => 
                            <View onLayout={this.onLayout} style={[stylePlatform.headerStylePlatForm, styles.headerStyleDetail]}>
                                <Text style={styles.headerTitleStyle}>Event Details</Text>
                            </View>
                        }
                    />
                </Scene>
            </Router>
        )
    } 
}

const stylePlatform = create({
    headerStylePlatForm: {
        ios: {
                 flexDirection: 'row',
                 justifyContent: 'center',
                marginTop: 7.8 * width / 100
            
        },
        android: {
                 flexDirection: 'row',
                 justifyContent: 'center',
                marginTop: 4.5 * width / 100
            
        }
    }
})
const base = {
    defaultBg: {
             backgroundColor: '#fff',
             position: 'relative'
    },
    headerStyle: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 4.5 * width / 100
    },
    headerStyleAndroid: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    headerStyleIphopne: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
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
    modalIphone4: {}
};

const styles = createStyles(
    base,
        maxHeight(480, {
               modalIphone4: {
                    width: 250,
                    height: 350,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: 100
               }
    }),
    minHeight(480, {
            headerStyleDetail: {
                marginLeft: -20 * width / 100,
            }, 
            modalPhone: {
                 width: 280,
                height: 350,
                backgroundColor: '#fff',
                borderRadius: 5,
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 130
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


export default Routers;

