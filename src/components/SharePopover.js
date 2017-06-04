import React, { Component } from 'react';

import { 
    TouchableOpacity, 
    View,
    FlatList,
    Platform,
     Dimensions,
     NativeModules,
     Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import { createStyles, minWidth } from 'react-native-media-queries';
import Popover from './commons/PopOvers';


const shareOptionss = ['Send via Email', 'Tweet this', 'Share on Facebook', 'Share via Whatsapp', 'Cancel'];
const { height, width } = Dimensions.get('window');
const Mailer = NativeModules.RNMail;


class SharePopOver extends Component {
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
setModalVisible(visible) {
      this.setState({ modalVisible: visible });
     }

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
       Mailer.mail({
           subject: '',
           recipients: [''],
           ccRecipients: [''],
           bccRecipients: [''],
           body: 'https://www.youtube.com/watch?v=mF3DCa4TbD0',
           isHTML: true // For IOS only
       }, (error) => {
           if (error) {
               console.log('Error',
                'Could not send mail. Please send a mail to support@example.com', error);
           }
       });
   }
actionSheethandlePress = (index) => {
        const shareData = { 
            title: 'Share Link',
            message: 'https://www.youtube.com/watch?v=mF3DCa4TbD0',
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
         </View>
        );
    }
}

const base = {
    sharePopoverStyle: {}
};

const styles = createStyles(
    base,
    minWidth(768, {
        sharePopoverStyle: {
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ddd', 
            borderStyle: 'solid',
            paddingBottom: 6,
            paddingTop: 6,
            paddingRight: 4,
            paddingLeft: 4
},
    })
);

export default SharePopOver;