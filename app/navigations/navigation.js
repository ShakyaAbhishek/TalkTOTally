import React, { Component } from 'react';
import { Alert, Dimensions, TouchableOpacity, Text, View, ImageBackground, TextInput, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';

//import all the screens Here----->
import SplashScreen from '../screens/pre_loginScreens/splashScreen';
import LoginScreen from '../screens/pre_loginScreens/loginscreen';
import SignUpScreen from '../screens/pre_loginScreens/signUpScreen';
import CompanySignUp from '../screens/pre_loginScreens/companySignUp';
import EmployeeSignUp from '../screens/pre_loginScreens/employeeSignUp';
import ForgetPasswordScreen from '../screens/pre_loginScreens/forgetPasswordScreen';
//after loginscreen
import AppDrawer from './drawerNavigation';
import DashboardScreen from '../screens/in_appScreens/dashboardScreen';
import CaptureDocuments from '../screens/in_appScreens/captureDocuments';
import CompanyDetails from '../screens/in_appScreens/companyDetails';
import CompanyUser from '../screens/in_appScreens/companyUser';
import CompanyDocuments from '../screens/in_appScreens/companyDocuments';
import CompanyDocDetail from '../screens/in_appScreens/companyDocDetail';
import UserDetails from '../screens/in_appScreens/userDetails';
import ChangePasswordScreen from '../screens/in_appScreens/changePasswordScreen';
import OfferPlanScreen from '../screens/in_appScreens/offerPlanScreen';

function stackOfAllScreens(initialScreen) {
    return createStackNavigator({
        SplashScreen: {
            screen: SplashScreen,
            navigationOptions: {
                header: null
            }
        },
        LoginScreen: {
            screen: LoginScreen,
            navigationOptions: {
                header: null
            }
        },
        SignUpScreen: {
            screen: SignUpScreen,
            navigationOptions: {
                header: null
            }
        },
        CompanySignUp: {
            screen: CompanySignUp,
            navigationOptions: {
                header: null
            }
        },
        EmployeeSignUp: {
            screen: EmployeeSignUp,
            navigationOptions: {
                header: null
            }
        },
        ForgetPasswordScreen: {
            screen: ForgetPasswordScreen,
            navigationOptions: {
                header: null
            }
        },
        DashboardScreen: {
            screen: DashboardScreen,
            navigationOptions: {
                header: null
            }
        },
        AppDrawer: {
            screen: AppDrawer,
            navigationOptions: {
                header: null
            }
        },
        CaptureDocuments: {
            screen: CaptureDocuments,
            navigationOptions: {
                header: null
            }
        },
        CompanyDetails: {
            screen: CompanyDetails,
            navigationOptions: {
                header: null
            }
        },
        CompanyUser: {
            screen: CompanyUser,
            navigationOptions: {
                header: null
            }
        },
        CompanyDocuments: {
            screen: CompanyDocuments,
            navigationOptions: {
                header: null
            }
        },
        CompanyDocDetail: {
            screen: CompanyDocDetail,
            navigationOptions: {
                header: null
            }
        },
        UserDetails: {
            screen: UserDetails,
            navigationOptions: {
                header: null
            }
        },
        ChangePasswordScreen: {
            screen: ChangePasswordScreen,
            navigationOptions: {
                header: null
            }
        },
        OfferPlanScreen:{
            screen: OfferPlanScreen,
            navigationOptions:{
                header:null
            }
        }


    }
        , {
            initialRouteName: initialScreen,
            // navigationOptions: {
            //     headerTintColor: '#7a7a7a',
            //     headerStyle: {
            //         borderTopWidth: 0.5,

            //         borderTopColor: '#e7e7e7',
            //         borderBottomColor: 'white',

            //     },



            // },
        }
    )
}

class HandleNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.checkAuth()
    }

    checkAuth = async () => {
        try {
            const value = await AsyncStorage.getItem('auth_token')
            console.warn('value', value)
            if (value !== null) {

                this.props.navigation.navigate('mainRoute')
            }
            else {
                this.props.navigation.navigate('stack')
            }
        } catch (e) {
            console.warn('asycny erroe', e)
        }

    }
    render() {
        return (
            <View></View>
        )
    }
}

export const Route = createSwitchNavigator({
    HandleNavigation: HandleNavigation,
    stack: { screen: stackOfAllScreens("SplashScreen") },
    mainRoute: { screen: stackOfAllScreens("AppDrawer") }//AppDrawer
});
export default createAppContainer(Route);
