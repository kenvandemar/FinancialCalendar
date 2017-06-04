import React, { Component } from 'react';
import { View, 
    Text, 
    Dimensions, 
    NativeModules,
    FlatList,
    ListView,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    AlertIOS,
    WebView,
    Platform,
    Button
 } from 'react-native';
import { create } from 'react-native-platform-stylesheet';
import dateFormat from 'dateformat';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import Iconss from 'react-native-vector-icons/EvilIcons';
import RNCalendarEvents from 'react-native-calendar-events';
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import PDFView from 'react-native-pdf-view';
import Modals from 'react-native-simple-modal';
import { createStyles, minWidth, maxHeight, minHeight } from 'react-native-media-queries';

import { fetchAttachmentFromAPI } from '../actions/AttachmentAction';
import ShareDetail from './commons/ShareDetail';
import PopOver from '../commons/Popover';

let moment = require('moment');
const Mailer = NativeModules.RNMail;

const ActionSheets = require('@remobile/react-native-action-sheet');
const Buttons = require('@remobile/react-native-simple-button');

const {height, width} = Dimensions.get('window');

let task2 = React.PropTypes.any;
let task4 = React.PropTypes.any;
let attachments = React.PropTypes.any;
let theLink = React.PropTypes.any;
let attData = '';
let nameFile = '';
let nameOfFile = React.PropTypes.any;
let dataList = React.PropTypes.any;

const shareOptionss = ['Send via Email', 'Tweet this', 'Share on Facebook', 'Share via Whatsapp', 'Cancel'];
class CalendarDetail extends Component {
    constructor(props) {
        super(props);
        this.state={
            layout: {
                height,
                width
            },
            show: false,
            disable: false,
            modalVisible: false,
            modalVisibles: false,
            showPopover: false,
            buttonRect: {},
            dataOfList: [],
            open: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            screenSize: Dimensions.get('window'),
        }
        this.onLayout = this.onLayout.bind(this);
    }

componentWillMount() {
   
}
componentDidMount() {
     this.authorCalendarStatus();
    this.authorCalendarStore();
    this.checkOccurrenceDate();
         const { Id } = this.props.eventDetail;
         this.props.fetchAttachment(Id);
      
}
    componentWillReceiveProps(nextProps) {
       this.loadAttachmentData(nextProps.attData.attachmentData);
    }
onOpen() {
        this.setState({ show: true });
}
     onCancel() {
        this.setState({ show: false });
    }
onLayout = event => {
    this.setState({
      layout: {
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      }
    });
  }
  

// ****** DOWNLOAD ATTACHMENT PROCESSING BEGIN *****//
showProgress(received, total) {
         const totals = (received / total); 
         console.log('Progress' + totals + '%'); 
}

fetchDocuments(index) { 
     attData = index.Location;
     task2 = attData;
 attData = attData.slice(attData.lastIndexOf('/'));
            attData = attData.slice(1);
            attData = attData.replace(/_/g, ' ');
            if (attData.includes('%')) {
                attData = attData.replace(/%/g, ' ');
            }
            attData = attData.slice(0, attData.lastIndexOf('.'));
            attData = attData.slice(0, -14);
    task4 = RNFetchBlob.config({
                    fileCache: true,
                    appendExt: 'pdf',
                }).fetch('GET', task2);

    this.setState({ open: true });

        task4.then((pdfData) => {
           theLink = pdfData.path();
            if (Platform.OS === 'ios') {
                setTimeout(() => {
                    //RNFetchBlob.ios.openDocument(pdfData.path()); 
                    this.setState({ open: false });
                    this.setModalVisibles(true);
                }, 50);      
            } else if (Platform.OS === 'android') {
                    this.setState({ open: false });
                    this.setModalVisibles(true);
             }
            }).catch(err => {
                 console.log('SOMETHING WRONG', err);
            }); 

     task4.progress((received, total) => {
            this.showProgress(received, total);
        });  
        //task4.progress((loaded, total) => {  (`${Math.floor(loaded / total)}% downloaded`); });
    }
    
     cancelDownload() {
        task4.cancel();
    }

// ****** DOWNLOAD ATTACHMENT PROCESSING END ******//

// ****** DISPlAY ATTACHMENT BEGIN ******//
loadAttachmentData(data) {
    this.state.dataOfList = data;
     nameOfFile = this.state.dataSource.cloneWithRows(this.state.dataOfList);
     this.setState({
         dataSource: nameOfFile
     });
}
renderRow(rowData) {
    nameFile = rowData.FileName;
    nameFile = nameFile.slice(0, nameFile.lastIndexOf('.'));
    attachments = rowData;
    return (
        <View
            style={{
                paddingBottom: 30,
                alignItems: 'center',
                flexDirection: 'row',
                
            }}
        >
            <TouchableOpacity
                onPress={() => this.fetchDocuments(rowData)}
                style={{   
                    marginLeft: 10,
                    marginTop: 20,
                    paddingBottom: 17
                }}
                >   
                     <Icons
                        name='file-pdf-o'
                        style={{
                             fontSize: 30,
                            color: '#A09F9E',
                             borderColor: '#A09F9E',
                              borderWidth: 2,
                             borderStyle: 'solid', 
                             padding: 10,
                             alignSelf: 'flex-start',
                             borderRadius: 10,
                             paddingLeft: 15
                        }}
                     />
                
                 <View style={{ marginTop: -35, marginLeft: 65 }}>
                            <Text >
                                { nameFile }
                          </Text> 
                 </View>   
            </TouchableOpacity>
</View>
    );
}

shareSheetShowEvent = () => {
     if (width <= 375) {
         this.ActionSheet.show();
         return;
     } else if (width > 375) {
           this.shareBtn.measure((ox, oy, widths, heights, px, py) => {
        this.setState({
            showPopover: true,
            buttonRect: { x: px, y: py, widths: width, heights: 0 }
        });
    });
     }
}

sendMailAttachment() {
   const theUrl = attachments.Location;
       Mailer.mail({
           subject: '',
           recipients: [''],
           ccRecipients: [''],
           bccRecipients: [''],
           body: theUrl,
           isHTML: true // For IOS only
       }, (error) => {
           if (error) {
               AlertIOS.alert('Error',
                'Could not send mail. Please send a mail to support@example.com');
           }
       });
   }
   
actionSheethandlePress = (index) => {
      const messageUrl = attachments.Location;
      
        const shareData = { 
            title: 'Share Link',
            message: messageUrl,
            url: 'https://itunes.apple.com/app/id1031495033',
            subject: 'Share Link'
    };
        switch (index) {
            case 0 :  
             shareData.message = this.sendMailAttachment();
             setTimeout(() => {
                Share.shareSingle(Object.assign(shareData, {
                  social: 'email'
                }));
              }, 300);
            break;
            case 1:
             this.setModalVisibles(!this.state.modalVisibles);
                 setTimeout(() => {
                    Share.shareSingle(Object.assign(shareData, {
                        social: 'twitter'
                    }));
                }, 300);
            break;
            case 2 :
            this.setModalVisibles(!this.state.modalVisibles);
            setTimeout(() => {
                Share.shareSingle(Object.assign(shareData, {
                  social: 'facebook'
                }));
              }, 300);
            break;
            case 3 :
            this.setModalVisibles(!this.state.modalVisibles);
            setTimeout(() => {
                Share.shareSingle(Object.assign(shareData, {
                  social: 'whatsapp'
                }));
              }, 300);
            break;
            default:
                break;
        }
        if (this.state.showPopover) {
            this.setState({
                showPopover: false
            });
        }
    }
sharePopoverListItem = ({ item, index }) => {
        return (
            <TouchableOpacity 
                style={[styles.sharePopoverStyle,
                { borderBottomWidth: (index === shareOptionss.length - 1) ? 0 : 1 }]} 
                onPress={() => this.actionSheethandlePress(index)}
            >
                <Text 
                    style={[styles.sharePopoverText, 
                    { color: (index === shareOptionss.length - 1) ? 'red' : '#007aff' }]}
                >{item}</Text>
            </TouchableOpacity>
        );
    }
 closePopover = () => {
        this.setState({ showPopover: false });
    }
displayFileName() {
    if (attData) {
        return (  
            <Text 
                 style={[styless.fileNameSizePhone, styless.fileNameIphone4]}>
                {attData}
            </Text>
        );
    } 
    return (
        <View />
    );
}
onNavigationStateChange (navState) {
    let wb_url = navState.url;
    let lastPart = wb_url.substr(wb_url.lastIndexOf('.') + 1);
    if (lastPart === 'pdf') {
        let DEFAULT_URL = {uri:'http://docs.google.com/gview?embedded=true&url=' + wb_url};
        this.setState({ url: DEFAULT_URL})
    }
}
openUrl(url) {
    if (Platform.OS === 'ios') {
        return (
               <WebView
                source={{ uri: url }}
           />
        )
    } else if (Platform.OS === 'android') {
        if (url) {
            return (
            <PDFView
                ref={(pdf) => {this.pdfView = pdf;}}
                src={url}
                onLoadComplete = {(pageCount) => {
                    this.pdfView.setNativeProps({
                        zoom: 1
                    });
                }}
                style={{ flex: 1}}
            />
        )
        }
        
    }
}

openPdf(links) {
    return (
        <View>
     <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisibles}
             onRequestClose={() => this.setModalVisibles(false)}
    >
          
    <View
         style={{
                height: 60,
                backgroundColor: '#4d4d4f',
                flexDirection: 'row',
                paddingTop: 25,
                marginBottom: 8,
            }}
    >
            <TouchableOpacity 
              onPress={() => {
              this.setModalVisibles(!this.state.modalVisibles);
            }}
         >
              <Icon
                name='ios-arrow-back'
                 style={{
                    fontSize: 32,
                    color: '#FFF',
                    alignSelf: 'flex-start',
                    paddingLeft: 10,
                }}
              />
            </TouchableOpacity>
          
          <View style={[styless.fileNamePhone, styless.fileNameIphone4]}>  
                 {this.displayFileName()}
            </View>

        <View
            style={{
                 marginLeft: 16
            }}
        >
             <TouchableOpacity
                ref={b => this.shareBtn = b}
                 onPress={this.shareSheetShowEvent}
             >
              <Icon
                name='ios-share-outline'
                style={[styless.iconSharePhone, styless.iconShareiPhone4]}
              />
            </TouchableOpacity>
           
          </View>
           <ActionSheet
                ref={o => this.ActionSheet = o}
                options={shareOptionss}
                cancelButtonIndex={shareOptionss.length - 1}
                onPress={this.actionSheethandlePress}
        />
            <PopOver
                    isVisible={this.state.showPopover}
                    fromRect={this.state.buttonRect}
                    onClose={this.closePopover}
                    placement={'bottom'}
                    displayArea={{ x: 0, y: 0, width: this.state.screenSize.width, height: this.state.screenSize.height }}
            >   
                <FlatList
                    removeClippedSubviews={false}
                    data={shareOptionss}
                    keyExtractor={(item, index) => index}
                    renderItem={this.sharePopoverListItem}
                />
            </PopOver>
    </View>  
        {this.openUrl(links)}
        </Modal>

      </View>
            
    );
}  

// ****** DISPlAY ATTACHMENT END ******//




/**** HANDLE DOWNLOAD EVENT TO CALENDAR BEGIN ***/  
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
  // authorCalendarStore
    authorCalendarStore() {
        RNCalendarEvents.authorizeEventStore().then(status => {
             console.log('stattus', status)
        }).catch(error => {
            console.log('ERROR', error);
        });
    }
checkOccurrenceDate() {

      const { 
          EventDate,
          EventEndDate,
          IsAllDayEvent,
          DateType
        } = this.props.eventDetail;


        let startDate = new Date(EventDate);
        let endDate = new Date(EventEndDate);
          

        if (DateType !== 1 || IsAllDayEvent) {
            let strEventDate = EventDate.split('T')[0].split('-');
            let strEndDate = EventEndDate.split('T')[0].split('-');

            startDate = new Date(strEndDate[0], parseFloat(strEventDate[1]) - 1, strEventDate[2]);
           endDate = new Date(strEndDate[0], parseFloat(strEndDate[1]) - 1, strEndDate[2]);
          
          
           if (endDate > startDate) {
               endDate = new Date(endDate.setHours(24));
           } else {
               let eventStartDate = new Date(strEventDate[0], parseFloat(strEventDate[1]) -1, strEventDate[2]);
               endDate = new Date(eventStartDate.setHours(24))
           }

           startDate = startDate.toISOString();
           endDate = endDate.toISOString();
           
             RNCalendarEvents.fetchAllEvents(startDate, endDate)
            .then(listEvent => {
                for (let i = 0; i < listEvent.length; i++) {
                      if (listEvent[i].calendar.id) {
                          this.setState({
                             disable: true
                          });
                      }
                }
            }).catch(err => {
              console.log('SOMETHING WRONG', err);
            });
        } else {
            if ( DateType === 1 || IsAllDayEvent === false) {
                let sDate = new Date(EventDate);
                endDate = new Date(sDate.setHours(sDate.getHours() + 1));
           
           startDate = startDate.toISOString();
           endDate = endDate.toISOString();
       
             RNCalendarEvents.fetchAllEvents(startDate, endDate)
            .then(listEvent => {
                for (let i = 0; i < listEvent.length; i++) {
                      if (listEvent[i].calendar.id) {
                          this.setState({
                             disable: true
                          });
                      }
                }
            }).catch(err => {
              console.log('SOMETHING WRONG', err);
            });
          
            }
        }
}

  saveCalendar() {
  this.state.disable = false;
      const { 
          Title, 
          EventDate,
          EventEndDate
        } = this.props.eventDetail;
        const eventLocation = this.props.eventDetail.Location;
        const eventText = this.props.eventDetail.Text;

        let evtDate = new Date(EventDate);
        evtDate = evtDate.toISOString();
        let evtEndDate = new Date(EventEndDate);
        evtEndDate = evtEndDate.toISOString();

        RNCalendarEvents.saveEvent(`Novozymes - ${Title}`, {
            location: `${eventLocation}`,
            notes: `${eventText}`,
            startDate: `${evtDate}`,
             endDate: `${evtEndDate}`,
        })
        .then(id => {
            AlertIOS.alert('Announcement', 'Add the event Successfully!');
            console.log('CHECK EVENT ID', id);
            this.setState({
              disable: true
            });
        })
        .catch(error => {
            console.log('ERROR', error);
        });
          this.setModalVisible(!this.state.modalVisible);
    }

 /**** HANDLE DOWNLOAD EVENT TO CALENDAR END ***/  
renderDownloadText() {
    if (this.state.disable === false) {
        return (
            <Text style={[styles.downloadBtnStyle, styless.downloadBtnIphone4]}>
                Download
            </Text>
        ); 
    } else if (this.state.disable === true) {
        return (
        <Text 
            style={{ 
            color: 'gray',
            fontSize: 17,
            paddingLeft: 40,
            paddingTop: 10,
            paddingRight: 70,
            paddingBottom: 20
        }}>  
            Download
        </Text>
    );
    }
}  
setModalVisible(visible) {
    this.setState({ modalVisible: visible });
}  
setModalVisibles(visible) {
    this.setState({ modalVisibles: visible})
}

renderIsAllday(isAllDay) {
    if (isAllDay) {
        return (
            <Text>All day</Text>
        )
    } else {
        return (<Text />)
    }
}
renderLocation(Location) {
    if (Location) {
            return (
        <View 
            onLayout={this.onLayout}
                style={{ 
                        flexDirection: 'row',
                        marginLeft: 20
                    }}
                >
                 <Iconss
                        name='location'
                        style={{
                            fontSize: 23,
                            marginTop: 2       
                        }}
                    />
                    <Text style={{ fontSize: 18 }}>{Location}</Text>
                </View>
     );
    } 
    return (
        <View />
    );
}

 /**** EMAIL SHARE BEGIN ****/ 
   sendMail() {
       const { EventType, Title, Location } = this.props.eventDetail;
       const eventMaillArr = [];
       let eventTime = new Date();
       eventMaillArr.push(this.props.eventDetail);
       for (let i = 0; i < eventMaillArr.length; i++) {
            eventTime = dateFormat(eventMaillArr[i].EventDate, 'm/dd h:MM TT');
       }

       Mailer.mail({
           subject: `Novozymes - ${EventType} - ${eventTime}`,
           recipients: [''],
           ccRecipients: [''],
           bccRecipients: [''],
           body: `${Title}
                  Location: ${Location}
                  <br> 
                  <div>
                  <p>Follow Novozymes</p>
                  </div>
                  <div>
                    <p>Download Novozymes Investor Realations from the app store:
                  <a href='https://itunes.apple.com/app/id1031495033'>https://itunes.apple.com/app/id1031495033</a>
                  <p>
                  </div>
       
                  <div>
                    <p style="font-size: 10">Novozymes Investor Relations is powered by &copy; <a href='http://euroland.com'>Euroland.com</a></p>
                    <img src='https://media.glassdoor.com/sqll/14952/novozymes-squarelogo.png' height='120' width='120'/>
                  </div>
                  `,
           isHTML: true // For IOS only
       }, (error) => {
           if (error) {
               AlertIOS.alert('Error',
                'Could not send mail. Please send a mail to support@example.com');
           }
       });
   } 
   /**** EMAIL SHARE END ****/ 
    render () {
        const { EventType, Title, IsAllDayEvent, Location, EventDate} = this.props.eventDetail;
        let eventTime = EventDate;
        eventTime = dateFormat(eventTime, 'dd/mm/yyyy')
        //EventDate = dateFormat(EventDate, 'dd/mm/yyyy')
        const eventDetailArr = [];

        const shareOptions = { 
            title: Title,
            message: `Novozymes - ${Title}(${eventTime})`,
            url: 'https://itunes.apple.com/app/id1031495033',
            subject: 'Share Link'
    };

     
        return (
           <View
            onLayout={this.onLayout}
            style={styles.contentStyle}
           >

            <Text style={styles.nameStyle}>
                {Title}
            </Text>
            <Text style={styles.timeStyle}>
                {dateFormat(EventDate, 'dd/mm/yyyy')} {dateFormat(EventDate, 'HH:MM')} {this.renderIsAllday(IsAllDayEvent)} 
            </Text>

            {this.renderLocation(Location)}

                <View style={styles.borderStyle}>
                    <Text style={styles.descriptionStyle}>
                        Event Type <Text style={{color: '#999'}}>{ EventType }</Text>
                    </Text>
             </View>
{/*HANDLE ATTACHMENT DOWNLOAD BEGIN*/}
    <View
         style={{
            marginLeft: 20,      
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
            borderStyle: 'solid',
            }}>   
            <ListView 
                enableEmptySections
                dataSource={this.state.dataSource}
                renderRow={data => this.renderRow(data)}
            />
    </View>  
{/*HANDLE ATTACHMENT DOWNLOAD END*/}
        <View
                onLayout={this.onLayout} 
                      style={[styles.socialStyle, styless.socialIphone4]}>
                         <View style={styles.borderDownload}>
                            <TouchableOpacity          
                                disabled={this.state.disable}         
                                 onPress={() => {
                                     this.setModalVisible(true)
                                 }}
                            >   
                                {this.renderDownloadText()}            
                            </TouchableOpacity>
                           </View> 
                           <View style={{
                               paddingLeft: 70,
                                 paddingTop: 10,
                             paddingRight: 70,
                         paddingBottom: 20
                           }}> 
                              <ShareDetail shareItem={this.props.eventDetail}/>
                           </View>
                       
                    </View>  
                     
     <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
         <View 
            style={[ styless.sizePhone, styless.sizeIphone4 ]}>
          <View>

            <View
              style={[ styless.modalPhone, styless.modalIphone4 ]}
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
                                         onPress={() => this.setModalVisible(!this.state.modalVisible)}
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
<Modals
        overlayBackground={'rgba(0, 0, 0, 0.9)'}
        open={this.state.open}
        modalDidOpen={() =>  ('modal did open')}
        modalDidClose={() => this.setState({ open: false })}
    >
    <View>
    
      <TouchableOpacity
            style={{ margin: 5 }}
            onPress={() => this.setState({ open: false })}>
          <Button
            title='Cancel download'
            onPress={() => {
                this.cancelDownload();
                setTimeout(() => {
                    this.setState({ open: false });
                }, 150);
            }}
          />
          </TouchableOpacity>
        </View>
    </Modals>   
        {this.openPdf(theLink)}
           </View>
        );
    }
}

const base = {
    socialIphone4: {},
    downloadBtnIphone4: {},
    sizePhone: {},
    sizeIphone4: {},
    modalPhone: {},
    modalIphone4: {},
    fileNamePhone: {},
    fileNameIphone4: {},
    iconSharePhone: {},
    iconShareiPhone4: {},
    fileNameSizePhone: {},
    fileNameSizeIPhone4: {}
};

const styless = createStyles(
base,
maxHeight(480, {
    fileNameSizeIPhone4: {
         color: '#fff', 
         fontSize: 10 
    },
    iconShareiPhone4: {
        fontSize: 32,
        color: '#fff',
        marginRight: 10 * width /100,
    },
    fileNameIphone4: {
        marginLeft: 40, 
        paddingTop: 9, 
        justifyContent: 'center' 
    },
    modalIphone4: {
                width: 250,
                height: 350,
                backgroundColor: '#fff',
                borderRadius: 5,
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 80, 
                marginRight: 80
    },
  socialIphone4: {
            flexDirection: 'row',
            borderTopWidth: 1.5,
            borderStyle: 'solid',
            borderColor: '#ababab',
            marginTop: 133 * width / 100,
            paddingBottom: 10,
            position: 'absolute',
            marginLeft: 1,
            backgroundColor: '#f3f3f3'
  },
  downloadBtnIphone4: {
      color: '#157efb',
        fontSize: 17,
        paddingLeft: 40,
        paddingTop: 10,
        paddingRight: 40,
        paddingBottom: 20
     
  },
  sizeIphone4: {
      marginTop: 0, 
              backgroundColor: 'rgba(0,0,0,0.8)',
              width: 400,
              height: 800
  }
}),
minHeight(480, {
    fileNameSizePhone: {
        color: '#fff', fontSize: 13
    },
    iconSharePhone: {
        fontSize: 32,
        color: '#fff',
        marginLeft: 6 * width / 100,
    },
    fileNamePhone: {
         marginLeft: 9 * width / 100, 
        justifyContent: 'center'
    },
    sizePhone: {
             marginTop: 0, 
              backgroundColor: 'rgba(0,0,0,0.8)',
              width: 400,
              height: 800
    },
    modalPhone: {
                width: 280,
                height: 350,
                backgroundColor: '#fff',
                borderRadius: 5,
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 140,
                marginRight: 30
    }
})
);
const styles = create({
    closeBtn: {
        marginTop: 20, 
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
        marginTop: -30     
    },
    downloadDescStyle: {
        fontSize: 19,
        textAlign: 'center'
    },
    decisionStyle: {
        color: '#000',
        fontSize: 70,
    },
    socialStyle: {
        ios: {
            flexDirection: 'row',
            borderTopWidth: 1.5,
            borderStyle: 'solid',
            borderColor: '#ababab',
            marginTop: 162 * width / 100,
            paddingBottom: 10,
            position: 'absolute',
            marginLeft: 1,
            backgroundColor: '#f3f3f3'
        },
        android: {
                flexDirection: 'row',
                borderTopWidth: 1.5,
                borderStyle: 'solid',
                borderColor: '#ababab',
                marginTop: 555,
                paddingBottom: 10,
                position: 'absolute',
                marginLeft: 2,
                backgroundColor: '#f3f3f3'
        }
     
    },
    borderDownload: {
        ios: {
             borderStyle: 'solid',
            borderColor: '#ddd',
            borderRightWidth: 1,
            paddingBottom: 10
        }, 
        android: {
             borderStyle: 'solid',
             borderColor: '#ddd',
             borderRightWidth: 1,
             paddingBottom: 10
        } 
    },
    downloadBtnStyle: {
        color: '#157efb',
        fontSize: 17,
        paddingLeft: 40,
        paddingTop: 10,
        paddingRight: 70,
        paddingBottom: 20
    },
    disableDownloadStyle: {
        color: '#ddd',
        fontSize: 17,
        paddingLeft: 40,
        paddingTop: 10,
        paddingRight: 70,
        paddingBottom: 20
    },

    shareBtnStyle: {
        paddingLeft: 70,
        paddingTop: 10,
        paddingRight: 70,
        paddingBottom: 20
    },
    container: {
        flex: 1,
        marginTop: 150,
    },
    contentStyle: {
        flex: 1,
        paddingTop: 80
    },
    nameStyle: {
        paddingLeft: 25,
        color: '#000',
        fontSize: 18,
        paddingBottom: 8
    },
    timeStyle: {
        color: '#999',
        fontSize: 16,
        paddingLeft: 25,
        paddingBottom: 6,    
    },
    descriptionStyle: {
        fontSize: 16, 
        marginTop: 13,
        marginBottom: 13
    },
    borderStyle: {
        borderTopWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderTopColor: '#ddd',
        borderBottomColor: '#ddd',
        borderStyle: 'solid',  
        marginTop: 10,
        marginLeft: 25,    
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(77,77,79, 0.7)'
   },
   sharePopoverText: {
        color: '#007aff',
    }
});

const mapStateToProps = (state) => {
    return {
        attData: state.attachmentData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAttachment: (id) => {
            dispatch(fetchAttachmentFromAPI(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarDetail);
