import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera, CameraType } from 'expo-camera'
import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInput from '../components/TextInput';
import axios from 'axios';

export default function CameraScreen({ otherParam, navigation }) {

    let camera = Camera

    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [startCamera, setStartCamera] = React.useState(false)
    const [photo, setPhoto] = useState()
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [type, setType] = useState(CameraType.back);

    const [data, setData] = useState([])
    const [email, setEmail] = useState("")
    const [duration, setDuration] = useState("")
    const [image, setImage] = useState(null)
    const [token, setToken] = useState()
    const [picture, setPicture] = useState()

    const __startCamera = async () => {
        setStartCamera(true)
    }

    useEffect(() => {
        AsyncStorage.getItem('token').then((token) => {
            if (token !== null) {
                setToken(token)
            } else {
                setToken('')
            }
        })
    }, [data])

    useEffect(() => {
        (async () => {

            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === "granted");
            setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();
    }, [photo]);

    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync()
        setPhoto(photo)
        setCapturedImage(photo)
    }

    const retake = () => {
        setCapturedImage(null)
        setPhoto(null)

    }

    const __savePhoto = async () => {
        MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
            setPhoto(undefined)
            __startCamera()
        })
    }

    const sendImage = async () => {
        var formData = new FormData();
        formData.append('duration', parseInt(duration));
        formData.append('to', email);
        formData.append('image', {
            uri: photo.uri,
            name: 'fileName',
            type: 'image/jpg'
        });

        console.log('token ', token);
        console.log(formData);

        var config = {
            method: 'post',
            url: 'http://snapi.epitech.eu:8000/snap',
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': token,
            },
            data: formData
        };

        axios(config)
            .then((response) => {
                setData(response)
                console.log('response ', response.data)
                setPhoto(null)
            });
    }


    if (photo) {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                {photo && <ImageBackground
                    source={{ uri: capturedImage && capturedImage.uri }}
                    style={{
                        flex: 1,
                        width: "100%"
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            padding: 15,
                            justifyContent: 'flex-end'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View>
                                <TouchableOpacity
                                    onPress={retake}
                                    style={{
                                        width: 60,
                                        height: 40,

                                        alignItems: 'center',
                                        borderRadius: 4
                                    }}
                                >
                                    <Ionicons name='close' style={{ fontSize: 40, color: '#fff' }} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    onPress={__savePhoto}
                                    style={{
                                        width: 60,
                                        height: 40,

                                        alignItems: 'center',
                                        borderRadius: 4
                                    }}
                                >
                                    <Ionicons name='save-outline' style={{ fontSize: 40, color: '#fff' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>}
                <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>
                    <TextInput
                        icon="mail"
                        placeholder="Send to .."
                        autoCapitalize="none"
                        autoCompleteType="email"
                        keyboardType="email-address"
                        keyboardAppearance="dark"
                        returnKeyType="next"
                        returnKeyLabel="next"
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>
                <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>
                    <TextInput
                        icon="clock"
                        placeholder="Duration"
                        autoCapitalize="none"
                        keyboardAppearance="dark"
                        returnKeyType="go"
                        returnKeyLabel="go"
                        onChangeText={setDuration}
                        value={duration}
                    />
                </View>
                <View style={{ marginBottom: 8 }}>
                    {/* <Button label="Send" onPress={sendImage} /> */}
                    <Text style={{ color: '#7158e2', fontSize: 20 }} onPress={sendImage}>Send</Text>
                </View>
            </View>
        );
    }
    else {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Camera
                    style={{ flex: 3, width: "100%" }}
                    ratio="20:9"
                    ref={(r) => {
                        camera = r
                    }}
                    type={type}
                >
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            flexDirection: 'row',
                            flex: 1,
                            width: '100%',
                            padding: 20,
                            justifyContent: 'space-between'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                flex: 1,
                                // justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            {/* <Ionicons name='camera-reverse-outline' style={styles.flipBtn} /> */}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        setType(type === CameraType.back ? CameraType.front : CameraType.back);
                                    }}>
                                    <Ionicons name="camera-reverse-outline" style={{ fontSize: 45, color: '#fff' }} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={__takePicture}
                                style={{
                                    width: 70,
                                    height: 70,
                                    bottom: 0,
                                    borderRadius: 50,
                                    backgroundColor: '#fff'
                                }}
                            />

                            <View style={styles.buttonContainer}>

                            </View>
                            {/* <Ionicons name='document-outline' style={styles.albumBtn} /> */}
                        </View>
                    </View>
                </Camera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    flipBtn: {
        color: '#fff',
        alignItems: 'center',
        fontSize: 55,
        width: 50,
        height: 55,
    },
    albumBtn: {
        color: '#fff',
        alignItems: 'center',
        fontSize: 55,
        width: 50,
        height: 55,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
})