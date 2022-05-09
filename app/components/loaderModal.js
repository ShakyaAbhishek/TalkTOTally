import React from 'react';
import { View, Text, ActivityIndicator,  Modal} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamily, fontSizes} from '../utils/responsive';


export const Loader = ({ spinnerVisible, }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={spinnerVisible}
            //supportedOrientations={['portrait','portrait-upside-down',]}
            // onRequestClose={() => {
            //     Alert.alert('Modal has been closed.');
            // }}
            >
            <View style={{ height: hp('100%'), width: wp('100%'), backgroundColor: "#00000090", justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: hp('15%'), width: wp('80%'), flexDirection: "row", alignItems: "center", justifyContent: 'center', backgroundColor: "#11111195", borderRadius: hp('1%') }}>
                    <ActivityIndicator size="large" color={"#ffffff"} />
                    <Text style={{ marginLeft: wp('5%'), fontSize: fontSizes('title'), color: '#ffffff' }}>Please wait...</Text>
                </View>
            </View>
        </Modal>
    )
}

 // information modal
export const Toast = ({ visible, message, backColor }) => {
   //console.warn('visible: .....', visible);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            //presentationStyle={'fullScreen'}
            //supportedOrientations={['portrait']}
            //presentationStyle={'overFullScreen'}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}>
            <View style={{ flex:1, borderColor:"red", borderWidth:5}} />
            <View style={{ position: "absolute", zIndex: 1, bottom: 0, height: hp('7%'), backgroundColor: backColor, width: wp('100%'), justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: hp('2%'), textAlign: 'center' }}>{message}</Text>
            </View>
        </Modal>

    )
}
