import React, { Component } from 'react';

import { 
    TouchableOpacity, 
    View,
    FlatList,
    Platform,
     Dimensions,
     NativeModules,
     Text,
     AlertIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import { createStyles, minWidth } from 'react-native-media-queries';
import Popover from './PopOver';
import ActionSheet from 'react-native-actionsheet';

import dateFormat from 'dateformat';

const shareOptionss = ['Send via Email', 'Tweet this', 'Share on Facebook', 'Share via Whatsapp', 'Cancel'];
const { height, width } = Dimensions.get('window');
const Mailer = NativeModules.RNMail;

class ShareDetail extends Component {
    constructor(props) {
        super(props);
         this.state = { 
            showPopover: false,
            buttonRect: {},
              screenSize: Dimensions.get('window'),
             x: '',
            y: '',
            show: false,
            width: '',
            height: '',
            modalVisible: false,
            open: false,
         };    
    }
componentDidMount() {

}
setModalVisible(visible) {
      this.setState({ modalVisible: visible });
     }

shareSheetShowEvent = () => {
         this.ActionSheet.show();
}
/**** EMAIL SHARE BEGIN ****/ 
   sendMail() {
       const { EventType, Title, Location } = this.props.shareItem;
      
       const eventMaillArr = [];
       let eventTime = new Date();
       eventMaillArr.push(this.props.shareItem);
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
               console.log('CHECK ERROR', error);
           }
       });
   } 
   /**** EMAIL SHARE END ****/ 
actionSheethandlePress = (index) => {
       const { EventType, Title, IsAllDayEvent, Location, EventDate} = this.props.shareItem;
        let eventTime = EventDate;
        eventTime = dateFormat(eventTime, 'dd/mm/yyyy')
        //EventDate = dateFormat(EventDate, 'dd/mm/yyyy')
        const eventDetailArr = [];

        const shareData = { 
            title: Title,
            message: `Novozymes - ${Title}(${eventTime})`,
            url: 'https://itunes.apple.com/app/id1031495033',
            subject: 'Share Link'
    };
        switch (index) {
            case 0 :  
             shareData.message = this.sendMail();
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
                showPopover: false
            });
        }
    }

sharePopoverListItem = ({ item, index }) => {
        return (
            <TouchableOpacity 
                style={[styles.sharePopoverStyle,
              ]} 
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
renderPopOver() {
    
}

    render () {
        return (
            <View>
           <TouchableOpacity
                ref={b => this.shareBtn = b}
                onPress={this.shareSheetShowEvent}
             >
             <Text style={{ fontWeight: '500', color: '#157efb', fontSize: 17 }}>
                 Share
             </Text>
            </TouchableOpacity>
            <ActionSheet
                ref={o => this.ActionSheet = o}
                options={shareOptionss}
                cancelButtonIndex={shareOptionss.length - 1}
                onPress={this.actionSheethandlePress}
        />
         </View>
        )
    }
}

export default ShareDetail;