import React, { Component } from 'react';
import { View, 
     Text,
     NativeModules,
     Dimensions, 
     ListView, 
     FlatList, 
     Platform,
     TouchableOpacity,
     TouchableHighlight,
     Button,
     Modal,
     WebView,
} from 'react-native';
import { connect } from 'react-redux';

import dateFormat from 'dateformat';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/FontAwesome';
import Iconss from 'react-native-vector-icons/EvilIcons';

import ActionSheet from 'react-native-actionsheet';

import { createStyles, minWidth } from 'react-native-media-queries';
import RNCalendarEvents from 'react-native-calendar-events';
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
import Modals from 'react-native-simple-modal';

import { fetchAttachmentFromAPI } from '../actions/AttachmentAction';

import Popover from './commons/PopOver';
import SharePopOver from './SharePopover';
import DownloadEvent from './DownloadEvent';
import ShareDetail from './commons/ShareDetail';
import ShareDetailAndroid from './commons/ShareDetailAndroid';


const Mailer = NativeModules.RNMail;
let task2 = React.PropTypes.any;
let task4 = React.PropTypes.any;

let attData = '';
let nameFile = '';
let nameOfFile = React.PropTypes.any;
let dataList = React.PropTypes.any;
let firstId = React.PropTypes.any;
let checkID = React.PropTypes.any;
let attachments = React.PropTypes.any;
let theLink = React.PropTypes.any;


const { height, width } = Dimensions.get('window');
const shareOptionss = ['Send via Email', 'Tweet this', 'Share on Facebook', 'Share via Whatsapp', 'Cancel'];

class TabletDetail extends Component {
    constructor(props) {
        super(props);
         this.state = { 
            showPopover: false,
             buttonRect: {},
              screenSize: Dimensions.get('window'),
               disable: false,
             x: '',
            y: '',
            width: '',
            height: '',
            widths: 0,
            heights: 0,
            viewHeight: 100,
            show: false,
            eventList: [],
            dataOfList: [],
            modalVisible: false,
            open: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
         };  
         this.onLayout = this.onLayout.bind(this);
    }      

componentWillReceiveProps(next){
      
       if (next.attData.attachmentData.length > 0 && next.attData.attachmentData) {
           next.attData.attachmentData.map(item => {
               checkID = item.ID;
           })
           this.loadAttachmentData(next.attData.attachmentData)
       }
}   

    componentDidMount() {
       
    }
onLayout = event => {
    this.setState({
      layout: {
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      }
    });
  }

onOpen() {
        this.setState({ show: true });
    }
onCancel() {
        this.setState({ show: false });
    }
setModalVisible(visible) {
      this.setState({ modalVisible: visible });
     }
openModal = () => {
        this.setState({ modalVisible: true });
    }
closeModal = () => {
        this.setState({ modalVisible: false });
    }

// ***** ACTION SHEET AND POPOVER HANDLE BEGIN
shareSheetShowEvent = () => {
     if (Platform.OS === 'ios' && width <= 375) {
         this.ActionSheet.show();
        return;
     }

     this.shareBtn.measure((ox, oy, width, height, px, py) => {
        this.setState({
            showPopover: true,
            buttonRect: { x: px, y: py, width, height: 0 },
        });
    });
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
               console.log(
                'Could not send mail. Please send a mail to support@example.com', error);
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
             this.setModalVisible(!this.state.modalVisible);
                 setTimeout(() => {
                    Share.shareSingle(Object.assign(shareData, {
                        social: 'twitter'
                    }));
                }, 300);
            break;
            case 2 :
            this.setModalVisible(!this.state.modalVisible);
            setTimeout(() => {
                Share.shareSingle(Object.assign(shareData, {
                  social: 'facebook'
                }));
              }, 300);
            break;
            case 3 :
            this.setModalVisible(!this.state.modalVisible);
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
                showPopover: false,
                marginTop: 0,
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
        this.setState({ 
            showPopover: false,
            marginTop: 0,
         });
    }


displayFileName() {
    if (attData) {
        return (  
            <Text 
                 style={{ color: '#fff', fontSize: 18 }}>
                {attData}
            </Text>
        );
    } 
    return (
        <View />
    );
}

openPdf(links) {
return (
     <Modal
          animationType={'slide'}
          transparent
          visible={this.state.modalVisible}
           onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
     >
          
    <View
         style={{
                height: 70,
                backgroundColor: '#4d4d4f',
                flexDirection: 'row',
                paddingTop: 22,
            }}
    >
            <TouchableOpacity 
              onPress={() => {
               this.setModalVisible(!this.state.modalVisible);
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
            <View style={{ marginLeft: 110, paddingTop: 7 }}>  
                 {this.displayFileName()}
            </View>
              
        <View
            style={{
                 marginLeft: 90,
                 marginTop: 2
            }}
        >
             <TouchableOpacity
                ref={b => this.shareBtn = b}
                onPress={this.shareSheetShowEvent}
             >
              <Icon
                name='ios-share-outline'
                style={{
                    fontSize: 32,
                    color: '#FFF', 
                }}
              />
            </TouchableOpacity>
           
          </View>
           <ActionSheet
                ref={o => this.ActionSheet = o}
                options={shareOptionss}
                cancelButtonIndex={shareOptionss.length - 1}
                onPress={this.actionSheethandlePress}
        />
          </View>  
         <WebView
                source={{ uri: links }}
         />

          <Popover
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
            </Popover>
          
        </Modal>   
    );
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
            task4 = RNFetchBlob.config({
                    fileCache: true,
                    appendExt: 'pdf',
                }).fetch('GET', task2);
        
    this.setState({ open: true });

        task4.then((pdfData) => {
           theLink = pdfData.path();
            if (Platform.OS === 'ios') {
                   setTimeout(() => {
                        this.setState({ open: false });
                        this.setModalVisible(true);
                   }, 50);
                } else if (Platform.OS === 'android') {
                    setTimeout(() => {
                        this.setState({ open: false });
                        this.setModalVisible(true);
                    }, 50);
             }
            }).catch(err => {
                 console.log('SOMETHING WRONG', err);
            });    
     task4.progress((received, total) => {
            this.showProgress(received, total);
        });  
    }
     cancelDownload() {
        task4.cancel((taskId) => {
             console.log('CANCEL SUCCESSFULL', taskId);
        });    
    }

    // ****** DOWNLOAD ATTACHMENT PROCESSING END ******//


checkOccurrenceDate() {
    this.state.disable = false;
      const { 
          EventDate,
          EventEndDate,
        } = this.props.eventList;
      
        let evtDate = new Date(EventDate);
        evtDate = evtDate.toISOString();
        let evtEndDate = new Date(EventEndDate);
        evtEndDate = evtEndDate.toISOString();

        RNCalendarEvents.fetchAllEvents(evtDate, evtEndDate)
            .then(listEvent => {
                for (let i = 0; i < listEvent.length; i++) {
                      if (listEvent[i].calendar.id) {
                          this.setState({
                             disable: true
                          });
                      }
                }
            }).catch(err => {
                 console.log('THE ERROR', err);
            });
}

saveCalendar() {
      const { 
          Title, 
          EventDate,
          EventEndDate
        } = this.props.eventItems;
        const eventLocation = this.props.eventItems.Location;
        const eventText = this.props.eventItems.Text;

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
            AlertIOS.alert('Announcement', 'Add the event Successfully!',  (id));
            this.setState({
                disable: true
            });
        })
        .catch(error => {
             (error);
        }, setTimeout(() => {
            this.popupDialog.dismiss();
        }, 50));
    }
/**** HANDLE DOWNLOAD EVENT TO CALENDAR END ***/  


 /**** EMAIL SHARE BEGIN ****/ 
   sendMail() {
       const { EventType, Title, Location } = this.props.eventItems;
       const eventMaillArr = [];
       let eventTime = new Date();
       eventMaillArr.push(this.props.eventItems);
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

loadAttachmentData(data) {
    this.state.dataOfList = data;
    nameOfFile = this.state.dataSource.cloneWithRows(data);
    this.setState({
        dataSource: nameOfFile
    });
}
renderWarning() {
   return (<View>
        <Text>THERE IS NO DATA</Text>
    </View>);
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
                    paddingBottom: 15
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
renderListView() {
       if (checkID > 0) {
           return ( <ListView
                enableEmptySections
                dataSource={this.state.dataSource}
                renderRow={data => this.renderRow(data)}
            />); 
       } else {
           this.renderWarning();
       }
}
renderDownloadText() {
    if (this.state.disable === false) {
        return (
            <Text style={styles.downloadBtnStyle}>
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
renderLocation(Location) {
    if (Location) {
            return (
        <View 
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
renderPopup() {
    return (
        <DownloadEvent pd={this.props.eventList}/>
    );
}


    render () {
        const { EventType, Title, IsAllDayEvent, Location } = this.props.eventItems;
        const eventDetailArr = [];
        let eventTime = new Date();
        eventDetailArr.push(this.props.eventItems);
        for (let i = 0; i < eventDetailArr.length; i++) {
            eventTime = dateFormat(eventDetailArr[i].EventDate, 'dd/mm/yyyy');
        }
        return (
           <View 
            style={styles.contentStyle}>
                <Text style={styles.nameStyle}>
                   {Title}
                </Text>
                <Text style={styles.timeStyle}>
                    {eventTime} {IsAllDayEvent} 
                </Text>
                {this.renderLocation(Location)}
                    <View
                       
                          style={styles.borderStyle}>
                        <Text style={styles.descriptionStyle} >
                            Event Type 
                            </Text>
                         <Text style={[styles.descriptionStyle, styles.eventypeStyle]}>
                                { EventType }
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
         { this.renderListView() }
    </View>  
      
              {/*HANDLE ATTACHMENT DOWNLOAD END*/}
                <View 
                     style={styles.socialStyle}>
                         <View   
                              style={styles.borderDownload}>
                                {this.renderPopup()}            
                         </View>
                          <SharePopOver />
                    </View>
                  
                         
  
        <Modals
            overlayBackground={'rgba(0, 0, 0, 0.9)'}
            open={this.state.open}
            modalDidOpen={() =>  ('modal did open')}
            modalDidClose={() => this.setState({ open: false })}>
        <View>
          <TouchableOpacity
            style={{margin: 5}}
            onPress={() => this.setState({ open: false })}>
          <Button
            title='Cancel'
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
        )
    }
}

const base = {
    closeBtn: {},
    iconStyle: {},
    downloadTextStyle: {},
    downloadDescStyle: {},
    decisionStyle: {},
    socialStyle: {},
    borderDownload: {},
    downloadBtnStyle: {},
    shareBtnStyle: {},
    container: {},
    contentStyle: {},
    nameStyle: {},
    timeStyle: {},
    descriptionStyle: {},
    eventypeStyle: {},
    borderStyle: {},
    modal: {},
    sharePopoverText: {},
    sharePopoverStyle: {}
};
const styles = createStyles(
    base, 
    minWidth(768, {
     sharePopoverStyle: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#d6d6da', 
    },
    sharePopoverText: {
        color: '#007aff',
        padding: 10,
        
    },
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
            flexDirection: 'row',
            borderTopWidth: 1.5,
            borderStyle: 'solid',
            borderColor: '#ababab',
            marginTop: 800,
            paddingBottom: 10,
            position: 'absolute',
            backgroundColor: '#f3f3f3',
            width: 640
    },
    borderDownload: {
             borderStyle: 'solid',
            borderColor: '#ddd',
            borderRightWidth: 1,
            paddingBottom: 10,
            paddingRight: 50
    },
    downloadBtnStyle: {
        color: '#157efb',
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
        paddingBottom: 20,
    },
    container: {
        flex: 1,
        marginTop: 150,
    },
    contentStyle: {
        flex: 1,
        paddingTop: 10
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
        marginBottom: 13,
    },
    eventypeStyle: {
        color: '#999',
        marginLeft: 130 
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
        flexDirection: 'row' 
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(77,77,79, 0.7)'
   }
    })
    
);


const mapStateToProps = (state, ownProps) => {
    return {
        eventItems: state.getEvent.eventList,
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
export default connect(mapStateToProps, mapDispatchToProps)(TabletDetail);

