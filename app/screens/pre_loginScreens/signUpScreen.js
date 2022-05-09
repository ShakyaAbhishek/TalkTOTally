//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { fontSizes } from '../../utils/responsive';
import Header from '../../components/CommonHeader';
import BackgroundImage from '../../assets/backgroundImage.jpg';

// create a component
class SignUpScreen extends Component {
    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={BackgroundImage} style={styles.container1}>
                <Header navigation={navigation} backButtonNavigation={true} button={true} whiteIcon={true} transparent={true} />
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <View style={styles.formViewHeader}>
                        <Text style={styles.headerFont}>REGESTRATION </Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CompanySignUp')} style={styles.buttonViewStyle}>
                        <Text style={styles.buttonTextStyle}>COMPANY REGESTRATION</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployeeSignUp')} style={[styles.buttonViewStyle, { marginTop: hp('7%') }]}>
                        <Text style={styles.buttonTextStyle}>EMPLOYEE REGESTRATION</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container1: {
        flex: 1,
    },
    container: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: '#2c3e50',
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
    buttonViewStyle: {
        backgroundColor: '#3B8BCA',
        borderColor: "#3B8BCA",
        borderWidth: 2,
        borderRadius: 20,
        height: hp('6%'),
        width: widthPercentageToDP('80%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTextStyle: {
        fontSize: fontSizes('title'),
        fontWeight: 'bold',
        color: "#ffffff"
    },
});

//make this component available to the app
export default SignUpScreen;
