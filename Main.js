//rohil test
import React, { Component } from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, View, Text, TouchableOpacity, Image} from 'react-native';
import {ListItem, Button, Avatar,} from 'react-native-elements';
import firebase from '../Firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import {List, Searchbar} from 'react-native-paper';
import {Linking} from "expo/build/deprecated.web";

class Main extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('forum').orderBy('location');
        this.unsubscribe = null;
        this.state = {
            isLoading: true,
            timers: []
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const timers = [];
        querySnapshot.forEach((doc) => {
            const { name, tasks,image, location } = doc.data();
            timers.push({
                key: doc.id,
                doc, // DocumentSnapshot
                name,
                location,
                image
            });
        });
        this.setState({
            timers : timers,
            isLoading: false,
        });
        console.log("After setting state");
        console.log(timers);
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: '',
            headerLeft: (
                <View style={{flexDirection:"row" , alignItems: "center"}}>
                    <Image
                        style={{ width: 210, height: 65}}
                        source={require("../assets/pic.jpeg")}
                    />
                </View>

            ),
            headerRight: (


                <View style={{flexDirection:"row" , alignItems: "center"}}>


                    <Button
                        buttonStyle={{ padding: 28, backgroundColor: 'transparent' }}
                        icon={{ name: 'add-circle', style: { marginRight: 10, fontSize: 10 } }}
                        onPress={() => { navigation.push('Adds') }}
                    />
                    <TouchableOpacity onPress={ ()=>{ Linking.openURL('https://www.statefarm.com/')}}>
                        <Image
                            style={{ width: 120, height: 50}}
                            source={{uri: 'https://1000logos.net/wp-content/uploads/2018/03/State-Farm-Logo.png'}}

                        />
                    </TouchableOpacity>

                </View>
            ),
        };
    };

    updateSearch = (search) => {
        this.setState({ search });
    };



    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )
        }

        return (




            <ScrollView>
                    {


                        this.state.timers.map((item, i) => (
                            <ListItem
                                key={i}
                                bottomDivider
                                onPress={() => {
                                    this.props.navigation.navigate('Edits', {
                                        timerkey: `${JSON.stringify(item.key)}`,
                                        timerName: `${JSON.stringify(item.name)}`,
                                    });
                                }}
                            >
                                <Avatar source={{uri: item.image}} />
                                <ListItem.Content>
                                    <ListItem.Title >{item.name}</ListItem.Title>
                                    <ListItem.Subtitle>{item.location} </ListItem.Subtitle>
                                </ListItem.Content>


                                <Icon.Button
                                    name="edit"
                                    size={14}
                                    color="black"
                                    backgroundColor="white"
                                    onPress={() => {
                                        this.props.navigation.navigate('Edits', {
                                            timerkey: `${JSON.stringify(item.key)}`,
                                            timerName: `${JSON.stringify(item.name)}`,
                                        });
                                    }}
                                >

                                </Icon.Button>





                            </ListItem>
                        ))
                    }


            </ScrollView>
        );
    }
}

                           // <ListItem key={i} bottomDivider >
                           //     <ListItem.Content>
                           //         <ListItem.Title >{item.name}</ListItem.Title>
//
                            //    </ListItem.Content>

                          //  </ListItem>








const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Main;