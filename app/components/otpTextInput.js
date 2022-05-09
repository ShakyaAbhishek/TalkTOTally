//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Alert, ImageBackground, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import OTPTextView from 'react-native-otp-textinput';
import { fontSizes } from '../utils/responsive';
import BackgroundImage from '../assets/backgroundImage.jpg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
// create a component
class OtpTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text1: '',
            text2: '',
            errText2: '',
            text3: '',
            text4: '',
            toastVisible: false,
            spinnerVisible: false,
            toastColor: '',
            toastMessage: '',
        }
    }
    // this.props.sendData(this.state.text2)

    sendButton = () => {
        if (this.state.text2.trim() == '' || this.state.text2.trim() == null || this.state.text2.trim() == undefined) {
            // alert('k')
            this.setState({
                errText2: "*Please enter OTP",
            })
        }
        else {
            if (this.state.text2.length < 4) {
                this.setState({
                    errText2: "*Please enter valid OTP",
                })
            }
            else {
                this.props.sendData(this.state.text2)
            }
        }
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.OtpVisible}
                onRequestClose={() => {
                    // this.props.OpenCloseOtpVisible(false)
                }}
            >
                <View style={styles.container}>
                    {/* <KeyboardAwareScrollView > */}
                    <View>
                        {/* <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.OpenCloseOtpVisible(false)} style={{ position: 'absolute', zIndex: 5, elevation: 5, height: hp('7%'), width: wp('20%'), top: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#ED4258', fontSize: fontSizes(18), fontWeight: 'bold' }}>CLOSE</Text>
                        </TouchableOpacity> */}
                        <ImageBackground source={BackgroundImage} style={styles.insideContainer} imageStyle={{ borderRadius: 10 }}>
                            <KeyboardAvoidingView style={{ flex: 1, }}>
                                <ScrollView keyboardShouldPersistTaps="handled">
                                    <View style={{ height: hp('20%'), width: wp('90%'), justifyContent: 'flex-end' }}>
                                        <Text style={{ color: '#ffffff', fontSize: fontSizes(28), textAlign: 'center', fontWeight: 'bold' }}>Enter OTP</Text>
                                        <Text style={{ color: '#ffffff', fontSize: fontSizes(16), textAlign: 'center' }}>We have sent a OTP on your email id.</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ height: hp('35%'), width: wp('80%'), justifyContent: 'center', alignItems: 'center' }}>
                                            <OTPTextView
                                                containerStyle={styles.textInputContainer}
                                                handleTextChange={text => this.setState({ text2: text, errText2: '' })}
                                                textInputStyle={styles.roundedTextInput}
                                                inputCount={6}
                                                keyboardType="numeric"
                                            />
                                            {
                                                this.state.errText2 == '' ? null :
                                                    <Text style={styles.errorFont} >{this.state.errText2}</Text>
                                            }
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: '#ffffff', fontSize: fontSizes(14), textAlign: 'center' }}>Don't recieve the OTP?</Text>
                                                <TouchableOpacity onPress={()=>{this.props.ResendOtp()}}>
                                                    <Text style={{ color: '#55B82E', fontSize: fontSizes(14), fontWeight: 'bold', textAlign: 'center' }}>   RESEND OTP</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ height: hp('20%'), width: wp('90%'), flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                        <TouchableOpacity style={{ height: hp('6%'), width: wp('30%'), backgroundColor: '#55B82E', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} activeOpacity={1} onPress={() => this.sendButton()}>
                                            <Text style={{ color: '#ffffff', fontSize: fontSizes(18), fontWeight: 'bold', textAlign: 'center' }}>SEND</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: hp('6%'), width: wp('30%'), backgroundColor: '#ED4258', justifyContent: 'center', alignItems: 'center', borderRadius: 10, }} activeOpacity={1} onPress={() => this.props.OpenCloseOtpVisible(false)}>
                                            <Text style={{ color: '#ffffff', fontSize: fontSizes(18), fontWeight: 'bold', textAlign: 'center' }}>CANCEL</Text>
                                        </TouchableOpacity>
                                    </View>

                                </ScrollView>
                            </KeyboardAvoidingView>
                        </ImageBackground>

                    </View>
                    {/* </KeyboardAwareScrollView> */}
                </View>
            </Modal>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        height: hp('100%'),
        width: wp('100%'),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff20',
    },
    insideContainer: {
        height: hp('80%'),
        width: wp('90%'),
        backgroundColor: '#ffffff',
        borderRadius: 20,
        elevation: 3
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    textInputContainer: {
        marginBottom: 20,
        color: '#ffffff',
        //backgroundColor: 'red',
        //marginLeft:20,
        //width:100
    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 4,
        color: "#ffffff",
        fontSize: fontSizes(20),
        width: wp('12%'),
        height: hp('7%')
    },
    errorFont: {
        fontSize: fontSizes('smalltitle'),
        color: '#ffffff',
        textAlign: 'center'
    }
});

//make this component available to the app
export default OtpTextInput;
