//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image, ScrollView, TextInput, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { fontSizes } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
import Header from '../../components/CommonHeader';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import AsyncStorage from '@react-native-community/async-storage';
import * as saveUserDataAction from '../../app_Redux/action/saveUserDataAction';
import * as saveCompanyDataAction from '../../app_Redux/action/saveCompanyDataAction';
import { connect } from "react-redux";
import BackgroundImage from '../../assets/backgroundImage.jpg';
import { validateEmail, validatePassword, validatePhoneNo } from '../../services/validation';
import { Loader } from '../../components/loaderModal';
import Toast from 'react-native-simple-toast';

// create a component
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = ['Cancel', 'Camera', 'Gallery']
const title = 'Open Image from'

class UserDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile_img: '',
            user_id: '',
            user_idErr: '',
            user_name: '',
            userNameErr: '',
            company_name: '',
            company_nameErr: '',
            email_id: '',
            emailErr: '',
            mobile_no: '',
            mobile_noErr: '',
            ProfileImage: '',
            errMessageArr:[],
            spinnerVisible:true

        }
    }
    componentDidMount() {
        let data = this.props.userProfileData;
        let data1 = this.props.CompanyData;
        this.setState({
            user_id: data.user_id,
            user_name: data.name,
            company_name: data1.company_name,
            email_id: data.email,
            mobile_no: data.mobile,
            profile_img: data.profile_img,
            spinnerVisible:false
        })
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
        if (type == "userName") {
            if (!pattern.test(text)) {
                this.setState({
                    user_name: text,
                    errMessageArr: []
                });
            }
        }
        if (type == "adminSurname") {
            if (!pattern.test(text)) {
                this.setState({
                    adminSurname: text,
                    errMessageArr: []
                });
            }
        }
        if (type == "adminMiddleName") {
            if (!pattern.test(text)) {
                this.setState({
                    adminMiddleName: text,
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
        if (type == "mobile") {
            if (!pattern.test(text)) {
                this.setState({
                    mobile_no: text.replace(/[^0-9]/g, ''),
                    errMessageArr: []
                });
            }
        }
        if (type == "user_id") {
            this.setState({
                user_id: text.replace(/[^0-9]/g, ''),
                errMessageArr: []
            });
        }
    }
    showActionSheet() {
        // this.setState({ ProfileImageErr: '', errMessageArr: [] })
        this.ActionSheet.show()
    }

    handlePress(i) {
        this.setState({
            selected: i
        })
        if (i == 1) {
            ImagePicker.openCamera({
                width: 300,
                height: 300,
                compressImageQuality: 0.5,
                cropping: true,
                includeBase64: false,
                multiple: false,
                cropperCircleOverlay: true,
                includeBase64: true
            }).then(image => {
                console.warn('---------->profile', image)
                this.setState({
                    ProfileImage: image,
                }, () => this.imageUpload())
            }).catch((err) => {
                Alert.alert("", err.message);
            });
        } else if (i == 2) {
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                compressImageQuality: 0.5,
                cropping: true,
                includeBase64: false,
                multiple: false,
                cropperCircleOverlay: true,
                includeBase64: true
            }).then(image => {
                console.warn('---------->', image)
                console.log('---------->profile', image)
                this.setState({
                    ProfileImage: image,
                }, () => this.imageUpload())
            }).catch((err) => {
                Alert.alert("", err.message);
            });
        }
    }


    imageUpload = () => {
        // http://whitetechnologies.co.in/app/uploadCompanyProfileImg

        let form = new FormData();
        this.setState({spinnerVisible:true})
        form.append("user_id", JSON.parse(this.state.user_id));

        form.append('image', this.state.ProfileImage.data)

        // form.append("compasny_id", company_id);
        console.warn("form data", form)
        fetch("http://whitetechnologies.co.in/app/uploadUserProfileImg", {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            },
            body: form
        }).then((response) => response.json())
            .then((responseJson) => {
                console.warn("image upload detail", responseJson);
                if (responseJson.status == true) {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                    //console.warn("documnebt detail", responseJson);
                    this.props.saveUserDataAction(responseJson.data);
                }
                else {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                }
            }).catch((error) => {
                Toast.show(error, Toast.LONG);
                this.setState({ spinnerVisible: false });
            })
    }


    update_profile = () => {
        let { profile_img, user_id, user_name, email_id, mobile_no, errMessageArr } = this.state;
        errMessageArr = [];
        if (user_id == '' || user_id === null || user_id === undefined) {
            this.setState({
                user_idErr: "*Please enter user id ",
                errMessageArr: errMessageArr.push("*Please enter user id ")
            })
        }
        if (user_name == '' || user_name === null || user_name === undefined) {
            this.setState({
                userNameErr: "*Please enter user name ",
                errMessageArr: errMessageArr.push("*Please enter user name ")
            })
        }
        if (validateEmail(email_id).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validateEmail(email_id).message),
                emailErr: validateEmail(email_id).message
            })
        }
        if (validatePhoneNo(mobile_no).status !== true) {
            this.setState({
                errMessageArr: errMessageArr.push(validatePhoneNo(mobile_no).message),
                mobile_noErr: validatePhoneNo(mobile_no).message
            })
        }
        setTimeout(()=>{
            if (this.state.errMessageArr.length == 0){
                this.setState({ spinnerVisible: true });
                let form = new FormData();
                form.append("user_id", user_id);
                form.append("name", user_name);
                form.append("mobile", mobile_no);
                // form.append("email", email_id.toLowerCase());
                console.warn("FORMMMMMM=====>", form)

                fetch('http://whitetechnologies.co.in/app/userProfileUpdate', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        //"Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: form

                }).then((response) => response.json())
                    .then(async (responseJson) => {
                        console.warn(JSON.stringify(responseJson))
                        if(responseJson.status){
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                            this.props.saveUserDataAction(responseJson.data);
                            //Alert.alert("", responseJson.message);
                        }
                        else{
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                        }
                        // Showing response message coming from server after inserting records.
                    }).catch((error) => {
                        Toast.show(error, Toast.LONG);
                        this.setState({ spinnerVisible: false });
                    });


            }
        },200)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userProfileData !== this.props.userProfileData) {
            if (this.props.userProfileData) {
                let data = this.props.userProfileData;
                console.warn('profile data', data)
                this.setState({
                    user_id: data.user_id,
                    user_name: data.name,
                    // company_name: data1.company_name,
                    email_id: data.email,
                    mobile_no: data.mobile,
                    profile_img: data.profile_img,
                    spinnerVisible:false
                })

            }
        }

    }

    render() {
        const navigation = this.props.navigation;
        console.warn('data aya', this.props.userProfileData)
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Header navigation={navigation} backButtonNavigation={true} transparent={true} button={true} whiteIcon={true} title={'User Profile'} />
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.alignJustify}>

                        <TouchableOpacity onPress={() => this.showActionSheet()} style={styles.ImageViewStyle} >
                            <Image style={styles.imageStyle} resizeMode="cover" source={this.state.profile_img ? { uri: `http://whitetechnologies.co.in/uploads/profile_image/${this.state.profile_img}` } : { uri: 'http://www.interiorgas.com/wp-content/uploads/blank-profile-picture.png' }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headingViewStyle}>
                        <Text style={styles.headingText}>Profile Details</Text>
                    </View>
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>User ID</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="User ID"
                                    value={this.state.user_id}
                                    editable={false}
                                    maxLength={20}
                                    keyboardType={'number-pad'}
                                    onChangeText={(text) => this.onChange(text, "user_id")}
                                    // ref="companyId"
                                    onSubmitEditing={() => this.refs.user_name.focus()}
                                    onFocus={() => this.setState({ user_idErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.user_idErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.user_idErr}</Text>
                    }
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>User Name</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="User Name"
                                    value={this.state.user_name}
                                    editable={true}
                                    maxLength={56}
                                    keyboardType={'default'}
                                    onChangeText={(text) => this.onChange(text, "userName")}
                                    ref="user_name"
                                    onSubmitEditing={() => this.refs.companyName.focus()}
                                    onFocus={() => this.setState({ userNameErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.userNameErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.userNameErr}</Text>
                    }
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Company Name</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Company Name"
                                    value={this.state.company_name}
                                    editable={false}
                                    maxLength={56}
                                    keyboardType={'default'}
                                    onChangeText={(text) => this.onChange(text, "companyName")}
                                    ref="companyName"
                                    onSubmitEditing={() => this.refs.email.focus()}
                                    onFocus={() => this.setState({ company_nameErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.company_nameErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.company_nameErr}</Text>
                    }
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Email ID</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Email"
                                    keyboardType={'email-address'}
                                    value={this.state.email_id}
                                    editable={false}
                                    maxLength={56}
                                    onChangeText={(text) => this.onChange(text.trim(), "email")}
                                    ref="email"
                                    onSubmitEditing={() => this.refs.mobile.focus()}
                                    onFocus={() => this.setState({ emailErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.emailErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.emailErr}</Text>
                    }
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Mobile No</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Mobile No..."
                                    keyboardType={'number-pad'}
                                    value={this.state.mobile_no}
                                    editable={true}
                                    maxLength={13}
                                    onChangeText={(text) => this.onChange(text.trim(), "mobile")}
                                    ref="mobile"
                                    onSubmitEditing={() => this.refs.adminName.focus()}
                                    onFocus={() => this.setState({ mobile_noErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.mobile_noErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.mobile_noErr}</Text>
                    }
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Password</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputPlanViewStyle}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePasswordScreen', { user_id: this.state.user_id, user_type: 2 })}>
                                    <Text style={{ fontSize: fontSizes('smalltitle'), color: '#3B8BCA' }}>Please Reset Password Here..</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => this.update_profile()} style={styles.buttonStyle}>
                            <Text style={styles.buttonText}>
                                Update Profile
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={title}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={(index) => this.handlePress(index)}
                />
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e7e7e7"
    },
    alignJustify: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImageViewStyle: {
        marginTop: hp('3%'),
        height: hp('15%'),
        width: hp('15%'),
        borderRadius: 64,
        borderColor: "#ffffff",
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: hp('4%')
    },
    imageStyle: {
        height: "100%",
        width: "100%",
        borderRadius: 60,
    },
    headingViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ffffff',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        padding: hp('0.7%')
    },
    headingText: {
        fontSize: fontSizes('title'),
        fontWeight: 'bold',
        color: '#4AAEAC'
    },
    inputViewStyle: {
        height: hp('7%'),
        flexDirection: 'row'
    },
    lableViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lableTextStyle: {
        fontSize: fontSizes('smalltitle'),
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
    },
    textInputContainer: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInputViewStyle: {
        width: wp('50%'),
        height: hp('5%'),
        borderRadius: 10,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingLeft: 5
    },
    textInputStyle: {
        fontSize: fontSizes('smalltitle'),
        color: '#111111'
    },
    buttonContainer: {
        marginTop: hp('5%'),
        marginBottom: hp('4%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle: {
        backgroundColor: '#3B8BCA',
        height: hp('6%'),
        borderRadius: 20,
        width: wp('70%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: fontSizes('smalltitle'),
        fontWeight: 'bold',
        color: '#ffffff'
    },
    errorFont: {
        fontSize: fontSizes('smalltitle'),
        color: '#ffffff', 
        textAlign:'center'
    }
});

//make this component available to the app
// export default UserDetails;
export default connect(
    state => ({
        userProfileData: state.saveUserDataReducer.userProfileData,
        CompanyData: state.saveCompanyDataReducer.companyData
    }), { ...saveUserDataAction, ...saveCompanyDataAction }
)(UserDetails);

