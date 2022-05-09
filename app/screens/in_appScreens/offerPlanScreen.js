//import liraries
//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, FlatList, ImageBackground } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { fontSizes } from '../../utils/responsive';
import Header from '../../components/CommonHeader';
import { Loader } from '../../components/loaderModal';
import BackgroundImage from '../../assets/backgroundImage.jpg';

// create a component
class OfferPlanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offerList: [],
            spinnerVisible: true
        }
    }

    componentDidMount() {
        let form = new FormData();
        fetch('http://whitetechnologies.co.in/app/getPlans', {
            method: 'GET',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            }
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {
                    this.setState({ offerList: responseJson.data, spinnerVisible: false })
                }
                else {
                    this.setState({ spinnerVisible: false })
                    Alert.alert('',responseJson.message)
                }
            }).catch((error) => {
                console.warn(error);
            });
    }

    listViewFun(item, index) {
        return (
            <View key={index} style={styles.incontainer}>
                <View style={styles.offerDis}>
                    <Text style={styles.offerHeading}>{item.plan_title}</Text>
                    <Text style={styles.btnsuboffertext}>{item.tag_line}</Text>
                    <View>
                        <Text style={styles.offerDetailstxt}>Up to {item.document_per_month} document in a month</Text>
                        <Text style={styles.offerDetailstxt}>Rs {item.charges_per_year} Annually</Text>
                        <Text style={styles.offerDetailstxt}>{item.speciality}</Text>
                        <Text style={styles.offerDetailstxt}>Happy Customer</Text>
                    </View>
                    <View style={styles.offerPriceView}>
                        <Text style={[styles.offerSmlText, { marginBottom: hp('2%') }]}>Rs. </Text>
                        <Text style={styles.priceText}>{item.charges_per_year}</Text>
                        <Text style={[styles.offerSmlText, { marginTop: hp('1%') }]}>/years</Text>
                    </View>
                </View>
                <View style={styles.btnView}>
                    <TouchableOpacity style={styles.btncontainer}>
                        <Text style={styles.btnsuboffertext}>Buy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Header navigation={navigation} backButtonNavigation={true} transparent={true} button={true} whiteIcon={true} title={'Plans Details'} />
                <FlatList
                    // style={{ flex: 1 }}
                    data={this.state.offerList}
                    extraData={this.state}
                    renderItem={({ item, index }) => {
                        return this.listViewFun(item, index)
                    }}
                    keyExtractor={(item, index) => item.plan_id}
                />
            </ImageBackground>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    incontainer: {
        // flex:1,
        borderColor: '#e5e4e250',
        borderWidth: 2,
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('1%'),
        elevation: 5,
        marginHorizontal: wp('2#'),
        borderRadius: 10,
        marginVertical: hp('1%')
        // backgroundColor:'#e5e4e250'
    },
    offerDis: {
        // paddingVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
        justifyContent: 'center',
        // alignItems:'center',
        // borderColor: 'green',
        // borderWidth: 2,
    },
    offerHeading: {
        fontSize: fontSizes(22),
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    btnsuboffertext: {
        fontSize: fontSizes(14),
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    offerDetailstxt: {
        fontSize: fontSizes(12),
        color: '#ffffff'
    },
    offerPriceView: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
    offerSmlText: {
        fontSize: fontSizes(12),
        color: '#ffffff',
        fontWeight: 'bold',
    },
    priceText: {
        fontSize: fontSizes(28),
        color: '#ffffff',
        fontWeight: 'bold'
    },
    btnView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    btncontainer: {
        backgroundColor: '#58BE4F',
        paddingHorizontal: wp('10%'),
        paddingVertical: hp('1%'),
        borderRadius: 20
    },
});

//make this component available to the app
export default OfferPlanScreen;

