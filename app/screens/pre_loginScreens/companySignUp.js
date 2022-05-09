//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { fontSizes } from '../../utils/responsive';
import { validateEmail, validatePassword, validatePhoneNo } from '../../services/validation';
import { NodeAPI, NodeAPIForm } from '../../services/validation';
import Header from '../../components/CommonHeader';
import { Loader } from '../../components/loaderModal';
import BackgroundImage from '../../assets/backgroundImage.jpg';
import OtpTextInput from '../../components/otpTextInput';
import Toast from 'react-native-simple-toast';
// create a component

const iconSize = 22;
class CompanySignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            companyName: '',
            companyNameErr: '',
            tallyLicenceNo: '',
            tallyLicenceNoErr: '',
            adminName: '',
            adminNameErr: '',
            password: '',
            passwordErr: '',
            mobileNo: '',
            mobileNoErr: '',
            email: '',
            emailErr: '',
            errMessageArr: [],
            user_type: 1,
            registered_id: '',
            showPassword: true,
            spinnerVisible: false,
            OtpVisible: false
        }
    }

    // handle text input
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
        if (type === 'password') {
            this.setState({
                password: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
                errMessageArr: []
            });
        }
        if (type == "adminName") {
            if (!pattern.test(text)) {
                this.setState({
                    adminName: text,
                    errMessageArr: []
                });
            }
        }
        if (type == "companyName") {
            if (!pattern.test(text)) {
                this.setState({
                    companyName: text,
                    errMessageArr: []
                });
            }
        }
        if (type == "tallyLicenceNo") {
            if (!pattern.test(text)) {
                this.setState({
                    tallyLicenceNo: text.replace(/[^0-9]/g, ''),
                    errMessageArr: []
                });
            }
        }
        if (type == "mobileNo") {
            this.setState({
                mobileNo: text.replace(/[^0-9]/g, ''),
                errMessageArr: []
            });
        }
    }
    //.replace(/[^A-Za-z ]/g, ''),

    submitButton = () => {
        let {
            companyName,
            tallyLicenceNo,
            adminName,
            password,
            mobileNo,
            email,
            errMessageArr
        } = this.state;
        errMessageArr = [];
        // alert(companyName + tallyLicenceNo + adminName + password + mobileNo + email)
        if (validateEmail(email).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validateEmail(email).message),
                emailErr: validateEmail(email).message
            })
        }
        if (validatePassword(password).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validatePassword(password).message),
                passwordErr: validatePassword(password).message
            })
        }
        if (validatePhoneNo(mobileNo).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validatePhoneNo(mobileNo).message),
                mobileNoErr: validatePhoneNo(mobileNo).message
            })
        }

        if (companyName.trim() == '' || companyName.trim() === null || companyName.trim() === undefined) {
            this.setState({
                companyNameErr: "*Please enter company name",
                errMessageArr: errMessageArr.push("*Please enter company name")
            })
        }
        if (tallyLicenceNo.trim() == '' || tallyLicenceNo.trim() === null || tallyLicenceNo.trim() === undefined) {
            this.setState({
                tallyLicenceNoErr: "*Please enter tally Licence No ",
                errMessageArr: errMessageArr.push("*Please enter tally Licence No ")
            })
        }
        if (adminName.trim() == '' || adminName.trim() === null || adminName.trim() === undefined) {
            this.setState({
                adminNameErr: "*Please enter admin name",
                errMessageArr: errMessageArr.push("*Please enter admin name")
            })
        }
        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                this.setState({ spinnerVisible: true });
                let form = new FormData();
                form.append("company_name", companyName);
                form.append("telly_licence_no", tallyLicenceNo);
                form.append("admin_name", adminName);
                form.append("password", password);
                form.append("mobile", mobileNo);
                form.append("email", email.toLowerCase());
                console.warn("FORMMMMMM=====>", form)

                fetch('http://whitetechnologies.co.in/app/registerCompany', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        //"Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: form

                }).then((response) => response.json())
                    .then((responseJson) => {
                        console.warn(JSON.stringify(responseJson))
                        if (responseJson.status) {
                            Toast.show("OTP send to your registered email. ", Toast.LONG);
                            this.setState({ spinnerVisible: false, OtpVisible: true, registered_id: responseJson.registered_id });
                            // Alert.alert("", "OTP send to your registered email id ", [
                            //     {
                            //         text: 'OK', onPress: () => {
                            //             this.setState({ spinnerVisible: false, OtpVisible: true, registered_id: responseJson.registered_id });
                            //             //this.props.navigation.navigate('LoginScreen')
                            //         }
                            //     },
                            // ],
                            //     { cancelable: false });

                        }
                        else {
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                            // Alert.alert("", responseJson.message, [
                            //     { text: 'OK', onPress: () => this.setState({ spinnerVisible: false }) },
                            // ],
                            //     { cancelable: false });

                        }
                        // Showing response message coming from server after inserting records.
                    }).catch((error) => {
                        Toast.show(error, Toast.LONG);
                        this.setState({ spinnerVisible: false });
                    });

            }
        }, 200)

    }

    componentWillUnmount() {
        clearTimeout();
    }
    OpenCloseOtpVisible = (param) => {
        this.setState({
            OtpVisible: !this.state.OtpVisible
        });
    }

    sendData = (data) => {
        this.setState({ spinnerVisible: true })
        console.warn('dadaddada', data)
        let form = new FormData();
        form.append("otp", data);
        form.append("user_type", this.state.user_type);
        form.append("registered_id", this.state.registered_id);
        console.warn("FORMMMMMM=====>", form)

        fetch('http://whitetechnologies.co.in/app/verifyOtp', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                //"Content-Type": "application/x-www-form-urlencoded"
            },
            body: form

        }).then((response) => response.json())
            .then((responseJson) => {
                console.warn(JSON.stringify(responseJson))
                if (responseJson.status) {
                    Toast.show("Company Register Successfully ", Toast.LONG);
                    this.setState({ spinnerVisible: false });
                    this.props.navigation.navigate('LoginScreen');
                    // Alert.alert("", "Company Register Successfully ", [
                    //     {
                    //         text: 'OK', onPress: () => {
                    //             this.setState({ spinnerVisible: false, OtpVisible: false});
                    //             this.props.navigation.navigate('LoginScreen')
                    //         }
                    //     },
                    // ],
                    //     { cancelable: false });

                }
                else {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                    // Alert.alert("", responseJson.message, [
                    //     { text: 'OK', onPress: () => this.setState({ spinnerVisible: false }) },
                    // ],
                    //     { cancelable: false });

                }
                // Showing response message coming from server after inserting records.
            }).catch((error) => {
                Toast.show(error, Toast.LONG);
                this.setState({ spinnerVisible: false });
            });

    }

    ResendOtp = () => {
        this.setState({ spinnerVisible: true })
        let form = new FormData();
        form.append("user_type", this.state.user_type);
        form.append("user_id", this.state.registered_id);
        console.warn("FORMMMMMM=====>", form)

        fetch('http://whitetechnologies.co.in/app/resendOtp', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                //"Content-Type": "application/x-www-form-urlencoded"
            },
            body: form

        }).then((response) => response.json())
            .then((responseJson) => {
                console.warn(JSON.stringify(responseJson))
                if (responseJson.status) {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                    // Alert.alert("", "Company Register Successfully ", [
                    //     {
                    //         text: 'OK', onPress: () => {
                    //             this.setState({ spinnerVisible: false, OtpVisible: false});
                    //             this.props.navigation.navigate('LoginScreen')
                    //         }
                    //     },
                    // ],
                    //     { cancelable: false });

                }
                else {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                    // Alert.alert("", responseJson.message, [
                    //     { text: 'OK', onPress: () => this.setState({ spinnerVisible: false }) },
                    // ],
                    //     { cancelable: false });

                }
                // Showing response message coming from server after inserting records.
            }).catch((error) => {
                Toast.show(error, Toast.LONG);
                this.setState({ spinnerVisible: false });
            });
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <OtpTextInput OtpVisible={this.state.OtpVisible} OpenCloseOtpVisible={this.OpenCloseOtpVisible} sendData={this.sendData} ResendOtp={this.ResendOtp} />
                <Header navigation={navigation} backButtonNavigation={true} button={true} whiteIcon={true} transparent={true} />
                <View style={styles.container}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                        <View style={{ height: hp('88%'), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.formViewHeader}>
                                <Text style={styles.headerFont}>Company Regestration</Text>
                            </View>
                            <View style={styles.formView}>
                                {/* <KeyboardAwareScrollView> */}
                                <View style={styles.formInputView}>

                                    {/* Company name  view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="building" size={fontSizes(iconSize)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                style={styles.textinputStyleFont}
                                                placeholder="Company Name"
                                                placeholderTextColor='#ffffff'
                                                value={this.state.companyName}
                                                maxLength={56}
                                                keyboardType={'default'}
                                                onChangeText={(text) => this.onChange(text, "companyName")}
                                                ref="email"
                                                onSubmitEditing={() => this.refs.tallyLicenceNo.focus()}
                                                onFocus={() => this.setState({ companyNameErr: '' })}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.companyNameErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.companyNameErr}</Text>
                                    }
                                    {/* tally lincence no view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="id-card" size={fontSizes(iconSize)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                style={styles.textinputStyleFont}
                                                placeholder="Tally Licence Number"
                                                placeholderTextColor='#ffffff'
                                                value={this.state.tallyLicenceNo}
                                                maxLength={56}
                                                keyboardType={'number-pad'}
                                                onChangeText={(text) => this.onChange(text.trim(), "tallyLicenceNo")}
                                                ref="tallyLicenceNo"
                                                onSubmitEditing={() => this.refs.adminName.focus()}
                                                onFocus={() => this.setState({ tallyLicenceNoErr: '' })}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.tallyLicenceNoErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.tallyLicenceNoErr}</Text>
                                    }
                                    {/* admin name  view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="user" size={fontSizes(iconSize)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                style={styles.textinputStyleFont}
                                                placeholder="Admin Name"
                                                placeholderTextColor='#ffffff'
                                                value={this.state.adminName}
                                                maxLength={56}
                                                keyboardType={'default'}
                                                onChangeText={(text) => this.onChange(text, "adminName")}
                                                ref="adminName"
                                                onSubmitEditing={() => this.refs.password.focus()}
                                                onFocus={() => this.setState({ adminNameErr: '' })}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.adminNameErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.adminNameErr}</Text>
                                    }
                                    {/* password input view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="key" size={fontSizes(iconSize)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                style={styles.textinputStyleFont}
                                                placeholder="Password"
                                                placeholderTextColor='#ffffff'
                                                value={this.state.password}
                                                maxLength={20}
                                                secureTextEntry={this.state.showPassword}
                                                keyboardType={'default'}
                                                onChangeText={(text) => this.onChange(text.trim(), "password")}
                                                ref="password"
                                                onSubmitEditing={() => this.refs.mobileNo.focus()}
                                                onFocus={() => this.setState({ passwordErr: '' })}
                                            />
                                        </View>
                                        <View style={{ flex: 1.2, justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => this.setState({ showPassword: !this.state.showPassword })}>
                                                <Text style={{ fontSize: fontSizes('smalltitle'), fontWeight: 'bold', color: '#ffffff' }}>{this.state.showPassword ? "SHOW" : 'HIDE'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {
                                        this.state.passwordErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.passwordErr}</Text>
                                    }
                                    {/* mobile no view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="phone" size={fontSizes(iconSize)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                style={styles.textinputStyleFont}
                                                placeholder="Mobile No"
                                                placeholderTextColor='#ffffff'
                                                keyboardType={'phone-pad'}
                                                value={this.state.mobileNo}
                                                maxLength={11}
                                                onChangeText={(text) => this.onChange(text.trim(), "mobileNo")}
                                                ref="mobileNo"
                                                onSubmitEditing={() => this.refs.email.focus()}
                                                onFocus={() => this.setState({ mobileNoErr: '' })}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.mobileNoErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.mobileNoErr}</Text>
                                    }
                                    {/* email id view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="envelope" size={fontSizes(iconSize)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                style={styles.textinputStyleFont}
                                                placeholder="Email"
                                                placeholderTextColor='#ffffff'
                                                keyboardType={'email-address'}
                                                value={this.state.email}
                                                maxLength={56}
                                                onChangeText={(text) => this.onChange(text.trim(), "email")}
                                                ref="email"
                                                onFocus={() => this.setState({ emailErr: '' })}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.emailErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.emailErr}</Text>
                                    }
                                    {/* buttons View */}
                                    <View style={styles.buttonView}>
                                        <TouchableOpacity onPress={() => this.submitButton()} style={styles.buttonBorderView}>
                                            <Text style={styles.buttonTextStyle}>SIGN UP</Text>
                                        </TouchableOpacity>

                                    </View>
                                    {/* forgot password button view */}
                                    <View style={{ width: wp('80%'), flexDirection: 'row', marginTop: hp('2%'), justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.buttonTextStyle}>Already have an account?   </Text>
                                        <TouchableOpacity onPress={() => {
                                             this.setState({ OtpVisible: true })
                                            //this.props.navigation.navigate('LoginScreen')
                                        }}
                                        >
                                            <Text style={[styles.buttonTextStyle, { color: '#3B8BCA' }]}>SIGNIN</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* </KeyboardAwareScrollView> */}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#2c3e50',
    },
    formView: {
        alignSelf: 'center',
        //height: hp('60%'),
        width: wp('90%'),
        //elevation: 5,
        margin: hp('2%'),
        borderRadius: 10
        //backgroundColor: 'yellow'
    },
    formViewHeader: {
        height: hp('7%'),
        //borderColor: "#eaeaea",
        //borderBottomWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerFont: {
        fontSize: fontSizes(28),
        fontWeight: 'bold',
        color: "#eaeaea"
    },
    formInputView: {
        margin: hp('2%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputViewswithImage: {
        width: wp('80%'),
        height: hp('6%'),
        borderRadius: hp('2%'),
        borderWidth: 2,
        borderColor: '#ffffff',
        //backgroundColor: "#ffffff",
        flexDirection: 'row'
    },
    textinputStyleFont: {
        flex: 1,
        fontSize: fontSizes('smalltitle'),
        color: '#ffffff'
    },
    imageIconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonView: {
        marginTop: hp('4%'),
        width: wp('90%'),
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    buttonBorderView: {
        width: wp('60%'),
        paddingVertical: hp('1%'),
        backgroundColor: '#3B8BCA',
        borderColor: "#3B8BCA",
        borderWidth: 2,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
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
export default CompanySignUp;
