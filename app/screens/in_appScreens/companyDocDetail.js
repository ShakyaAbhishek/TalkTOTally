//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground, Modal, PermissionsAndroid, Platform } from 'react-native';
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
import BackgroundImage from '../../assets/backgroundImage.jpg';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Loader } from '../../components/loaderModal';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from "rn-fetch-blob";
// import console = require('console');
// create a component
class CompanyDocDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doc_Id: '',
            company_id: '',
            created_by: '',
            ledger: "",
            document: "",
            created_on: "",
            document_name: "",
            isVisible: false,
            spinnerVisible: true
        }
    }

    componentDidMount() {
        var docId = this.props.navigation.getParam('docId', '');
        var company_id = this.props.navigation.getParam('company_id', '');
        console.warn(docId);
        this.setState({
            doc_Id: docId,
            company_id: company_id
        })

        let form = new FormData();
        this.setState({ spinnerVisible: true })
        form.append("document_id", docId);

        form.append("company_id", company_id);
        console.warn('detail', form)
        fetch("http://whitetechnologies.co.in/app/getDocumentDetails", {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            },
            body: form
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {
                    console.warn("documnebt detail", responseJson);
                    this.setState({
                        spinnerVisible: false,
                        created_by: responseJson.data.created_by,
                        ledger: responseJson.data.ledger,
                        document: responseJson.data.document,
                        created_on: responseJson.data.created_on,
                        document_name: responseJson.data.document_name
                    });
                }
                else {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                }
            }).catch((error) => {
                Toast.show(error, Toast.LONG);
                this.setState({ spinnerVisible: false });
            })
    }

    documentDelete = () => {
        let form = new FormData();
        this.setState({ spinnerVisible: true })
        form.append("document_id", this.state.doc_Id);
        console.warn("jashfaks", form)
        //form.append("company_id", company_id);
        fetch("http://whitetechnologies.co.in/app/documentDelete", {
            method: 'POST',
            headers: {
                'Accept': "application/json",
                //'Content-Type': "application/x-www-form-urlencoded"
            },
            body: form
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                    this.props.navigation.navigate('CompanyDocuments');
                }
                else {
                    Toast.show(responseJson.message, Toast.LONG);
                    this.setState({ spinnerVisible: false });
                }
            }).catch((error) => {
                Toast.show(error, Toast.LONG);
                this.setState({ spinnerVisible: false });
            })
    }

    async requestExternalStoreageRead() {
        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );

                return granted == PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                //Handle this error
                console.warn("error");
                return false;
            }
        } else {
            return true;
            console.warn("ios");
        }
    }


    downloadDocument = async() => {
        let policyUrl = `http://whitetechnologies.co.in/uploads/documents/${this.state.document}`;
        if (await this.requestExternalStoreageRead()) {
            var date = new Date();
            var url = encodeURI(policyUrl);
            var ext = this.extention(url);
            ext = "." + ext[0];
            const { config, fs } = RNFetchBlob;
            let PictureDir = fs.dirs.PictureDir;
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path:
                        PictureDir +
                        "/image_" +
                        Math.floor(date.getTime() + date.getSeconds() / 2) +
                        ext,
                    description: "Image"
                }
            };
            config(options)
                .fetch("GET", url)
                .then(res => {
                    this.setState({ showModal: true });
                    // alert("Successfully downloaded");
                })
                .catch(err => alert(err));
        }
    };

    extention(filename) {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;

    }

    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground source={BackgroundImage} style={styles.container}>
                <Loader spinnerVisible={this.state.spinnerVisible} />
                <Header navigation={navigation} backButtonNavigation={true} transparent={true} button={true} whiteIcon={true} title={'Company Documents Details'} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isVisible}
                    onRequestClose={() => {
                        this.setState({ isVisible: false })
                    }}
                >
                    <View style={{ height: hp('100%'), width: wp('100%'), backgroundColor: "#00000090", justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.setState({ isVisible: false })} style={{ position: 'absolute', right: '3%', top: '3%', zIndex: 1 }}>
                            <Icon name="times-circle" size={fontSizes(24)} color="red" />
                        </TouchableOpacity>
                        <View style={{ height: hp('90%'), width: wp('90%') }}>
                            <ImageViewer imageUrls={[{ url: `http://whitetechnologies.co.in/uploads/documents/${this.state.document}` }]} />
                        </View>
                    </View>
                </Modal>

                <View style={{ flex: 1 }}>
                    <View style={styles.headingViewStyle}>
                        <Text style={styles.headingText}>Document Details</Text>
                    </View>
                    <View style={{ marginVertical: hp('3%'), borderColor: '#ffffff99', borderWidth: 0, marginHorizontal: wp('2%'), borderRadius: 15, elevation: 5 }}>
                        <View style={styles.inputViewStyle}>
                            <View style={styles.lableViewStyle}>
                                <Text style={styles.lableTextStyle}>Document Name</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <View style={styles.textInputViewStyle}>
                                    <Text numberOfLines={2} style={styles.textInputStyle}>{this.state.document_name}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputViewStyle}>
                            <View style={styles.lableViewStyle}>
                                <Text style={styles.lableTextStyle}>Date Clicked</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <View style={styles.textInputViewStyle}>
                                    <Text numberOfLines={2} style={styles.textInputStyle}>{this.state.created_on}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputViewStyle}>
                            <View style={styles.lableViewStyle}>
                                <Text style={styles.lableTextStyle}>Document Uploaded By</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <View style={styles.textInputViewStyle}>
                                    <Text numberOfLines={2} style={styles.textInputStyle}>{this.state.created_by}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputViewStyle}>
                            <View style={styles.lableViewStyle}>
                                <Text style={styles.lableTextStyle}>Document Type</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <View style={styles.textInputViewStyle}>
                                    <Text numberOfLines={2} style={styles.textInputStyle}>{this.state.ledger}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputViewStyle}>
                            <View style={styles.lableViewStyle}>
                                <Text style={styles.lableTextStyle}>Status</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <View style={styles.textInputViewStyle}>
                                    <Text numberOfLines={2} style={styles.textInputStyle}> </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputViewStyle}>
                            <View style={styles.lableViewStyle}>
                                <Text style={styles.lableTextStyle}>Reason</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <View style={styles.textInputViewStyle}>
                                    <Text numberOfLines={2} style={styles.textInputStyle}>SD</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.actionView}>
                        <View style={styles.actionViewInput}>
                            <View style={styles.lableViewStyle}>
                                <Text style={styles.lableTextStyle}>Download</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TouchableOpacity onPress={() => this.downloadDocument()} style={styles.textInputViewStyle}>
                                    <Text numberOfLines={2} style={[styles.textInputStyle, { color: '#10D46F' }]}>For Download Press Here</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={[styles.textInputViewStyle, { width: wp('15%') }]}>
                                    <Text numberOfLines={2} style={[styles.textInputStyle, { color: '#10D46F' }]}>View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.actionView, { borderTopWidth: 0 }]}>
                        <View style={styles.actionViewInput}>
                            <View style={styles.lableViewStyle}>
                                <Text style={styles.lableTextStyle}>Action</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TouchableOpacity onPress={() => this.documentDelete()} style={styles.textInputViewStyle}>
                                    <Text numberOfLines={2} style={[styles.textInputStyle, { color: '#F94659' }]}>For Delete Press Here</Text>
                                </TouchableOpacity>
                            </View>
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
    headingViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ffffff',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        padding: hp('0.7%'),
        marginTop: hp('2%')
    },
    headingText: {
        fontSize: fontSizes('bigtitle'),
        fontWeight: 'bold',
        color: '#0780CF'
    },
    inputViewStyle: {
        height: hp('7%'),
        flexDirection: 'row'
    },
    lableViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lableTextStyle: {
        fontSize: fontSizes('smalltitle'),
        fontWeight: 'bold',
        color: '#ffffff',
        //textAlign:'center' 
    },
    textInputContainer: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textInputViewStyle: {
        width: wp('50%'),
        height: hp('5%'),
        borderRadius: 10,
        //backgroundColor: '#ffffff', 
        justifyContent: 'center',
        paddingLeft: 5
    },
    textInputStyle: {
        fontSize: fontSizes('smalltitle'),
        color: '#3B8BCA'
    },
    actionView: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ffffff',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        padding: hp('0.6%'),
    },
    actionViewInput: {
        height: hp('5%'),
        flexDirection: 'row'
    },
});

//make this component available to the app
export default CompanyDocDetail;
