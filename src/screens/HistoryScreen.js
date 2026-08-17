import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import COLORS from "../styles/colors";

export default function HistoryScreen(){

  return(

    <View style={styles.container}>

      <Text style={styles.title}>
        Prediction History
      </Text>

      <Text style={styles.text}>
        No Predictions Yet
      </Text>

    </View>

  );

}

const styles=StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
alignItems:"center",
backgroundColor:COLORS.background
},

title:{
fontSize:28,
fontWeight:"bold",
color:COLORS.primary
},

text:{
marginTop:20,
fontSize:18
}

});