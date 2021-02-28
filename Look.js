import React, { Component } from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Image, StatusBar} from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../Firebase';



class Edit extends Component {
    static navigationOptions = {
        title: 'Post Information',
    };
    constructor(props) {
        super(props);
        this.state = {
            key: '',
            score: '',
            location: '',
            comment: '',
            isLoading: true,
            title: '',
            description: '',
            author: ''
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const ref = firebase.firestore().collection('forum').doc(JSON.parse(navigation.getParam('timerkey')));
        ref.get().then((doc) => {
            if (doc.exists) {
                const timer = doc.data();
                this.setState({
                    key: doc.id,
                    name: timer.name,
                    score: timer.score,
                    location: timer.location,
                    comment: timer.comment,
                    isLoading: false,
                    image: timer.image
                });
                if (!timer.image) {this.state.image=''};
            } else {
                console.log("No such document!");
            }
        });
    }

    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;

        this.setState(state);

    }

    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}>
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            );
        }
    };

    _maybeRenderImage = () => {
        let { image } = this.state;
        console.log("uploaded ",this.state.image);
        if (!image) {
            return;
        }

        return (
            <View
                style={{
                    marginTop: 30,
                    width: 50,
                    borderRadius: 3,
                    elevation: 2,
                }}>
                <View
                    style={{
                        borderTopRightRadius: 3,
                        borderTopLeftRadius: 3,
                        shadowColor: 'rgba(0,0,0,1)',
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 4, height: 4 },
                        shadowRadius: 5,
                        overflow: 'hidden',
                    }}>
                    <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
                </View>

            </View>
        );
    };

    _share = () => {
        Share.share({
            message: this.state.image,
            title: 'Check out this photo',
            url: this.state.image,
        });
    };

    _copyToClipboard = () => {
        Clipboard.setString(this.state.image);
        alert('Copied image URL to clipboard');
    };

    _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };


    _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImageAsync(pickerResult.uri);
                this.setState({ image: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };

    updateTimer() {
        this.setState({
            isLoading: true,
        });
        const { navigation } = this.props;
        const updateRef = firebase.firestore().collection('forum').doc(this.state.key);
        updateRef.set({
            name: this.state.name,
            score: this.state.score,
            location: this.state.location,
            image: this.state.image,
        }).then((docRef) => {
            this.setState({
                key: '',
                name: '',
                isLoading: false,
            });
            this.props.navigation.navigate('Main');
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
                this.setState({
                    isLoading: false,
                });
            });
    }

    deleteTimer(key) {
        const { navigation } = this.props;
        this.setState({
            isLoading: true
        });
        firebase.firestore().collection('forum').doc(key).delete().then(() => {
            console.log("Document successfully deleted!");
            this.setState({
                isLoading: false
            });
            navigation.navigate('Main');
        }).catch((error) => {
            console.error("Error removing document: ", error);
            this.setState({
                isLoading: false
            });
        });

    }




    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Name'}
                        value={this.state.name}
                    />
                </View>

                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Score'}
                        value={this.state.score}
                    />
                </View>

                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Location'}
                        value={this.state.location}
                    />
                </View>


                <View style={styles.subContainer}>
                    <TextInput
                        // placeholder={'comment'}
                        value={this.state.comment}
                    />
                </View>


                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
                    <Image source={{ uri: this.state.image }} style={{ width: 150, height: 150 }} />
                </View>

                <View style={{flex:1 , marginTop:10}} >
                    <Button
                        large
                        leftIcon={{name: 'delete'}}
                        title='Delete'
                        onPress={() => this.deleteTimer(this.state.key)} />
                </View>

            </ScrollView>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    subContainer: {
        flex: 1,
        marginBottom: 20,
        padding: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageButton: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row' },
    button:{
        paddingBottom: 10
    }
})

async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const ref = firebase
        .storage()
        .ref()
        .child(Date.now()+'taskimage');
    console.log("in uploadimage ",ref);
    const snapshot = await ref.put(blob);


    // We're done with the blob, close and release it
    //blob.close();

    return await snapshot.ref.getDownloadURL();
}

export default Edit;