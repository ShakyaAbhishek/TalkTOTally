//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, TextInput, TouchableOpacity, ImageBackground,Alert } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { fontSizes } from '../../utils/responsive';
import { Loader } from '../../components/loaderModal';
import Header from '../../components/CommonHeader';
import BackgroundImage from '../../assets/backgroundImage.jpg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { validateEmail } from '../../services/validation';
import Toast from 'react-native-simple-toast';

// create a component
class ForgetPasswordScreen extends Component {
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
            email: '',
            emailErr: '',
            errMessageArr: [],
            spinnerVisible:false
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
    }


    sendButton = () => {
        let { email, user, errMessageArr } = this.state;
        errMessageArr = [];
        if (user == '' || user === null || user === undefined) {
            this.setState({
                userErr: "*Please select user Type ",
                errMessageArr: errMessageArr.push("*Please enter company ")
            })
        }
        if (validateEmail(email).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validateEmail(email).message),
                emailErr: validateEmail(email).message
            })
        }
        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                this.setState({spinnerVisible:true})
                let form = new FormData();
                form.append("user_type", user);
                form.append("email", email.toLowerCase());
                console.warn("FORMMMMMM=====>", form)

                fetch('http://whitetechnologies.co.in/app/resetPassword', {
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
                            this.props.navigation.navigate('LoginScreen');
                            // Alert.alert("", responseJson.message, [
                            //     {
                            //         text: 'OK', onPress: () => {
                            //             this.setState({ spinnerVisible: false });
                            //             this.props.navigation.navigate('LoginScreen');
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
            <ImageBackground source={BackgroundImage} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Header navigation={navigation} transparent={true} backButtonNavigation={true} button={true} whiteIcon={true} />

                <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <View style={styles.formViewHeader}>
                            <Text style={styles.headerFont}>Forget Password?</Text>
                        </View>


                        <View style={styles.formInputView}>
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
                                                errMessageArr: []
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
                                <View style={{ flex: 6, justifyContent: 'center' }}>
                                    <TextInput
                                        //selectedValue={this.state.language}
                                        style={{ flex: 1, fontSize: fontSizes('title'), color: '#ffffff' }}
                                        placeholder="Email Id"
                                        placeholderTextColor="#ffffff"
                                        value={this.state.email}
                                        maxLength={56}
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
        height: hp('88%'),
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
export default ForgetPasswordScreen;
