import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';



const Header = ({ navigation, title, icon, backButtonNavigation, button, menuButton, rightIcon, transparent, whiteIcon, call, blankAuth }) => {
    
    return (
        <View style={{ height: hp('8%'), width: wp('100%'), backgroundColor: transparent ? "transparent" : "#213858", justifyContent: "space-between", alignItems: "center", flexDirection: 'row'}}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {backButtonNavigation ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() =>
                            setTimeout(() => {
                                navigation.goBack()
                            }, 400)}
                            style={{flex:1, borderRadius: hp('2%'), alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 }}>
                            {/* <Image resizeMode='contain'
                                style={{ tintColor: whiteIcon ? '#ffffff' : '#111111' }}
                                source={require('../Assets/icons/back_arrow.png')} /> */}
                                <FontAwesome5 name="arrow-left" color={whiteIcon ? '#ffffff' : '#111111'} size={RFValue(24)} solid />
                        </TouchableOpacity>
                    </View>
                    : null
                }
                {
                    menuButton ? <View style={{ flex: 1, }}>
                        <TouchableOpacity onPress={() =>
                            navigation.openDrawer()}
                            style={{flex:1, borderRadius: hp('2%'), alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 }}>
                            {/* <Image resizeMode='contain'

                                source={require('../Assets/icons/menu.png')} /> */}
                                 <FontAwesome5 name="bars" color={whiteIcon ? '#ffffff' : '#111111'} size={RFValue(24)} solid />
                        </TouchableOpacity>
                    </View> : null
                }
                {
                    icon ?
                        <View style={{ flex: 5, justifyContent: 'center' }}>
                            {/* <Image resizeMode='contain' style={{ height: hp('4.5%'), width: wp('35%') }} source={require("../Assets/logo.png")} /> */}
                        </View>
                        :
                        <View
                            style={{ flex: 5, paddingRight: button ? hp('8%') : null, justifyContent: 'center', alignItems:'center' }}>
                            <Text numberOfLines={1} style={{  fontSize: RFValue(18), fontWeight:'bold', color: whiteIcon ? '#ffffff' : '#111111' }}>{title}</Text>
                        </View>

                }
                {/* {
                    rightIcon ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={call}>
                                <Image resizeMode='contain' style={{ tintColor: whiteIcon ? '#ffffff' : '#111111' }} source={require("../Assets/icons/edit_white.png")} />
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
                {
                    blankAuth ?
                        null
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ height: hp('8%'), justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('NotificationScreeen')}>
                                <View>
                                    <Image style={{ tintColor: whiteIcon ? '#ffffff' : '#111111' }} resizeMode='contain' source={require("../Assets/icons/bell.png")} />
                                    <View style={{ position:'absolute', height: 18, width: 18, backgroundColor: errorColor, borderRadius: 9, left:18, bottom:10, justifyContent:'center', alignItems:'center' }}>
                                        <Text style={{fontSize:8, fontFamily:fontFamily(),color:"#ffffff"}}>
                                            {badge==0?0:badge>=99?'99+':badge}
                                            
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                } */}
                {/* onPress={() => navigation.navigate('NotificationScreeen')} */}
                {/* <Text>{arrr}</Text> */}
            </View>
        </View>
    )
}
export default Header;
