// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AsyncStorage,
  BackHandler, Dimensions, Animated, TouchableOpacity, ImageBackground
} from 'react-native';
import firebase from 'react-native-firebase';
// import AsyncStorage from '@react-native-community/async-storage';
import Routes from './app/navigations/navigation';
import store from './app/app_Redux/store/index';
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';
import { Provider } from 'react-redux'
import BackgroundImage from './app/assets/backgroundImage.jpg';
let { width, height } = Dimensions.get('window');


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backClickCount: 0,
      Connected: true
    }
    this.springValue = new Animated.Value(100);
  }

  componentDidMount() {
    this.checkPermission();
    NetInfo.addEventListener(state => {
      
      if(state.isConnected == false){
        Toast.showWithGravity("Please check your Internet Connection", Toast.LONG, Toast.TOP);
        // showMessage({
        //   message: "Please check your Internet Connection",
        //   type: "danger",
        //   duration:3000,
        //   position:'top'
         
        // });
        this.setState({
          Connected:!this.state.Connected
        })
      }
      if(!this.state.Connected){
      if(state.isConnected == true){
       // Toast.showWithGravity("Connected", Toast.LONG, Toast.TOP);
        // showMessage({
        //   message: "Connected",
        //   type: "success",
        //   duration:2000,
        //   position:'top'
         
        // });
      }
    }
      
    });

  }

  // //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
      // this.createNotificationListeners();
    } else {
      this.requestPermission();
    }
  }

  // //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.warn('fcm', fcmToken)
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.warn('fcmtoken', fcmToken)
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  // //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
      // this.createNotificationListeners();
    } catch (error) {
      // User has rejected permissions
    }
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  _spring() {
    this.setState({ backClickCount: 1 }, () => {
      Animated.sequence([
        Animated.spring(
          this.springValue,
          {
            toValue: -.15 * height,
            friction: 5,
            duration: 500,
            useNativeDriver: true,
          }
        ),
        Animated.timing(
          this.springValue,
          {
            toValue: 100,
            duration: 500,
            useNativeDriver: true,
          }
        ),

      ]).start(() => {
        this.setState({ backClickCount: 0 });
      });
    });

  }

  handleBackButton = () => {
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();

    return true;
  };

  render() {
    return (
      <Provider store={store}>
        <ImageBackground style={{flex:1}} source={BackgroundImage} >
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" backgroundColor="#111111" />
          <Routes />
          <Animated.View style={[styles.animatedView, { transform: [{ translateY: this.springValue }] }]}>
            <Text style={styles.exitTitleText}>press back again to exit the app</Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => BackHandler.exitApp()}
            >
              <Text style={styles.exitText}>Exit</Text>
            </TouchableOpacity>

          </Animated.View>
        </SafeAreaView>
        </ImageBackground>
      </Provider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  animatedView: {
    width,
    backgroundColor: "#ffffff98",
    elevation: 2,
    position: "absolute",
    bottom: 0,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  exitTitleText: {
    textAlign: "center",
    color: "#111111",
    marginRight: 10,
  },
  exitText: {
    color: "#AF1E0D",
    paddingHorizontal: 10,
    paddingVertical: 3
  }
};

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const App: () => React$Node = () => {
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Step One</Text>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.js</Text> to change this
//                 screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default App;
