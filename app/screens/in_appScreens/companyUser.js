//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Image, FlatList, TextInput, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { fontSizes } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/CommonHeader';
import { NavigationEvents } from 'react-navigation';
import { Loader } from '../../components/loaderModal';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundImage from '../../assets/backgroundImage.jpg';
import Toast from 'react-native-simple-toast';

// create a component
class CompanyUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            listData1: [],
            valuetext: '',
            spinnerVisible: true
        }
    }




    getDocumentList = async () => {

        const value1 = await AsyncStorage.getItem('user_type');
        var url = JSON.parse(value1) == 'Admin' ? 'http://whitetechnologies.co.in/app/companyUsers' : 'http://whitetechnologies.co.in/app/companyUsers';
        //const user_id = await AsyncStorage.getItem('email_Id');
        const company_id = await AsyncStorage.getItem('company_id');
        let form = new FormData();
        if (JSON.parse(value1) == 'Admin') {
            form.append("company_id", JSON.parse(company_id))
            // form.append("company_id",JSON.parse(company_id));
        }
        else {
            form.append("company_id", JSON.parse(company_id));
        }
        console.warn("fhdskds", form)
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            },
            body: form
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {
                    console.warn("documnebt", responseJson);
                    //Toast.showWithGravity(responseJson.message, Toast.LONG, Toast.TOP);
                    this.setState({ listData: responseJson.data, listData1: responseJson.data, spinnerVisible: false })
                }
                else {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                }
            }).catch((error) => {
                Toast.show(error, Toast.LONG);
                this.setState({ spinnerVisible: false });
            });
    }

    user_delete = (user_id) => {
        this.setState({ spinnerVisible: true })
        let form = new FormData();
        form.append("user_id", user_id);
        fetch('http://whitetechnologies.co.in/app/deleteCompanyUser', {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            },
            body: form
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status) {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.getDocumentList();
                    this.setState({ spinnerVisible: false });
                    // Alert.alert("", responseJson.message, [
                    //     {
                    //         text: 'OK', onPress: () => {
                    //             this.getDocumentList();
                    //             this.setState({ spinnerVisible: false });

                    //         }
                    //     },
                    // ],
                    //     { cancelable: false });
                    console.warn("delete response", responseJson);
                    // this.setState({ spinnerVisible: false })
                    // this.setState({ listData: responseJson.data, spinnerVisible: false })
                }
                else {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                }
            }).catch((error) => {
                Toast.show(error, Toast.LONG);
                this.setState({ spinnerVisible: false });
            });
    }

    searchItem = (text) => {
        this.setState({
            valuetext: text
        })
        let newData = text != "" ? this.state.listData1.filter(item => {
            let itemData = `${item.email.toUpperCase()} ${item.name.toUpperCase()} `;//${item.name.last.toUpperCase()}
            let textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        }) : this.state.listData;
        this.setState({
            listData1: newData,
        })
    }

    _renderListView(item, index) {
        return (
            <View onPress={() => { }} style={{ width: wp('90%'), padding: wp('3%'), borderRadius: 15, borderBottomColor: "#ffffff", borderBottomWidth: 0, backgroundColor: '#3B8BCA55', marginVertical: hp('1%'), elevation: 5 }}>
                {/* <View style={styles.SRView}>
                    <Text style={styles.SRNameText}>{index + 1}</Text>
                </View> */}
                {/* <View style={styles.DNameView}>
                    <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
                        <Text style={styles.SRNameText}>Employee Id -</Text>
                    </View>
                    <View style={{ flex: 1 , justifyContent:'center', alignItems:'flex-start'}}>
                        <Text style={styles.SRNameText}>{item.user_id}</Text>
                    </View>
                </View> */}
                <View style={styles.DNameView}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Text numberOfLines={1} style={styles.SRNameText}>Employee Name -</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text numberOfLines={1} style={styles.SRNameText}> {item.name}</Text>
                    </View>
                </View>
                <View style={styles.DNameView}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Text numberOfLines={1} style={styles.SRNameText}>Employee Mobile -</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text numberOfLines={1} style={styles.SRNameText}> {item.mobile}</Text>
                    </View>
                </View>
                <View style={styles.DNameView}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Text numberOfLines={1} style={styles.SRNameText}>Employee Email -</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text numberOfLines={1} style={styles.SRNameText}> {item.email}</Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('1.5%') }}>
                    <TouchableOpacity onPress={() => this.user_delete(item.user_id)} style={{ padding: 5, backgroundColor: '#ED4258' }}>
                        <Text style={styles.SRNameText}>DELETE USER</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <NavigationEvents
                    onWillFocus={
                        this.getDocumentList
                    }
                />
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Header navigation={navigation} backButtonNavigation={true} transparent={true} button={true} whiteIcon={true} title={'Company Employees'} />
                <View style={{ flex: 1 }}>
                    <View style={styles.searchBarView}>
                        <View style={styles.searchBarStyle}>
                            <View style={{ flex: 4, borderRadius: 10 }}>
                                <TextInput
                                    style={{ flex: 1, fontSize: fontSizes('title') }}
                                    placeholder="Searc here...."
                                    onChangeText={text => { this.searchItem(text) }}
                                    keyboardType={'default'}
                                />
                            </View>
                            <View style={styles.searchBarIconView}>
                                <FontAwesome5 name="info-circle" color={"#111111"} size={fontSizes(20)} solid />
                                <FontAwesome5 name="search" color={"#111111"} size={fontSizes(24)} solid />
                            </View>
                        </View>
                        {/* <View style={styles.SRNameView}>
                            <View style={styles.SRView}>
                                <Text style={styles.SRNameText}>SR No.</Text>
                            </View>
                            <View style={styles.SRView}>
                                <Text style={styles.SRNameText}>User Id</Text>
                            </View>
                            <View style={styles.DNameView}>
                                <Text style={styles.SRNameText}>User Name</Text>
                            </View>
                        </View> */}
                    </View>
                    <View style={{ flex: 6 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <FlatList
                                data={this.state.listData1}
                                showsVerticalScrollIndicator={false}
                                extraData={this.state}
                                renderItem={({ item, index }) => this._renderListView(item, index)}
                            />
                        </View>
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
    },
    searchBarView: {
        // flex: 1,
        // backgroundColor: '#111111',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    searchBarStyle: {
        width: wp('96%'),
        height: hp('6.5%'),
        backgroundColor: '#ffffff',
        borderRadius: 10,
        flexDirection: 'row'
    },
    searchBarIconView: {
        flex: 1.2,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    SRNameView: {
        width: wp('96%'),
        height: hp('6.5%'),
        flexDirection: 'row'
    },
    SRView: {
        flex: 1.0,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    DNameView: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    SRNameText: {
        color: '#ffffff',
        fontSize: fontSizes('smalltitle'),
        fontWeight: 'bold',
        textAlign: 'left'
    },
});


//make this component available to the app
export default CompanyUser;
