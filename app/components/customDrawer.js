import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Picker, TextInput, Modal, TouchableHighlight, ImageBackground, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NavigationActions } from 'react-navigation';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { fontSizes } from '../utils/responsive';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as saveCompanyDataAction from '../app_Redux/action/saveCompanyDataAction';
import * as saveUserDataAction from '../app_Redux/action/saveUserDataAction';
import { connect } from "react-redux";
import BackgroundImage from '../assets/backgroundImage.jpg';
import AsyncStorage from '@react-native-community/async-storage';
const iconSize = 26;

class CustomDrawer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userDataimage: '',
            userName: '',
            useremail: '',
            ProfileImage: 'http://www.interiorgas.com/wp-content/uploads/blank-profile-picture.png',
            auth_token: '',
            fcm_token: '',
            user_type: ''
        };
    }

    async componentDidMount() {
        const user_type = await AsyncStorage.getItem('user_type');
        console.warn('user type in drawer', this.props.UserData)
        this.setState({ user_type: JSON.parse(user_type) })
    }

    navigateToScreen = (route) => (
        () => {
            this.props.navigation.closeDrawer();
            const navigateAction = NavigationActions.navigate({
                routeName: route
            });
            this.props.navigation.dispatch(navigateAction);

        })

    logout = async () => {
        try {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.clear();
            this.props.navigation.navigate('stack');
        } catch (e) {
            // remove error
        }

        console.warn('Done.')
    }

    // http://www.interiorgas.com/wp-content/uploads/blank-profile-picture.png

    render() {
        //console.warn("dsjhf", this.props.profileData)
        if (this.props.CompanyData) {
            var name = this.props.CompanyData.company_name;
            var email = this.props.CompanyData.email;
            var profile_image = this.props.CompanyData.profile_img;
        }
        if (this.props.UserData) {
            var Uname = this.props.UserData.name;
            var Uemail = this.props.UserData.email;
            var Uprofile_image = this.props.UserData.profile_img;
        }

        return (
            <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    {this.state.user_type == "Admin" ?
                        <View style={styles.profileImageView}>
                            <View style={styles.imageView}>
                                <View style={styles.imageRoundStyle} >
                                    <Image style={styles.inImageStyle} resizeMode="cover" source={profile_image ? { uri: `http://whitetechnologies.co.in/uploads/profile_image/${profile_image}` } : { uri: this.state.ProfileImage }} />
                                </View>

                            </View>
                            <View style={styles.detailTextView}>
                                <Text style={styles.detailText}>{name}</Text>
                                <Text style={styles.detailText}>{email}</Text>
                            </View>
                        </View>
                        :
                        <View style={styles.profileImageView}>
                            <View style={styles.imageView}>
                                <View style={styles.imageRoundStyle} >
                                    <Image style={styles.inImageStyle} resizeMode="cover" source={Uprofile_image ? { uri: `http://whitetechnologies.co.in/uploads/profile_image/${Uprofile_image}` } : { uri: this.state.ProfileImage }} />
                                </View>

                            </View>
                            <View style={styles.detailTextView}>
                                <Text style={styles.detailText}>{Uname}</Text>
                                <Text style={styles.detailText}>{Uemail}</Text>
                            </View>
                        </View>
                    }

                    <View style={styles.pageListView}>
                        <TouchableOpacity onPress={this.navigateToScreen('CompanyDetails')} style={[styles.listView, { marginTop: hp('2%') }]}>
                            <View style={styles.listIconView}>
                                <FontAwesome5 name="user-circle" color={"#ffffff"} size={fontSizes(iconSize)} solid />
                            </View>
                            <View style={styles.listTextView}>
                                <Text style={styles.listText}>Company Details</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('CompanyDocuments')} style={styles.listView}>
                            <View style={styles.listIconView}>
                                <FontAwesome5 name="images" color={"#ffffff"} size={fontSizes(iconSize)} solid />
                            </View>
                            <View style={styles.listTextView}>
                                <Text style={styles.listText}>Company Documents</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('CaptureDocuments')} style={styles.listView}>
                            <View style={styles.listIconView}>
                                <FontAwesome5 name="camera" color={"#ffffff"} size={fontSizes(iconSize)} solid />
                            </View>
                            <View style={styles.listTextView}>
                                <Text style={styles.listText}>Capture Documents</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.logout} style={styles.listView}>
                            <View style={styles.listIconView}>
                                <FontAwesome5 name="sign-out-alt" color={"#ffffff"} size={fontSizes(iconSize)} solid />
                            </View>
                            <View style={styles.listTextView}>
                                <Text style={styles.listText}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        )
    }
}
// export default CustomDrawer;
export default connect(
    state => ({
        CompanyData: state.saveCompanyDataReducer.companyData,
        UserData: state.saveUserDataReducer.userProfileData
    }), { ...saveCompanyDataAction, ...saveUserDataAction }
)(CustomDrawer)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: "#111111"
    },
    profileImageView: {
        flex: 2,
        justifyContent: 'center'
    },
    imageView: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageRoundStyle: {
        marginTop: 50,
        height: hp('15%'),
        width: hp('15%'),
        borderRadius: 64,
        borderColor: "#cacaca",
        borderWidth: 1,
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
    inImageStyle: {
        height: "100%",
        width: "100%",
        borderRadius: 60,
    },
    detailTextView: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailText: {
        fontSize: fontSizes('title'),
        fontWeight: 'bold',
        color: '#ffffff'
    },
    pageListView: {
        flex: 4,
        //backgroundColor: '#ffffff'
    },
    listView: {
        height: hp('9%'),
        flexDirection: 'row'
    },
    listIconView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listTextView: {
        flex: 5,
        justifyContent: 'center',
        paddingLeft: hp('3%')
    },
    listText: {
        fontSize: fontSizes('title'),
        color: '#ffffff',
        fontWeight: 'bold'
    },
});

