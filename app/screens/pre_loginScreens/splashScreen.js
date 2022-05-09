//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import { fontSizes } from '../../utils/responsive';
import BackgroundImage from '../../assets/backgroundImage.jpg';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Toast from 'react-native-simple-toast';
// create a component
class SplashScreen extends Component {

    componentDidMount() {
        // setTimeout(() => {
        //     this.props.navigation.navigate('LoginScreen')
        // }, 2000)
    }

    submitButton = () => {
        this.props.navigation.navigate('LoginScreen');
    }
    render() {
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{ fontSize: fontSizes(30), fontWeight: 'bold', color: "#ffffff" }}>Tally App!</Text>
                </View>

                {/* <ActivityIndicator size={50} color="#003300" />
                <Text style={{ fontSize: fontSizes('title'), color: "#7a7a7a" }}>Loading....</Text> */}
                <View style={styles.buttonView}>
                    <TouchableOpacity onPress={() =>{
                        //Toast.showWithGravity('This is a long toast at the top.', Toast.LONG, Toast.TOP)
                         //Toast.show('This is a long toast.', Toast.LONG);
                         this.submitButton()
                         }} style={styles.buttonBorderView}>
                        <Text style={styles.buttonTextStyle}>Start</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        //backgroundColor: '#2c3e50',
    },
    buttonView: {
        height:hp('30%'),
        marginTop: hp('4%'),
        width: wp('100%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextStyle: {
        fontSize: fontSizes('title'),
        fontWeight: 'bold',
        color: "#ffffff"
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
});

//make this component available to the app
export default SplashScreen;
