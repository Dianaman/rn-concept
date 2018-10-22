import React, { Component } from 'react';
 
import {
  StyleSheet,
  View
} from 'react-native';
 
import Detector from './components/Detector';
 
const image_picker_options = {
  title: 'Select Photo', 
  takePhotoButtonTitle: 'Take Photo...', 
  cameraType: 'back', 
  mediaType: 'photo',
  maxWidth: 480,
  quality: 1, 
  noData: false, 
  path: 'images',
  width: 300,
  height: 300,
  cropping: true,
  includeBase64: true
};

const api_key = '77879e7b4cae41f3baab52bf6ebad30d';

export default class App extends Component {  
  render() {
    return (
      <View style={styles.container}>
        <Detector imagePickerOptions={image_picker_options} apiKey={api_key} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});