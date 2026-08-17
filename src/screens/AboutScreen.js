import React from "react";
import {
View,
Text,
StyleSheet,
ScrollView
} from "react-native";

import COLORS from "../styles/colors";

export default function AboutScreen(){

return(

<ScrollView
style={styles.container}
contentContainerStyle={{padding:20}}
>

<Text style={styles.title}>
MangoLeaf AI
</Text>

<Text style={styles.heading}>
Project
</Text>

<Text style={styles.content}>
Offline Mango Variety Identification using MobileNetV2 TensorFlow Lite Model.
</Text>

<Text style={styles.heading}>
Features
</Text>

<Text style={styles.content}>
• Camera Prediction{"\n"}
• Gallery Prediction{"\n"}
• Offline AI{"\n"}
• Top 3 Predictions{"\n"}
• Confidence Score{"\n"}
• Prediction History
</Text>

<Text style={styles.heading}>
Developed At
</Text>

<Text style={styles.content}>
VIT Vellore
</Text>

</ScrollView>

);

}

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:COLORS.background
},

title:{
fontSize:30,
fontWeight:"bold",
color:COLORS.primary,
marginBottom:30
},

heading:{
fontSize:22,
fontWeight:"bold",
marginTop:20
},

content:{
fontSize:17,
marginTop:10,
lineHeight:28
}

});