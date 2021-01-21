import React, {Component} from 'react';
import {
  StyleSheet,
  Animated,
  View,
  Text,
  SafeAreaView,
  PanResponder,
} from 'react-native';

import Svg, {Path, Circle, Rect, Image} from 'react-native-svg';

import ModelView from 'react-native-gl-model-view';
const AnimatedModelView = Animated.createAnimatedComponent(ModelView);
import ReactGlobe from 'react-globe';
import THREE from 'three';
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob';

import {WebView} from 'react-native-webview';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      rotateX: new Animated.Value(-90),
      rotateZ: new Animated.Value(0),

      fromXY: undefined,
      valueXY: undefined,
    };
  }

  onMoveEnd = () => {
    this.setState({
      fromXY: undefined,
    });
  };

  onMove = (e) => {
    let {pageX, pageY} = e.nativeEvent,
      {rotateX, rotateZ, fromXY, valueXY} = this.state;
    if (!this.state.fromXY) {
      this.setState({
        fromXY: [pageX, pageY],
        valueXY: [rotateZ.__getValue(), rotateX.__getValue()],
      });
    } else {
      rotateZ.setValue(valueXY[0] + (pageX - fromXY[0]) / 2);
      rotateX.setValue(valueXY[1] + (pageY - fromXY[1]) / 2);
    }
  };

  renderChildren = () => {
    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <View
          ref={(component) => (this.refView = component)}
          style={styles.rotateView}>
          <Text>sss</Text>
        </View>
      </View>
    );
  };

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove.bind(this),
    });
  }

  handlePanResponderMove(e, gestureState) {
    const {dx, dy} = gestureState;
    const y = `${dx}deg`;
    const x = `${-dy}deg`;
    this.refView.setNativeProps({
      style: {transform: [{perspective: 1000}, {rotateX: x}, {rotateY: y}]},
    });
  }

  SimpleGlobe = () => {
    return <ReactGlobe />;
  };


  render() {
    let {rotateZ, rotateX, fromXY} = this.state;
 

    return (
      <SafeAreaView style={{flex: 1}}>

        <AnimatedModelView
          model={{
            uri: 'Globe.obj',
          }}
          texture={{uri: 'albedo_defuse.png'}}

          onStartShouldSetResponder={() => true}
          onResponderRelease={this.onMoveEnd}
          onResponderMove={this.onMove}
          animate={!!fromXY}
          tint={{r: 1.0, g: 1.0, b: 1.0, a: 1.0}}
          scale={0.2}
          rotateX={rotateX}
          rotateZ={rotateZ}
          translateZ={-4}
          style={styles.container}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // width: 200,
    // height: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  rotateView: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.2,
  },
});
//s