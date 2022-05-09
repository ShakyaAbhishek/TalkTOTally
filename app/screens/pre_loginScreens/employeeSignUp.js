//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { fontSizes } from '../../utils/responsive';
import Header from '../../components/CommonHeader';
import { NavigationEvents } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { validateEmail, validatePassword, validatePhoneNo } from '../../services/validation';
import { Loader } from '../../components/loaderModal';
import BackgroundImage from '../../assets/backgroundImage.jpg';
import OtpTextInput from '../../components/otpTextInput';
import Toast from 'react-native-simple-toast';

// create a component
class EmployeeSignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companiesData: [
                {
                    value: "",
                    label: "No Data"
                }
            ],
            company_id: '',
            company_idErr: '',
            employeeName: '',
            employeeNameErr: '',
            password: '',
            passwordErr: '',
            mobileNo: '',
            mobileNoErr: '',
            email: '',
            emailErr: '',
            errMessageArr: [],
            showPassword: true,
            spinnerVisible: true,
            OtpVisible: false,
            user_type: 2,
            registered_id: '',


        }
    }
    componentDidMount() {
        let form = new FormData();
        fetch('http://whitetechnologies.co.in/app/getCompany', {
            method: 'GET',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            }
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {
                    console.warn(responseJson)
                    var newArr = [];
                    var reciveData = [];
                    reciveData = responseJson.data;
                    reciveData.map(item => {

                        var obj = {
                            label: item.company_name,
                            value: item.company_id,
                        }
                        newArr.push(obj);
                    })
                    this.setState({ companiesData: newArr, spinnerVisible: false })
                }
            }).catch((error) => {
                console.warn(error);
            });
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
        if (type == "employeeName") {
            if (!pattern.test(text)) {
                this.setState({
                    employeeName: text,
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
            company_id,
            employeeName,
            password,
            mobileNo,
            email,
            errMessageArr
        } = this.state;
        errMessageArr = [];
        // alert(company_id)
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

        if (employeeName.trim() == '' || employeeName.trim() === null || employeeName.trim() === undefined) {
            this.setState({
                employeeNameErr: "*Please enter employee name",
                errMessageArr: errMessageArr.push("*Please enter company name")
            })
        }
        if (company_id.trim() == '' || company_id.trim() === null || company_id.trim() === undefined) {
            this.setState({
                company_idErr: "*Please select company ",
                errMessageArr: errMessageArr.push("*Please enter company ")
            })
        }

        setTimeout(() => {
            if (this.state.errMessageArr.length == 0) {
                this.setState({ spinnerVisible: true });
                let form = new FormData();
                form.append("company_id", company_id);
                form.append("name", employeeName);
                form.append("password", password);
                form.append("mobile", mobileNo);
                form.append("email", email.toLowerCase());
                console.warn("FORMMMMMM=====>", form)

                fetch('http://whitetechnologies.co.in/app/registerUser', {
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
                            Toast.show("OTP sent to your registered email.", Toast.LONG);
                            this.setState({ spinnerVisible: false, OtpVisible: true, registered_id: responseJson.registered_id });
                            // Alert.alert("", "OTP sent to your registered email id.", [
                            //     {
                            //         text: 'OK', onPress: () => {
                            //             this.setState({ spinnerVisible: false, OtpVisible: true, registered_id: responseJson.registered_id });
                            //             //this.props.navigation.navigate('LoginScreen');
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
        }, 200)

    }

    componentWillUnmount() {
        clearTimeout();
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
                    Toast.show("Employee Register Successfully ", Toast.LONG);
                    this.setState({ spinnerVisible: false, OtpVisible: false },
                        () => {
                            this.props.navigation.navigate('LoginScreen');
                        });
                    // Alert.alert("", "Employee Register Successfully ", [
                    //     {
                    //         text: 'OK', onPress: () => {
                    //             this.setState({ spinnerVisible: false, OtpVisible: false });
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
                {/* <NavigationEvents
                    onWillFocus={
                        () => this.firstFunction()
                    }
                /> */}
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <OtpTextInput OtpVisible={this.state.OtpVisible} OpenCloseOtpVisible={this.OpenCloseOtpVisible} sendData={this.sendData} ResendOtp={this.ResendOtp} />
                <Header navigation={navigation} backButtonNavigation={true} transparent={true} button={true} whiteIcon={true} />
                <View style={styles.container}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
                        <View style={{ height: hp('88%'), justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.formViewHeader}>
                                <Text style={styles.headerFont}>Employee Regestration</Text>
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
                                                data={this.state.companiesData}
                                                placeholder="Select Company"
                                                placeholderTextColor='#ffffff'
                                                fontSize={hp('2%')}
                                                labelFontSize={0}
                                                fontSize={hp('2%')}
                                                rippleOpacity={0}
                                                style={{ color: 'white' }} //for changed text color
                                                baseColor="rgba(255, 255, 255,1)" //for initial text color
                                                containerStyle={{ height: hp('5.8%'), marginRight: wp('2.4%') }}
                                                dropdownOffset={{ top: hp('1.7%') }}
                                                onChangeText={(value) => {
                                                    console.warn(value)
                                                    this.setState({
                                                        company_id: value,
                                                        company_idErr: '',
                                                        errMessageArr: []
                                                    })
                                                }}
                                                pickerStyle={{ marginBottom: hp('10%'), marginLeft: hp('1.5%'), borderRadius: hp("1%") }}
                                            />

                                        </View>
                                    </View>
                                    {
                                        this.state.company_idErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.company_idErr}</Text>
                                    }
                                    {/* admin name  view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="user" size={fontSizes(24)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                //selectedValue={this.state.language}
                                                style={styles.textinputStyleFont}
                                                placeholder="Employee Name"
                                                placeholderTextColor='#ffffff'
                                                value={this.state.employeeName}
                                                maxLength={56}
                                                keyboardType={'default'}
                                                onChangeText={(text) => this.onChange(text, "employeeName")}
                                                onSubmitEditing={() => this.refs.password.focus()}
                                                onFocus={() => this.setState({ employeeNameErr: '', errMessageArr: [] })}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.employeeNameErr == '' ? null :
                                            <Text style={styles.errorFont} >{this.state.employeeNameErr}</Text>
                                    }
                                    {/* password input view */}
                                    <View style={[styles.inputViewswithImage, { marginTop: hp('2%') }]}>
                                        <View style={styles.imageIconView}>
                                            <Icon name="key" size={fontSizes(24)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                //selectedValue={this.state.language}
                                                style={styles.textinputStyleFont}
                                                placeholder="Password"
                                                placeholderTextColor='#ffffff'
                                                value={this.state.password}
                                                maxLength={20}
                                                secureTextEntry={this.state.showPassword}
                                                keyboardType={'default'}
                                                onChangeText={(text) => this.onChange(text, "password")}
                                                ref="password"
                                                onSubmitEditing={() => this.refs.mobileNo.focus()}
                                                onFocus={() => this.setState({ passwordErr: '', errMessageArr: [] })}
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
                                            <Icon name="phone" size={fontSizes(24)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                //selectedValue={this.state.language}
                                                style={styles.textinputStyleFont}
                                                placeholder="Mobile No"
                                                placeholderTextColor='#ffffff'
                                                keyboardType={'phone-pad'}
                                                value={this.state.mobileNo}
                                                maxLength={13}
                                                onChangeText={(text) => this.onChange(text, "mobileNo")}
                                                ref="mobileNo"
                                                onSubmitEditing={() => this.refs.email.focus()}
                                                onFocus={() => this.setState({ mobileNoErr: '', errMessageArr: [] })}
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
                                            <Icon name="envelope" size={fontSizes(24)} color="#ffffff" />
                                        </View>
                                        <View style={{ flex: 6, justifyContent: 'center' }}>
                                            <TextInput
                                                //selectedValue={this.state.language}
                                                style={styles.textinputStyleFont}
                                                placeholder="Email"
                                                placeholderTextColor='#ffffff'
                                                value={this.state.email}
                                                maxLength={56}
                                                keyboardType={'default'}
                                                onChangeText={(text) => this.onChange(text, "email")}
                                                ref="email"
                                                // onSubmitEditing={() => this.refs.email.focus()}
                                                onFocus={() => this.setState({ emailErr: '', errMessageArr: [] })}
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
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
                                            <Text style={[styles.buttonTextStyle, { color: '#3B8BCA' }]}>SIGNIN</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
        //height: hp('60%'),
        width: wp('90%'),
        // elevation: 5,
        borderRadius: 10,
        //backgroundColor: 'yellow'
    },
    formViewHeader: {
        height: hp('7%'),
        // borderColor: "#eaeaea",
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
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: hp('2%'),
        //backgroundColor: "#ffffff",
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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    buttonBorderView: {
        width: wp('70%'),
        //paddingHorizontal: wp('7%'),
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
    },
    textinputStyleFont: {
        flex: 1,
        fontSize: fontSizes('smalltitle'),
        color: '#ffffff'
    },
});

//make this component available to the app
export default EmployeeSignUp;
