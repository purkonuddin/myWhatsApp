import 'react-native-gesture-handler';
import React, { Component }  from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import SnackBar from 'react-native-snackbar-component';

const Stack = createStackNavigator();

function wait(timeout){
  return new Promise(resolve => {
      setTimeout(resolve, timeout);
  })
}

class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phone_number: '',
      message: '',
      sbVisible: false,
      sbTextMessage: ''
    };
  }

  sendOnWhatsApp=()=> {
    let phone_number = parseInt(this.phonenumber(this.state.phone_number));
    let message = this.state.message;
    if (phone_number) {
      if (message) {

        axios({
          method: 'post',
          url: 'https://eu157.chat-api.com/instance156925/sendMessage?token=kn3vnuub2g4zgp2n',
          data: {
            phone: `62${this.state.phone_number}`,
            body: `${this.state.message}`
          }
        })
        .then((response)=>{
          this.setState({phone_number: '', message: ''});

          let successMsg = (response.data.message !== null && response.data.sent === true)? 'The message sent. Open WhatsApp on your phone and check out last dialog.' : response.data.message;
          Alert.alert(
            "Success",
            `${successMsg}`,
            [{text: "Ok"}],
            {cancelable: false}
          );
          // this.setState({sbVisible: true, sbTextMessage: successMsg});
          // wait(10000).then(()=> this.setState({sbVisible: false, sbTextMessage: ''}));
        })
        .catch((error)=>{
          // Alert.alert(
          //   "Error",
          //   `${error}`,
          //   [{text: "Ok"}],
          //   {cancelable: false}
          // );
          this.setState({sbVisible: true, sbTextMessage: error});
          wait(10000).then(()=> this.setState({sbVisible: false, sbTextMessage: ''}));
        });
        
      } else {
        Alert.alert(
          "Message",
          "Please insert message to send!",
          [{text: "Ok"}],
          {cancelable: false}
        )
      }
    }else{
      Alert.alert(
        "Phone number",
        "Please insert Phone number or Invalid number!",
        [ 
          { text: "OK" }
        ],
        { cancelable: false }
      );
    }
  }

  phonenumber=(n)=>{
    var regExA = /^\d{10,}$/
    if(regExA.test(n)){
      let regExB = /^0?/;
      if (regExB.test(n)) {
        let inaNumber = `62${parseInt(n)}`;
          return parseInt(inaNumber);
      } else {
          let inaNumber = `62${n}`;
          return inaNumber;
      }
    }else{
      return false;
    }
  }

  render(){
    return (
      <LinearGradient 
        colors={['#e0ffff', '#87cefa', '#1e90ff']}
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop:0,
          padding: 50, }}
        > 
          <StatusBar barStyle="dark-content" backgroundColor="#e0ffff" />   
          <Text style={{textAlign: 'center', fontSize: 20, paddingVertical: 30}}>
            WA Message System
          </Text>
          <TextInput
            dataDetectorType={'phoneNumber'}
            value={this.state.phone_number}
            onChangeText={(number)=>this.setState({phone_number: number})}
            placeholder={'+62 - Enter Number'}
            style={{
              textAlign: 'center',
              width:250,
              height: 44,
              padding: 10,
              margin: 20,
              backgroundColor: '#7fffd4'}}
            keyboardType={'numeric'}
          />
          <TextInput 
            multiline={true}
            numberOfLines={2}
            editable 
            value={this.state.message}
            onChangeText={(text)=>this.setState({message:text})}
            placeholder={'Enter message'}
            style={{
              textAlign: 'center',
              width:250,
              height: 100,
              padding: 10,
              margin: 20,
              backgroundColor: '#7fffd4'}}
          />
          <View style={{marginTop:20}}>
            <TouchableOpacity 
              style={{backgroundColor:'#adff2f', paddingVertical:15, paddingHorizontal:50, borderRadius:20}} 
              onPress={this.sendOnWhatsApp}>
                <Text style={{color:'#000'}}>Send</Text>
            </TouchableOpacity>
          </View> 
          <SnackBar 
            visible={this.state.sbVisible} 
            textMessage={this.state.sbTextMessage} 
            actionHandler={()=>this.setState({sbVisible: false})} 
            actionText=""
            />
      </LinearGradient>
    );
  }
  
};

const App =()=> {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
