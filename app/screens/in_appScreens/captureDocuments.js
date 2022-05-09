//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image, Modal, TouchableHighlight, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { fontSizes } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
import Header from '../../components/CommonHeader';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundImage from '../../assets/backgroundImage.jpg';
import { Loader } from '../../components/loaderModal';
import ProgressiveImage from '../../components/prograssiveImage';
import Toast from 'react-native-simple-toast';

// create a component
class CaptureDocuments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            documentPic: '',
            modalVisible: false,
            docType: '',
            indicatior: false,
            spinnerVisible:false
        }
    }

    setModalVisible(visible) {
        console.warn(visible)
        this.setState({ modalVisible: visible });
    }

    openCamera = () => {
        ImagePicker.openCamera({
            // width: 300,
            // height: 300,
            compressImageQuality: 0.3,
            cropping: true,
            includeBase64: true,
            multiple: false,
            // cropperCircleOverlay: true,
        }).then(image => {
            console.warn('---------->profile', image)
            this.setState({
                documentPic: image,
                indicatior: true
            })
        }).catch((err) => {
            console.warn(err)
        });
    }
    openGallary = () => {
        ImagePicker.openPicker({
            // width: 300,
            // height: 300,
            compressImageQuality: 0.3,
            cropping: true,
            includeBase64: true,
            multiple: false,
            // cropperCircleOverlay: true,
        }).then(image => {
            console.warn('---------->', image)
            console.log('---------->profile', image)
            this.setState({
                documentPic: image,
                indicatior:true
            })
        }).catch((err) => {
            alert(err.message);
        });
    }

    uploadImage = async (docType) => {
        this.setState({spinnerVisible:true})
        if (this.state.documentPic) {

            const value1 = await AsyncStorage.getItem('user_type');
            console.warn(value1)
            var url = JSON.parse(value1) == 'Admin' ? 'http://whitetechnologies.co.in/app/uploadCompanyDocument' : 'http://whitetechnologies.co.in/app/uploadUserDocument';
            const user_id = await AsyncStorage.getItem('user_Id');
            const company_id = await AsyncStorage.getItem('company_id');
            let company = JSON.parse(company_id);
            let user = JSON.parse(user_id);
            // const value = await AsyncStorage.getItem('email_Id')
            console.warn('email', user_id)
            let form = new FormData();
            if (JSON.parse(value1) == "Admin") {
                form.append("company_id", JSON.parse(company));
            }
            if (JSON.parse(value1) == "User") {
                form.append("user_id", JSON.parse(user));
            }

            form.append("ledger", docType);
            form.append("document", this.state.documentPic.data);
            console.warn("FORMMMMMM=====>", form)

            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    //"Content-Type": "application/x-www-form-urlencoded"
                },
                body: form

            }).then((response) => response.json())
                .then((responseJson) => {
                    this.setState({spinnerVisible:false, modalVisible:false});
                    console.warn(JSON.stringify(responseJson))
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false, documentPic: '', modalVisible: false });
                    // Alert.alert("", responseJson.message, [
                    //     {
                    //         text: 'OK', onPress: () => {
                    //             this.setState({ spinnerVisible: false, documentPic: '', modalVisible: false });
                    //             // this.props.navigation.navigate('mainRoute')
                    //         }
                    //     },
                    // ],
                    //     { cancelable: false });

                    // Showing response message coming from server after inserting records.
                    // if (responseJson.status) {
                    //     AsyncStorage.setItem("auth_token", JSON.stringify(responseJson.status))
                    //     Alert.alert("", responseJson.message, [
                    //         {
                    //             text: 'OK', onPress: () => {
                    //                 this.setState({ spinnerVisible: false });
                    //                 this.props.navigation.navigate('mainRoute')
                    //             }
                    //         },
                    //     ],
                    //         { cancelable: false });
                    // }
                    // else {
                    //     this.setState({ spinnerVisible: false })
                    //     Alert.alert("", responseJson.message, [
                    //         { text: 'OK', },
                    //     ],
                    //         { cancelable: false });
                    // }
                }).catch((error) => {
                    this.setState({spinnerVisible:false, modalVisible:false});
                    Toast.show(error, Toast.LONG);
                });

        }
        else {
            this.setState({spinnerVisible:false, modalVisible:false});
           // Alert.alert('', 'please select the document')
           Toast.show('please select the document', Toast.LONG);
        }
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <Header navigation={navigation} transparent={true} backButtonNavigation={true} button={true} whiteIcon={true} title={'Capture Documents'} />
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false)
                    }}>
                    {/* <TouchableWithoutFeedback style={{zIndex:-1}} onFocus={() => this.setState({ modalVisible: false })}> */}
                    <View style={{ flex: 1, backgroundColor: '#ffffff20', justifyContent: 'center', alignItems: 'center', zIndex: -1, borderRadius:10 }} imageStyle={{borderRadius:10}}>
                        <ImageBackground source={BackgroundImage} style={{ height: hp('40%'), width: wp('90%'), backgroundColor: '#ffffff', borderRadius: 10, elevation: 10, zIndex: 1, padding: hp('5%'), alignItems: 'center' }}>
                            <Text style={{
                                fontSize: fontSizes(20),
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color:'#ffffff'
                            }} > Select Any One Option 'Sales' or 'Purchase'</Text>
                            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.uploadImage('Sales')} style={{ width: wp('70%'), padding: '2%', borderRadius: 10, borderColor: '#ffffff', borderWidth: 1 }}>
                                    <Text style={{
                                        fontSize: fontSizes(20),
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        color:'#ffffff'
                                    }} >Sales</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.uploadImage('Purchase')} style={{ width: wp('70%'), padding: '2%', borderRadius: 10, borderColor: '#ffffff', borderWidth: 1 }}>
                                    <Text style={{
                                        fontSize: fontSizes(20),
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        color:'#ffffff'
                                    }} >Purchase</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setModalVisible(false)} style={{ width: wp('70%'), padding: '2%', borderRadius: 10, borderColor: '#ffffff', borderWidth: 1 }}>
                                    <Text style={{
                                        fontSize: fontSizes(20),
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        color:'#ffffff'
                                    }} >Cancel</Text>
                                </TouchableOpacity>
                            </View>


                        </ImageBackground>
                    </View>
                    {/* </TouchableWithoutFeedback> */}
                </Modal>

                <View style={styles.imageContainer}>
                    <Image resizeMode={'contain'} style={[styles.imageStyle, { tintColor: !this.state.documentPic ? "#ffffff" : null }]} source={!this.state.documentPic ? { uri: "https://img.icons8.com/carbon-copy/2x/camera.png" } : { uri: `${this.state.documentPic.path}` }} />
                    {/* <ProgressiveImage
                        indicatorSize='small'
                        indicatorColor='green'
                        // thumbnailSource={`${this.state.documentPic.path}`}
                        source={`${this.state.documentPic.path}`}
                        style={{ width: wp('80%'), height: hp('30%') }}
                        resizeMode="stretch"
                    /> */}
                    <Text style={styles.imageButtomText}>'Please Take An Image From Camera Or Media'</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.openCamera()} style={[styles.buttonViewStyle, { backgroundColor: '#E73A5A', }]}>
                        <Text style={styles.buttonText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.openGallary()} style={[styles.buttonViewStyle, { backgroundColor: '#4AAEAC', }]}>
                        <Text style={styles.buttonText}>Media</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setModalVisible(true)} style={[styles.buttonViewStyle, { backgroundColor: '#EF6036', }]}>
                        <Text style={styles.buttonText}>Upload</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        height: '50%',
        width: '70%',

    },
    imageButtomText: {
        color: '#ffffff',
        fontSize: fontSizes('title'),
        fontWeight: 'bold'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    buttonViewStyle: {
        height: hp('7%'),
        width: wp('30%'),
        borderRadius: 10,
        backgroundColor: '#E73A5A',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: fontSizes('smalltitle'),
        fontWeight: 'bold',
        color: '#ffffff'
    },
});

//make this component available to the app
export default CaptureDocuments;

// https://img.icons8.com/carbon-copy/2x/camera.png