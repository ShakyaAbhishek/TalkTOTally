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
class CompanyDocuments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            listData1: [],
            valuetext:'',
            spinnerVisible: true
        }
    }




    getDocumentList = async () => {

        const value1 = await AsyncStorage.getItem('user_type');
        var url = JSON.parse(value1) == 'Admin' ? 'http://whitetechnologies.co.in/app/companyDocuments' : 'http://whitetechnologies.co.in/app/userDocuments';
        const user_id = await AsyncStorage.getItem('user_Id');
        const company_id = await AsyncStorage.getItem('company_id');
        let form = new FormData();
        if (JSON.parse(value1) == 'Admin') {
            form.append("company_id", JSON.parse(company_id));
        }
        else {
            form.append("user_id", JSON.parse(user_id));
        }
        console.warn('ddhs', form)
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            },
            body: form
        }).then((response) => response.json())
            .then((responseJson) => {
                console.warn(responseJson)
                if (responseJson.status == true) {
                    Toast.show(responseJson.message, Toast.LONG);
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

    searchItem = (text) => {
        this.setState({
            valuetext: text
        })
        let newData = text != "" ? this.state.listData1.filter(item => {
            let itemData = `${item.document.toUpperCase()}  `;//${item.name.last.toUpperCase()}  ${item.name.toUpperCase()}
            let textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        }) : this.state.listData;
        this.setState({
            listData1: newData,
        })
    }

    _renderListView(item, index) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CompanyDocDetail', { docId: item.document_id, company_id: item.company_id })} style={{ width: wp('90%'), height: hp('8%'), borderBottomColor: "#ffffff", borderBottomWidth: 0, borderRadius: 20, flexDirection: 'row', backgroundColor: '#3B8BCA95', marginVertical: hp('1%'), elevation: 5 }}>
                <View style={styles.SRView}>
                    <Text style={styles.SRNameText}>{index + 1}</Text>
                </View>
                <View style={styles.DNameView}>
                    <Text numberOfLines={1} style={styles.SRNameText}> {item.document}</Text>
                </View>
            </TouchableOpacity>
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
                <Header navigation={navigation} backButtonNavigation={true} transparent={true} button={true} whiteIcon={true} title={'Company Documents'} />
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
                        <View style={styles.SRNameView}>
                            <View style={styles.SRView}>
                                <Text style={styles.SRNameText}>SR No.</Text>
                            </View>
                            <View style={styles.DNameView}>
                                <Text style={styles.SRNameText}>Document Name</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 5, }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>


                            <FlatList
                                data={this.state.listData1}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
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
        flex: 1,
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    DNameView: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    SRNameText: {
        color: '#ffffff',
        fontSize: fontSizes('smalltitle'),
        fontWeight: 'bold'
    },
});

//make this component available to the app
export default CompanyDocuments;
