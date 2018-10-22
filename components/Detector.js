import React, { Component } from 'react';
import { Buffer } from 'buffer';
 
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
 
 
import ImagePicker from 'react-native-image-crop-picker';
 
import Button from './Button';
 
import RNFetchBlob from 'rn-fetch-blob'
 
import _ from 'lodash';
 
export default class Detector extends Component {
  constructor(props) {
    super(props);

    this.state = {
        photo_style: {
            position: 'relative',
            width: 300,
            height: 300
        },
        has_photo: false,
        photo: null,
        face_data: null
    };
  }
 
  render() {
    return (
      <View style={styles.container}>
         
        <Image
            style={this.state.photo_style}
            source={this.state.photo}
            resizeMode={"contain"}
        >
            { this._renderFaceBoxes.call(this) }
        </Image>
     
        <Button
            text="Take Photo"
            onpress={this._pickImage.bind(this)}
            button_styles={styles.button}
            button_text_styles={styles.button_text} />
 
        { this._renderDetectFacesButton.call(this) }
 
      </View>
    );
  }
 
 
  _pickImage() {
     
    this.setState({
        face_data: null
    });
 
    ImagePicker.openCamera(this.props.imagePickerOptions).then(image => {
        //const source = {uri: `data:${image.mime};base64,${(new Buffer(image.data)).toString('base64')}`};
        const source = {uri: image.path}
        this.setState({
          has_photo: true,
          photo: source
        });
         
        
    }).catch(error => {
        alert(error);
    });
 
  }

  _renderDetectFacesButton() {
    if(this.state.has_photo){
        alert(this.state.photo.uri)
        return  (            
            <Button
                text="Detect Faces"
                onpress={this._detectFaces.bind(this)}
                button_styles={styles.button}
                button_text_styles={styles.button_text} />
        );
    }
  }
 
  _detectFaces() {
 
    RNFetchBlob.fetch('POST', 'https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceAttributes=age,gender', {
        'Accept': 'application/json',
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': this.props.apiKey
    }, this.state.photo_data)
    .then((res) => {
        return res.json();      
    })
    .then((json) => {
         
        if(json.length){
            this.setState({
                face_data: json
            });
            alert("Face detected");
        }else{
            alert("Sorry, I can't see any faces in there.");
        }
         
        return json;
    })
    .catch (function (error) {
        console.log(error);
        alert('Sorry, the request failed. Please try again.' + JSON.stringify(error));
    });
     
 
  }
 
  _renderFaceBoxes () {
 
    if(this.state.face_data){
 
        let views = _.map(this.state.face_data, (x) => {
             
            let box = {
                position: 'absolute',
                top: x.faceRectangle.top,
                left: x.faceRectangle.left
            };
 
            let style = { 
                width: x.faceRectangle.width,
                height: x.faceRectangle.height,
                borderWidth: 2,
                borderColor: '#fff',
            };
             
            let attr = {
                color: '#fff',
            };
 
            return (
                <View key={x.faceId} style={box}>
                    <Text style={attr}>{x.faceAttributes.gender}, {x.faceAttributes.age} y/o</Text>
                </View>
            );
        });
 
        return <View>{views}</View>
    }
 
  }
   
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ccc'
  },
  button: {
    margin: 10,
    padding: 15,
    backgroundColor: '#529ecc'
  },
  button_text: {
    color: '#FFF',
    fontSize: 20
  }
});
 
AppRegistry.registerComponent('Detector', () => Detector);