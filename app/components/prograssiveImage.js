import React from 'react';
import { View, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";


const styles = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    container: {
        backgroundColor: '#e1e4e8',
    },
});

class ProgressiveImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true
        }
    }

    thumbnailAnimated = new Animated.Value(0);

    imageAnimated = new Animated.Value(0);

    handleThumbnailLoad = () => {
        Animated.timing(this.thumbnailAnimated, {
            toValue: 1,
        }).start();
    }

    onImageLoad = () => {
        Animated.timing(this.imageAnimated, {
            toValue: 1,
        }).start();
    }

    render() {
        const {
            thumbnailSource,
            source,
            style,
            indicatorColor,
            indicatorSize,
            ...props
        } = this.props;
        //console.warn("image Style", style)
        return (
            <View style={styles.container}>
                <View style={[style, { position: 'absolute', zIndex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    {
                        this.state.loader ?

                            <ActivityIndicator size={indicatorSize ? indicatorSize : 'small'} color={indicatorColor ? indicatorColor : 'red'} />
                            :
                            null
                    }
                </View>
                <Animated.Image
                    {...props}
                    source={{ uri: `${thumbnailSource}?w=50&buster=${Math.random()}` }}
                    onLoadEnd={(e) => this.setState({ loader: false })}
                    style={[style, { opacity: this.thumbnailAnimated }]}
                    onLoad={this.handleThumbnailLoad}
                    blurRadius={1}
                />
                <Animated.Image
                    {...props}
                    source={{ uri: `${source}?w=${wp('100%') * 5}&buster=${Math.random()}` }}
                    style={[styles.imageOverlay, { opacity: this.imageAnimated }, style]}
                    onLoad={this.onImageLoad}
                />
            </View>
        );
    }
}

export default ProgressiveImage;