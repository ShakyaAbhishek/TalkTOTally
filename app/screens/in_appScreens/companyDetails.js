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
import * as saveCompanyDataAction from '../../app_Redux/action/saveCompanyDataAction';
import { connect } from "react-redux";
import BackgroundImage from '../../assets/backgroundImage.jpg';
import { validateEmail, validatePassword, validatePhoneNo } from '../../services/validation';
import Toast from 'react-native-simple-toast';
import { Loader } from '../../components/loaderModal';
// import { TextInput } from 'react-native-gesture-handler';


const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = ['Cancel', 'Camera', 'Gallery']
const title = 'Open Image from'

// create a component
class CompanyDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ProfileImage: '',
            profile_img: '',
            showPlan: false,
            companyName: '',
            companyNameErr: '',
            companyId: '',
            CompanyIdErr: '',
            email: '',
            emailErr: '',
            adminName: '',
            adminNameErr: '',
            adminSurname: '',
            adminSurnameErr: '',
            adminMiddleName: '',
            adminMiddleNameErr: '',
            tallyLicenceNo: '',
            tallyLicenceNoErr: '',
            editable: false,
            userType: '',
            company_id: '',
            errMessageArr: [],
            spinnerVisible: true,
            plan_id: '',
            plan_title: '',
            tag_line: '',
            charges_per_year: '',
            document_per_month: '',
            speciality: '',
            plan_date: '',
            plan_start_date: '',
            plan_end_date: '',
            days_left: '',
        }
    }

    async componentDidMount() {
        const value1 = await AsyncStorage.getItem('user_type');
        const company_id = await AsyncStorage.getItem('company_id');
        console.warn('value1', value1)
        if (value1 !== null) {
            if (JSON.parse(value1) == "Admin") {
                this.setState({
                    editable: true,
                    userType: JSON.parse(value1),
                    company_id: company_id
                });
            }
            else {
                this.setState({
                    editable: false,
                    userType: JSON.parse(value1)
                });
            }
        }
        let data = this.props.CompanyData;
        console.warn('profile data', data)
        this.setState({
            companyName: data.company_name,
            companyId: data.company_id,
            email: data.email,
            adminName: data.admin_name,
            adminSurname: data.surname,
            adminMiddleName: '',
            tallyLicenceNo: data.telly_licence_no,
            profile_img: data.profile_img,
            password: data.password
        }, () => {
            this.setState({ spinnerVisible: false });
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
        if (type == "adminName") {
            if (!pattern.test(text)) {
                this.setState({
                    adminName: text,
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
        if (type == "tallyLicenceNo") {
            if (!pattern.test(text)) {
                this.setState({
                    tallyLicenceNo: text.replace(/[^0-9]/g, ''),
                    errMessageArr: []
                });
            }
        }
        if (type == "companyId") {
            this.setState({
                companyId: text.replace(/[^0-9]/g, ''),
                errMessageArr: []
            });
        }
    }
    //.replace(/[^A-Za-z ]/g, ''),

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
                console.warn(err)
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
                // alert(err.message);
            });
        }
    }

    imageUpload = () => {
        // http://whitetechnologies.co.in/app/uploadCompanyProfileImg

        let form = new FormData();
        this.setState({ spinnerVisible: true });
        form.append("company_id", JSON.parse(this.state.company_id));

        form.append('image', this.state.ProfileImage.data)

        //form.append("company_id", company_id);
        console.warn("form data", form)
        fetch("http://whitetechnologies.co.in/app/uploadCompanyProfileImg", {
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
                    console.warn("documnebt detail", responseJson);
                    this.props.saveCompanyDataAction(responseJson.data);
                    Toast.show("Image Update.", Toast.LONG);
                    this.setState({ spinnerVisible: false });
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

    updateCompanyProfile = () => {
        let { companyId, companyName, tallyLicenceNo, adminName, adminSurname, email, errMessageArr } = this.state;
        errMessageArr = [];
        if (companyId == '' || companyId === null || companyId === undefined) {
            this.setState({
                CompanyIdErr: "*Please enter company id ",
                errMessageArr: errMessageArr.push("*Please enter company id ")
            })
        }
        if (companyName == '' || companyName === null || companyName === undefined) {
            this.setState({
                companyNameErr: "*Please enter company name ",
                errMessageArr: errMessageArr.push("*Please enter company name ")
            })
        }
        if (tallyLicenceNo == '' || tallyLicenceNo === null || tallyLicenceNo === undefined) {
            this.setState({
                tallyLicenceNoErr: "*Please enter tally licence no ",
                errMessageArr: errMessageArr.push("*Please enter tally licence no ")
            })
        }
        if (adminName == '' || adminName === null || adminName === undefined) {
            this.setState({
                adminNameErr: "*Please enter admin name ",
                errMessageArr: errMessageArr.push("*Please enter admin name ")
            })
        }
        if (adminSurname == '' || adminSurname === null || adminSurname === undefined) {
            this.setState({
                adminSurnameErr: "*Please enter admin surname ",
                errMessageArr: errMessageArr.push("*Please enter admin surname ")
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
                this.setState({ spinnerVisible: true });
                let form = new FormData();
                form.append('company_id', companyId);
                form.append('company_name', companyName);
                form.append('telly_licence_no', tallyLicenceNo);
                form.append('admin_name', adminName);
                form.append('surname', adminSurname);
                // form.append('password', this.state.password);
                // form.append('mobile', this.state.mobile);
                form.append('email', this.state.email);
                console.warn('form data', form);

                fetch('http://whitetechnologies.co.in/app/companyProfileUpdate', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        //"Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: form

                }).then((response) => response.json())
                    .then(async (responseJson) => {
                        console.warn(JSON.stringify(responseJson))
                        if (responseJson.status) {
                            this.props.saveCompanyDataAction(responseJson.data);
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                        }
                        else {
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                        }
                        // Showing response message coming from server after inserting records.
                    }).catch((error) => {
                        Toast.show(error, Toast.LONG);
                        this.setState({ spinnerVisible: false });
                    });
            }
        }, 200)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.CompanyData !== this.props.CompanyData) {
            if (this.props.CompanyData) {
                let data = this.props.CompanyData;
                console.warn('profile data', data)
                this.setState({
                    companyName: data.company_name,
                    companyId: data.company_id,
                    email: data.email,
                    adminName: data.admin_name,
                    adminSurname: data.surname,
                    adminMiddleName: '',
                    tallyLicenceNo: data.telly_licence_no,
                    profile_img: data.profile_img
                })

            }
        }

    }

    showPlanUser = () => {
        this.setState({ showPlan: !this.state.showPlan }, () => {
            if (this.state.showPlan) {
                let form = new FormData();
                form.append('company_id', this.state.companyId);

                console.warn('form data', form);

                fetch('http://whitetechnologies.co.in/app/getComapanyPlan', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        //"Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: form

                }).then((response) => response.json())
                    .then(async (responseJson) => {
                        console.warn(JSON.stringify(responseJson))
                        if (responseJson.status) {
                            this.setState({
                                spinnerVisible: false,
                                plan_id: responseJson.data.plan_id,
                                plan_title: responseJson.data.plan_title,
                                tag_line: responseJson.data.tag_line,
                                charges_per_year: responseJson.data.charges_per_year,
                                document_per_month: responseJson.data.document_per_month,
                                speciality: responseJson.data.speciality,
                                plan_date: responseJson.data.plan_date,
                                plan_start_date: responseJson.data.plan_start_date,
                                plan_end_date: responseJson.data.plan_end_date,
                                days_left: responseJson.data.days_left,
                            });
                        }
                        else {
                            Toast.show(responseJson.message, Toast.LONG);
                            this.setState({ spinnerVisible: false });
                        }
                        // Showing response message coming from server after inserting records.
                    }).catch((error) => {
                        Toast.show(error, Toast.LONG);
                        this.setState({ spinnerVisible: false });
                    });
            }
        });
    }

    render() {
        const navigation = this.props.navigation;
        // console.warn(',.,.,.==>', this.state.editable)
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Header navigation={navigation} backButtonNavigation={true} transparent={true} button={true} whiteIcon={true} title={'Company Details'} />
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.alignJustify}>
                        {
                            this.state.userType == 'Admin' ?
                                <TouchableOpacity onPress={() => this.showActionSheet()} style={styles.ImageViewStyle} >
                                    <Image style={styles.imageStyle} resizeMode="cover" source={this.state.profile_img ? { uri: `http://whitetechnologies.co.in/uploads/profile_image/${this.state.profile_img}` } : { uri: 'http://www.interiorgas.com/wp-content/uploads/blank-profile-picture.png' }} />
                                </TouchableOpacity> :
                                <View style={styles.ImageViewStyle} >
                                    <Image style={styles.imageStyle} resizeMode="cover" source={this.state.profile_img ? { uri: `http://whitetechnologies.co.in/uploads/profile_image/${this.state.profile_img}` } : { uri: 'http://www.interiorgas.com/wp-content/uploads/blank-profile-picture.png' }} />
                                </View>
                        }

                    </View>
                    <View style={styles.headingViewStyle}>
                        <Text style={styles.headingText}>Profile Details</Text>
                    </View>
                    {/* ========= */}
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Company Name</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Company Name"
                                    value={this.state.companyName}
                                    editable={this.state.editable}
                                    maxLength={56}
                                    keyboardType={'default'}
                                    onChangeText={(text) => this.onChange(text, "companyName")}
                                    //ref="email"
                                    onSubmitEditing={() => this.refs.companyId.focus()}
                                    onFocus={() => this.setState({ companyNameErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.companyNameErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.companyNameErr}</Text>
                    }
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Company ID</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Company ID"
                                    value={this.state.companyId}
                                    editable={false}
                                    maxLength={20}
                                    keyboardType={'number-pad'}
                                    onChangeText={(text) => this.onChange(text, "CompanyId")}
                                    ref="companyId"
                                    onSubmitEditing={() => this.refs.email.focus()}
                                    onFocus={() => this.setState({ CompanyIdErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.CompanyIdErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.CompanyIdErr}</Text>
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
                                    value={this.state.email}
                                    editable={false}
                                    maxLength={56}
                                    onChangeText={(text) => this.onChange(text.trim(), "email")}
                                    ref="email"
                                    onSubmitEditing={() => this.refs.adminName.focus()}
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
                            <Text style={styles.lableTextStyle}>Admin Name</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Admin Name"
                                    keyboardType={'default'}
                                    value={this.state.adminName}
                                    editable={this.state.editable}
                                    maxLength={56}
                                    onChangeText={(text) => this.onChange(text.trim(), "adminName")}
                                    ref="adminName"
                                    onSubmitEditing={() => this.refs.adminSurname.focus()}
                                    onFocus={() => this.setState({ adminNameErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.adminNameErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.adminNameErr}</Text>
                    }
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Admin Surname</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Admin Surname"
                                    keyboardType={'default'}
                                    value={this.state.adminSurname}
                                    editable={this.state.editable}
                                    maxLength={56}
                                    onChangeText={(text) => this.onChange(text.trim(), "adminSurname")}
                                    ref="adminSurname"
                                    onSubmitEditing={() => this.refs.adminMiddleName.focus()}
                                    onFocus={() => this.setState({ adminSurnameErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.adminSurnameErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.adminSurnameErr}</Text>
                    }
                    {/* <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Admin Middle Name</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Admin Middle Name"
                                    keyboardType={'default'}
                                    value={this.state.adminMiddleName}
                                    editable={this.state.editable}
                                    maxLength={56}
                                    onChangeText={(text) => this.onChange(text.trim(), "adminMiddleName")}
                                    ref="adminMiddleName"
                                    onSubmitEditing={() => this.refs.tallyLicenceNo.focus()}
                                    onFocus={() => this.setState({ adminMiddleNameErr: '' })}
                                />
                            </View>
                        </View>
                    </View> */}
                    <View style={styles.inputViewStyle}>
                        <View style={styles.lableViewStyle}>
                            <Text style={styles.lableTextStyle}>Tally License No.</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                            <View style={styles.textInputViewStyle}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    placeholder="Tally License No."
                                    keyboardType={'number-pad'}
                                    value={this.state.tallyLicenceNo}
                                    editable={this.state.editable}
                                    maxLength={56}
                                    onChangeText={(text) => this.onChange(text.trim(), "tallyLicenceNo")}
                                    ref="tallyLicenceNo"
                                    onSubmitEditing={() => this.refs.tallyLicenceNo.focus()}
                                    onFocus={() => this.setState({ tallyLicenceNoErr: '' })}
                                />
                            </View>
                        </View>
                    </View>
                    {
                        this.state.tallyLicenceNoErr == '' ? null :
                            <Text style={styles.errorFont} >{this.state.tallyLicenceNoErr}</Text>
                    }
                    {
                        this.state.userType == 'Admin' ?
                            <View>
                                <View style={styles.inputViewStyle}>
                                    <View style={styles.lableViewStyle}>
                                        <Text style={styles.lableTextStyle}>Password</Text>
                                    </View>
                                    <View style={styles.textInputContainer}>
                                        <View style={styles.textInputPlanViewStyle}>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePasswordScreen', { user_id: this.state.companyId, user_type: 1 })}>
                                                <Text style={{ fontSize: fontSizes('smalltitle'), color: '#3B8BCA' }}>Please Reset Password Here..</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                {/* ============= */}

                                <View style={styles.headingViewStyle}>
                                    <TouchableOpacity onPress={() => this.showPlanUser()}>
                                        <Text style={styles.headingText}>See Active Plan Details..</Text>
                                    </TouchableOpacity>

                                </View>

                                {
                                    this.state.showPlan ?
                                        <View>
                                            <View style={styles.inputViewStyle}>
                                                <View style={styles.lableViewStyle}>
                                                    <Text style={styles.lableTextStyle}>Plan Name</Text>
                                                </View>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputPlanViewStyle}>
                                                        <Text style={styles.textInputStylePlan}>{this.state.plan_title}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.inputViewStyle}>
                                                <View style={styles.lableViewStyle}>
                                                    <Text style={styles.lableTextStyle}>Plan Duration</Text>
                                                </View>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputPlanViewStyle}>
                                                        <Text style={styles.textInputStylePlan}>1 Year</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.inputViewStyle}>
                                                <View style={styles.lableViewStyle}>
                                                    <Text style={styles.lableTextStyle}>Plan Amount</Text>
                                                </View>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputPlanViewStyle}>
                                                        <Text style={styles.textInputStylePlan}>{this.state.charges_per_year}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.inputViewStyle}>
                                                <View style={styles.lableViewStyle}>
                                                    <Text style={styles.lableTextStyle}>Plan Charge</Text>
                                                </View>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputPlanViewStyle}>
                                                        <Text style={styles.textInputStylePlan}>{this.state.charges_per_year== '0'?"Free":'Paid'}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.inputViewStyle}>
                                                <View style={styles.lableViewStyle}>
                                                    <Text style={styles.lableTextStyle}>Plan Start Date</Text>
                                                </View>
                                                <View style={styles.textInputContainer}>
                                                    <View style={styles.textInputPlanViewStyle}>
                                                        <Text style={styles.textInputStylePlan}>{this.state.plan_start_date}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.headingViewStyle}>
                                                <View >
                                                    <Text style={[styles.headingText, { color: '#3B8BCA', textAlign: 'center' }]}>Your trial plan is endng on {this.state.plan_end_date}</Text>
                                                    <Text style={[styles.headingText, { color: '#3B8BCA', textAlign: 'center' }]}>{this.state.days_left} Day Left</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('OfferPlanScreen')} style={styles.buttonStyleR}>
                                                    <Text style={styles.buttonText}>Renew Plan</Text>
                                                </TouchableOpacity>

                                            </View>
                                        </View> : null
                                }

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => this.updateCompanyProfile()} style={styles.buttonStyle}>
                                        <Text style={styles.buttonText}>
                                            Update Profile
                            </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
                    }

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
    textInputPlanViewStyle: {
        width: wp('50%'),
        height: hp('5%'),
        borderRadius: 10,
        //backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingLeft: 5
    },
    textInputStyle: {
        fontSize: fontSizes('smalltitle'),
        color: '#111111'
    },
    textInputStylePlan: {
        fontSize: fontSizes('smalltitle'),
        color: '#3B8BCA'
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
    buttonStyleR: {
        backgroundColor: '#ED4258',
        height: hp('5%'),
        borderRadius: 20,
        width: wp('50%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5
    },
    buttonText: {
        fontSize: fontSizes('smalltitle'),
        fontWeight: 'bold',
        color: '#ffffff'
    },
    errorFont: {
        fontSize: fontSizes('smalltitle'),
        color: '#ffffff',
        textAlign: 'center'
    }
});

//make this component available to the app
// export default CompanyDetails;
export default connect(
    state => ({
        CompanyData: state.saveCompanyDataReducer.companyData
    }), { ...saveCompanyDataAction }
)(CompanyDetails)