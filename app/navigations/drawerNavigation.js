import React, { Component } from 'react';
import { View, Text, TouchableNativeFeedback, SafeAreaView, ScrollView,Dimensions } from 'react-native';
import {createAppContainer, DrawerItems} from 'react-navigation';
import{createDrawerNavigator} from 'react-navigation-drawer'
const{width, height} = Dimensions.get('window');

// screen imports
import CustomDrawer from '../components/customDrawer';
import DashboardScreen from '../screens/in_appScreens/dashboardScreen';
import CaptureDocuments from '../screens/in_appScreens/captureDocuments';
import CompanyDetails from '../screens/in_appScreens/companyDetails';
import CompanyDocuments from '../screens/in_appScreens/companyDocuments';
const AppDrawer = createDrawerNavigator({
    DashboardScreen :{
        screen: DashboardScreen,
        navigationOption:{
            drawerLable:"Dashboard"
        }
    },
    CaptureDocuments:{
        screen:CaptureDocuments,
        navigationOptions:{
            drawerLabel:"Capture Documents"
        }
    },
    CompanyDetails:{
        screen:CompanyDetails,
        navigationOptions:{
            drawerLabel:'Company Details'
        }
    },
    CompanyDocuments: {
        screen:CompanyDocuments,
        navigationOptions:{
            drawerLabel:'Company Documents'
        }
    }
    // DealsForMeScreen :{
    //     screen: DealsForMeScreen,
    //     navigationOption:{
    //         drawerLable:"DealsForMeScreen"
    //     }
    // },
    // HelpScreen :{
    //     screen: HelpScreen,
    //     navigationOption:{
    //         drawerLable:"HelpScreen"
    //     }
    // },
    // MyAccountScreen :{
    //     screen: MyAccountScreen,
    //     navigationOption:{
    //         drawerLable:"MyAccountScreen"
    //     }
    // },
    // DealsHistoryScreen :{
    //     screen: DealsHistoryScreen,
    //     navigationOption:{
    //         drawerLable:"DealsHistoryScreen"
    //     }
    // },

},
{
    contentComponent:CustomDrawer,
    drawerWidth:300,
    // drawerBackgroundColor:'#11111190',
    contentOptions:{
        activeTintColor:'red',
    }
});

export default createAppContainer(AppDrawer);
