//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground, Image } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { fontSizes } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
import Header from '../../components/CommonHeader';
import AsyncStorage from '@react-native-community/async-storage';
import * as saveCompanyDataAction from '../../app_Redux/action/saveCompanyDataAction';
import * as saveUserDataAction from '../../app_Redux/action/saveUserDataAction';
import { connect } from "react-redux";
import BackgroundImage from '../../assets/backgroundImage.jpg';
import logoImage from '../../assets/logo_dummy.png';
import userImageDummy from '../../assets/user_dummy.jpg';
import OtpTextInput from '../../components/otpTextInput';
const iconSize = 60;

// create a component
class DashboardScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OtpVisible: false,
            user_type: '',
            company_profile: '',
            company_name: '',
        }
    }
    async componentDidMount() {
        // http://whitetechnologies.co.in/app/companyProfile
        try {
            const user_type = await AsyncStorage.getItem('user_type');
            const company_id = await AsyncStorage.getItem('company_id');
            const user_id = await AsyncStorage.getItem('user_Id');
            console.warn(user_type)
            if (user_type !== null) {
                if (JSON.parse(user_type) == "User") {
                    this.user_profile(JSON.parse(user_id));
                    // this.company_profile(company_id);
                }

                this.company_profile(company_id);
                this.setState({ user_type: JSON.parse(user_type) });
            }

            let companyData = this.props.CompanyData;
            console.warn('company data', companyData)
            this.setState({
                company_name: companyData.company_name,
                company_profile: companyData.profile_img
            })
        } catch (e) {
        }
    }

    company_profile = (company_id) => {
        let form = new FormData();
        form.append("company_id", JSON.parse(company_id));
        console.warn('from', form)
        fetch('http://whitetechnologies.co.in/app/companyProfile', {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            },
            body: form
        }).then((response) => response.json())
            .then((responseJson) => {
                console.warn('dddd=>', responseJson)
                if (responseJson.status) {
                    this.props.saveCompanyDataAction(responseJson.data[0])
                }
            }).catch((error) => {
                console.warn(error);
            });
    }

    user_profile = (user_id) => {
        let form = new FormData();
        form.append("user_id", JSON.parse(user_id));
        console.warn('from', form)
        fetch('http://whitetechnologies.co.in/app/userProfile', {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            },
            body: form
        }).then((response) => response.json())
            .then((responseJson) => {
                console.warn('user response=>', responseJson)
                if (responseJson.status) {
                    this.props.saveUserDataAction(responseJson.data[0])
                }
            }).catch((error) => {
                console.warn(error);
            });
    }

    OpenCloseOtpVisible = (param) => {
        this.setState({
            OtpVisible: !this.state.OtpVisible
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.CompanyData !== this.props.CompanyData) {
            if (this.props.CompanyData) {
                let data = this.props.CompanyData;
                console.warn('profile data', data)
                this.setState({
                    company_name: data.company_name,
                    company_profile: data.profile_img
                })

            }
        }

    }


    render() {
        const navigation = this.props.navigation;
        console.warn('///-->', this.props.CompanyData)
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <Header navigation={navigation} menuButton={true} transparent={true} button={true} whiteIcon={true} title={'Dashboard'} />
                <OtpTextInput OtpVisible={this.state.OtpVisible} OpenCloseOtpVisible={this.OpenCloseOtpVisible} />
                <View style={styles.container}>
                    <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <View style={{ height: hp('7%'), width: wp('25%') }}>
                            <Image resizeMode={'contain'} style={{ height: '100%', width: '100%' }} source={logoImage} />
                        </View> */}
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('2%') }}>
                            <View style={{ height: 60, width: 60, borderRadius: 30 , borderColor:'#ffffff', borderWidth:1 }}>
                                <Image resizeMode={'contain'} style={{ height: '100%', width: '100%', borderRadius: 80}} source={this.state.company_profile ? { uri: `http://whitetechnologies.co.in/uploads/profile_image/${this.state.company_profile}` } : userImageDummy} />
                            </View>
                            <View style={{ marginTop: wp('2%') }}>
                                <Text numberOfLines={1} style={[styles.textStyle, { color: "#ffffff", fontSize: fontSizes(18), fontWeight: 'bold', textAlign:'center' }]}>{this.state.company_name ? this.state.company_name : 'Company name'}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={styles.bigBoxStyle}>
                        <TouchableOpacity  onPress={() => this.props.navigation.navigate('CompanyDetails')} style={[styles.smallBoxStyle, {}]}>
                            <FontAwesome5 name="user-circle" color={"#E73A5A"} size={fontSizes(iconSize)} solid />
                            <Text style={[styles.textStyle, { color: "#E73A5A" }]}>Company Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('CompanyDocuments')} style={[styles.smallBoxStyle, {}]}>
                            <FontAwesome5 name="file" color={"#4AAEAC"} size={fontSizes(iconSize)} solid />
                            <Text style={[styles.textStyle, { color: '#4AAEAC' }]}>Company Documents</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bigBoxStyle}>
                        {this.state.user_type == 'User' ?
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('UserDetails')} style={[styles.smallBoxStyle, {}]}>
                                <FontAwesome5 name="id-card" color={"#E9BB42"} size={fontSizes(iconSize)} solid />
                                <Text style={[styles.textStyle, { color: '#E9BB42' }]}>Profile</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CompanyUser')} style={[styles.smallBoxStyle, {}]}>
                                <FontAwesome5 name="users" color={"#E9BB42"} size={fontSizes(iconSize)} solid />
                                <Text style={[styles.textStyle, { color: '#E9BB42' }]}>Company User</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={() => Alert.alert("", "Admin Support")} style={[styles.smallBoxStyle, {}]}>
                            <FontAwesome5 name="question-circle" color={"#EF6036"} size={fontSizes(iconSize)} solid />
                            <Text style={[styles.textStyle, { color: '#EF6036' }]}>Admin Support</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.6, zIndex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            // this.OpenCloseOtpVisible();
                            this.props.navigation.navigate('CaptureDocuments')
                        }} style={styles.middleButton}>
                            <FontAwesome5 name="file-upload" color={"#ED3833"} size={fontSizes(30)} solid />
                            <Text style={[styles.textStyle, { color: '#ED3833' }]}>Capture Documents</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        // borderColor:'#3B8BCA50',
        // backgroundColor:'#3B8BCA10',
        // elevation:5,
        // borderWidth:1,
        //margin:10
    },
    bigBoxStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    smallBoxStyle: {
        flex: 1,
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3B8BCA30',
        elevation: 3,
        // borderColor:'#3B8BCA',
        // borderWidth:1,
        borderRadius: 20
    },
    textStyle: {
        color: '#ffffff',
        fontSize: fontSizes('smalltitle'),
        marginTop: hp('1%')
    },
    middleButton: {
        height: wp('20%'),
        width: wp('50%'),
        borderRadius: 20,
        backgroundColor: '#3B8BCA30',
        // borderWidth: 1,
        // borderColor: "#3B8BCA",
        // zIndex: 2,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//make this component available to the app
// export default DashboardScreen;
export default connect(
    state => ({
        CompanyData: state.saveCompanyDataReducer.companyData,
        UserData: state.saveUserDataReducer.userProfileData
    }), { ...saveCompanyDataAction, ...saveUserDataAction }
)(DashboardScreen)
