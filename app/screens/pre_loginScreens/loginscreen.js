//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { fontSizes } from '../../utils/responsive';
import Header from '../../components/CommonHeader';
import { Dropdown } from 'react-native-material-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { validateEmail, validatePassword, validatePhoneNo } from '../../services/validation';
import { Loader } from '../../components/loaderModal';
import BackgroundImage from '../../assets/backgroundImage.jpg';
import Toast from 'react-native-simple-toast';

// create a component
class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: [
                {
                    value: 2,
                    label: "Company User"
                },
                {
                    value: 1,
                    label: "Company Admin"
                },
            ],
            user: '',
            userErr: '',
            email: '',//'coolabhi@gmail.com',//'ashu@xyz.com',//badboys@gmail.com   // for employee--> bigbadboy@gmail.com //badboy2@gmail.com
            emailErr: '',
            password: '', //A12345678@a
            passwordErr: '',
            errMessageArr: [],
            fcm_token: '',
            showPassword: true,
            spinnerVisible: false,


        }
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
        if (type === 'password') {
            this.setState({
                password: text.replace(/[^A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[^_`{|}~]/g, ''),
                errMessageArr: []
            });
        }
    }

    loginButton = () => {
        let {
            user,
            password,
            email,
            fcm_token,
            errMessageArr
        } = this.state;
        errMessageArr = [];
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

        if (user == '' || user === null || user === undefined) {
            this.setState({
                userErr: "*Please select user Type ",
                errMessageArr: errMessageArr.push("*Please enter company ")
            })
        }

        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                this.setState({ spinnerVisible: true });
                let form = new FormData();
                form.append("user_type", user);
                form.append("password", password);
                form.append("device_token", fcm_token);
                form.append("email", email.toLowerCase());
                console.warn("FORMMMMMM=====>", form)

                fetch('http://whitetechnologies.co.in/app/login', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        //"Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: form

                }).then((response) => response.json())
                    .then(async (responseJson) => {
                        console.warn(JSON.stringify(responseJson))
                        // Showing response message coming from server after inserting records.
                        if (responseJson.status) {
                            await AsyncStorage.setItem("auth_token", JSON.stringify(responseJson.status));
                            await AsyncStorage.setItem("user_type", JSON.stringify(responseJson.user_type));
                            if (responseJson.user_type == 'User') {
                                await AsyncStorage.setItem("user_Id", JSON.stringify(responseJson.data.user_id));
                                await AsyncStorage.setItem("company_id", JSON.stringify(responseJson.data.company_id));
                            }
                            if (responseJson.user_type == 'Admin') {
                                await AsyncStorage.setItem("company_id", JSON.stringify(responseJson.data.company_id));
                            }
                            await AsyncStorage.setItem('all_data', JSON.stringify(responseJson.data))
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                            this.props.navigation.navigate('mainRoute');
                            // Alert.alert("", responseJson.message, [
                            //     {
                            //         text: 'OK', onPress: () => {
                            //             this.setState({ spinnerVisible: false });
                            //             this.props.navigation.navigate('mainRoute')
                            //         }
                            //     },
                            // ],
                            //     { cancelable: false });
                        }
                        else {
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                            // this.setState({ spinnerVisible: false })
                            // Alert.alert("", responseJson.message, [
                            //     { text: 'OK', },
                            // ],
                            //     { cancelable: false });
                        }
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

    render() {
        const navigation = this.props.navigation;
        return (
            <View style={styles.container}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                {/* <Header navigation={navigation} whiteIcon={true} title={'Login'} /> */}
                <ImageBackground source={BackgroundImage} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                        <View style={{ height: hp('88%'), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.formViewHeader}>
                                <Text style={styles.headerFont}>Login</Text>
                            </View>
                            <View style={styles.formView}>

                                <View style={styles.formInputView}>
                                    {/* picker view */}
                                    <View style={styles.inputViewswithImage}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="building" size={fontSizes(24)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6 }}>
                                            <Dropdown
                                                data={this.state.userType}
                                                placeholder="Select User Type"
                                                placeholderTextColor='#ffffff'
                                                fontSize={hp('2%')}
                                                baseColor={'transparent'}
                                                animationDuration={100}
                                                labelFontSize={0}
                                                fontSize={hp('2%')}
                                                style={{ color: 'white' }} //for changed text color
                                                baseColor="rgba(255, 255, 255,1)" //for initial text color
                                                //color={'#ffffff'}
                                                rippleOpacity={0}
                                                containerStyle={{ height: hp('5.8%'), marginRight: wp('3%') }}
                                                dropdownOffset={{ top: hp('1.8%'), color: '#ffffff', }}
                                                onChangeText={(value) => {
                                                    console.warn(value)
                                                    this.setState({
                                                        user: value,
                                                        userErr: '',
                                                        errMessageArr:[]
                                                    })
                                                }}
                                                pickerStyle={{ marginBottom: hp('10%'), marginLeft: hp('1.5%'), borderRadius: hp("1%"), color: '#ffffff' }}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.userErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.userErr}</Text>
                                    }
                                    {/* user id view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="envelope" size={fontSizes(24)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6}}>
                                            <TextInput
                                                //selectedValue={this.state.language}
                                                style={{ flex: 1, fontSize: fontSizes('title'), color: '#ffffff' }}
                                                placeholder="Email Id"
                                                placeholderTextColor="#ffffff"
                                                value={this.state.email}
                                                maxLength={56}
                                                keyboardType={'email-address'}
                                                onChangeText={(text) => this.onChange(text, "email")}
                                                onSubmitEditing={() => this.refs.password.focus()}
                                                onFocus={() => this.setState({ emailErr: '' })}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.emailErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.emailErr}</Text>
                                    }
                                    {/* password input view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="key" size={fontSizes(24)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 5 }}>
                                            <TextInput
                                                //selectedValue={this.state.language}
                                                style={{ flex: 1, fontSize: fontSizes('title'), color: '#ffffff' }}
                                                placeholder="Password"
                                                placeholderTextColor="#ffffff"
                                                value={this.state.password}
                                                maxLength={20}
                                                secureTextEntry={this.state.showPassword}
                                                keyboardType={'default'}
                                                onChangeText={(text) => this.onChange(text, "password")}
                                                ref="password"
                                                // onSubmitEditing={() => this.refs.mobileNo.focus()}
                                                onFocus={() => this.setState({ passwordErr: '' })}
                                            />
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => this.setState({ showPassword: !this.state.showPassword })}>
                                                <Text style={{ fontSize: fontSizes('smalltitle'), fontWeight: 'bold', color: '#ffffff' }}>{this.state.showPassword ? "SHOW" : 'HIDE'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {
                                        this.state.passwordErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.passwordErr}</Text>
                                    }
                                    {/* forgot password button view */}
                                    <View style={{ width: wp('80%'), marginTop: hp('2%'), justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgetPasswordScreen')}>
                                            <Text style={styles.buttonTextStyle}>Forgot Password?</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* buttons View */}
                                    <View style={styles.buttonView}>
                                        {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('SignUpScreen') }} style={styles.buttonBorderView}>
                                            <Text style={styles.buttonTextStyle}>SIGN UP</Text>
                                        </TouchableOpacity> */}
                                        <TouchableOpacity onPress={() => this.loginButton()} style={styles.buttonBorderView}>
                                            <Text style={styles.buttonTextStyle}>SIGN IN</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: hp('2%') }}>
                                        <Text style={styles.buttonTextStyle}>Don't have an account?    </Text>
                                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('SignUpScreen') }}>
                                            <Text style={[styles.buttonTextStyle,{color:'#3B8BCA'}]}>SIGNUP</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </ImageBackground>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#213858'
    },
    formView: {
        //height: hp('60%'),
        width: wp('90%'),
        // elevation: 5,
        borderRadius: 10,
        //backgroundColor: 'yellow'
    },
    formViewHeader: {
        height: hp('7%'),
        borderColor: "#eaeaea",
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
        marginTop: hp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputViewswithImage: {
        width: wp('80%'),
        height: hp('6%'),
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: hp('2%'),
        elevation:5,
        // backgroundColor: "#ffffff99",
        flexDirection: 'row'
    },
    imageIconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonView: {
        marginTop: hp('3%'),
        width: wp('90%'),
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    buttonBorderView: {
        paddingHorizontal: wp('10%'),
        paddingVertical: hp('1.2%'),
        backgroundColor: '#3B8BCA',
        borderColor: "#3B8BCA",
        borderWidth: 1,
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
export default LoginScreen;


// colors={['#D5393D', '#DE413B', '#E65138', '#EB5E3B', '#F07238', '#F1833B']