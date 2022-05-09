//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { fontSizes } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from '../../components/CommonHeader';
import AsyncStorage from '@react-native-community/async-storage';
import * as saveCompanyDataAction from '../../app_Redux/action/saveCompanyDataAction';
import * as saveUserDataAction from '../../app_Redux/action/saveUserDataAction';
import { connect } from "react-redux";
import BackgroundImage from '../../assets/backgroundImage.jpg';
import logoImage from '../../assets/logo_dummy.png';
import userImageDummy from '../../assets/user_dummy.jpg';
import OtpTextInput from '../../components/otpTextInput';
import { validateEmail, validatePassword, validatePhoneNo } from '../../services/validation';
import { Loader } from '../../components/loaderModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Toast from 'react-native-simple-toast';
// create a component
class ChangePasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            showPassword1: true,
            showPassword2: true,
            newpassword: '',
            newpasswordErr: '',
            oldpassword: '',
            oldpasswordErr: '',
            errMessageArr: [],
            user_id: '',
            user_type: ''
        }
    }

    componentDidMount() {
        var user_id = this.props.navigation.getParam('user_id', '');
        var user_type = this.props.navigation.getParam('user_type', '');
        this.setState({
            user_type: user_type,
            user_id: user_id
        });
        // console.warn('user id as parram', user_id);
        // console.warn('user type as parram', user_type)
    }

    onChange(text, type) {
        //this pattern checks for emoji
        var pattern = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/
        if (type === 'email') {
            if (!pattern.test(text)) {
                this.setState({
                    email: text.replace(/[^A-Za-z0-9@_.]/g, ''),
                    errMessageArr: []
                });
            }

        }
        if (type === 'oldpassword') {
            this.setState({
                oldpassword: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
                errMessageArr: []
            });
        }
        if (type === 'newpassword') {
            this.setState({
                newpassword: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
                errMessageArr: []
            });
        }
    }

    sendButton = () => {
        let { user_id, user_type, oldpassword, newpassword, errMessageArr } = this.state;
        errMessageArr = [];
        if (validatePassword(oldpassword).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validatePassword(oldpassword).message),
                oldpasswordErr: validatePassword(oldpassword).message
            })
        }
        if (validatePassword(newpassword).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validatePassword(newpassword).message),
                newpasswordErr: validatePassword(newpassword).message
            })
        }
        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                this.setState({ spinnerVisible: true })
                let form = new FormData();
                form.append("user_type", user_type);
                form.append("user_id", user_id);
                form.append("old_password", oldpassword);
                form.append("new_password", newpassword);
                console.warn("FORMMMMMM=====>", form)

                fetch('http://whitetechnologies.co.in/app/changePassword', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        //"Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: form

                }).then((response) => response.json())
                    //console.warn("total",response)
                    .then((responseJson) => {
                        console.warn(responseJson)
                        if (responseJson.status) {
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                            this.props.navigation.goBack();
                            // Alert.alert("", responseJson.message, [
                            //     {
                            //         text: 'OK', onPress: () => {
                            //             this.setState({ spinnerVisible: false });
                            //             this.props.navigation.goBack();
                            //         }
                            //     },
                            // ],
                            //     { cancelable: false });

                        }
                        else {
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                            // Alert.alert("", responseJson.message, [
                            //     {
                            //         text: 'OK', onPress: () => {
                            //             this.setState({ spinnerVisible: false });
                            //         }
                            //     },
                            // ],
                            //     { cancelable: false });

                        }
                        // Showing response message coming from server after inserting records.

                    }).catch((error) => {
                        Toast.show(error, Toast.LONG);
                        this.setState({ spinnerVisible: false });
                    });

            }
        }, 200);
    }


    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Header navigation={navigation} transparent={true} backButtonNavigation={true} button={true} whiteIcon={true} />
                <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.container1}>
                        <View style={styles.formViewHeader}>
                            <Text style={styles.headerFont}>Change Password</Text>
                        </View>


                        <View style={styles.formInputView}>
                            {/* user id view */}
                            {/* <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                <View style={styles.imageIconView}>
                                    <Icon name="envelope" size={fontSizes(24)} color="#ffffff" />
                                </View>
                                <View style={{ flex: 6, justifyContent: 'center' }}>
                                    <TextInput
                                        //selectedValue={this.state.language}
                                        style={{ flex: 1, fontSize: fontSizes('title'), color: '#ffffff' }}
                                        placeholder="Email Id"
                                        placeholderTextColor="#ffffff"
                                        value={this.state.user_id}
                                        maxLength={56}
                                        editable={false}
                                        keyboardType={'email-address'}
                                        onChangeText={(text) => this.onChange(text, "email")}
                                        // onSubmitEditing={() => this.refs.password.focus()}
                                        onFocus={() => this.setState({ emailErr: '' })}
                                    />
                                </View>
                            </View>
                            {
                                this.state.emailErr == '' ? null :
                                    <Text style={styles.errorFont} >{this.state.emailErr}</Text>
                            } */}
                            <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                <View style={styles.imageIconView}>
                                    <Icon name="key" size={fontSizes(24)} color="#ffffff" />
                                </View>
                                <View style={{ flex: 5, justifyContent: 'center' }}>
                                    <TextInput
                                        //selectedValue={this.state.language}
                                        style={{ flex: 1, fontSize: fontSizes('title'), color: '#ffffff' }}
                                        placeholder="Old Password"
                                        placeholderTextColor="#ffffff"
                                        value={this.state.oldpassword}
                                        maxLength={20}
                                        secureTextEntry={this.state.showPassword1}
                                        keyboardType={'default'}
                                        onChangeText={(text) => this.onChange(text, "oldpassword")}
                                        ref="password"
                                        onSubmitEditing={() => this.refs.newpassword.focus()}
                                        onFocus={() => this.setState({ oldpasswordErr: '' })}
                                    />
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this.setState({ showPassword1: !this.state.showPassword1 })}>
                                        <Text style={{ fontSize: fontSizes('smalltitle'), fontWeight: 'bold', color: '#ffffff' }}>{this.state.showPassword1 ? "SHOW" : 'HIDE'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {
                                this.state.oldpasswordErr == '' ? null :
                                    <Text style={styles.errorFont} >{this.state.oldpasswordErr}</Text>
                            }
                            <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                <View style={styles.imageIconView}>
                                    <Icon name="key" size={fontSizes(24)} color="#ffffff" />
                                </View>
                                <View style={{ flex: 5, justifyContent: 'center' }}>
                                    <TextInput
                                        //selectedValue={this.state.language}
                                        style={{ flex: 1, fontSize: fontSizes('title'), color: '#ffffff' }}
                                        placeholder="New Password"
                                        placeholderTextColor="#ffffff"
                                        value={this.state.newpassword}
                                        maxLength={20}
                                        secureTextEntry={this.state.showPassword2}
                                        keyboardType={'default'}
                                        onChangeText={(text) => this.onChange(text, "newpassword")}
                                        ref="newpassword"
                                        // onSubmitEditing={() => this.refs.mobileNo.focus()}
                                        onFocus={() => this.setState({ newpasswordErr: '' })}
                                    />
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => this.setState({ showPassword2: !this.state.showPassword2 })}>
                                        <Text style={{ fontSize: fontSizes('smalltitle'), fontWeight: 'bold', color: '#ffffff' }}>{this.state.showPassword2 ? "SHOW" : 'HIDE'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {
                                this.state.newpasswordErr == '' ? null :
                                    <Text style={styles.errorFont} >{this.state.newpasswordErr}</Text>
                            }
                            {/* buttons View */}
                            <View style={styles.buttonView}>
                                <TouchableOpacity onPress={() => this.sendButton()} style={styles.buttonBorderView}>
                                    <Text style={styles.buttonTextStyle}>SEND</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </KeyboardAwareScrollView>
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    container1: {
        height: hp('98%'),
        width: wp('100%'),
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#2c3e50',
    },
    formView: {
        //height: hp('60%'),
        width: wp('90%'),
        //elevation: 5,
        borderRadius: 10,
        //backgroundColor: 'yellow'
    },
    formViewHeader: {
        height: hp('7%'),
        //borderColor: "#eaeaea",
        // borderBottomWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerFont: {
        fontSize: fontSizes(28),
        fontWeight: 'bold',
        color: "#eaeaea"
    },
    formInputView: {
        margin: hp('5%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputViewswithImage: {
        width: wp('80%'),
        height: hp('6%'),
        // backgroundColor: "#ffffff",
        borderRadius: hp('2%'),
        borderColor: '#ffffff',
        borderWidth: 2,
        flexDirection: 'row'
    },
    imageIconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonView: {
        marginTop: hp('4%'),
        width: wp('90%'),
        //flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonBorderView: {
        paddingHorizontal: wp('10%'),
        paddingVertical: hp('1%'),
        backgroundColor: '#3B8BCA',
        borderColor: "#3B8BCA",
        borderWidth: 2,
        borderRadius: 20,
        elevation: 5
    },
    buttonTextStyle: {
        fontSize: fontSizes('title'),
        fontWeight: 'bold',
        color: "#ffffff"
    },
    errorFont: {
        fontSize: fontSizes('smalltitle'),
        color: '#ffffff'
    }
});

//make this component available to the app
export default ChangePasswordScreen;
