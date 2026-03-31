import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import chicken from "./assets/chicken.jpg";
import mutton from "./assets/mutton.jpg";
import FoodCard from "../components/FoodCard";

<FlatList
  data={biryaniItems}
  renderItem={({ item }) => (
    <FoodCard item={item} addToCart={addToCart} />
  )}
/>

export default function Menu({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Our Menu</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Image source={chicken} style={styles.img}/>
          <Text>Chicken Curry</Text>
        </View>

        <View style={styles.card}>
          <Image source={mutton} style={styles.img}/>
          <Text>Mutton Curry</Text>
        </View>
      </View>

       <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={{color:"#fff"}}>Home</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    paddingTop:50
  },

  title:{
    fontSize:20,
    marginBottom:20
  },

  row:{
    flexDirection:"row"
  },

  card:{
    alignItems:"center",
    margin:20
  },

  img:{
    width:100,
    height:100
  },

  button:{
    backgroundColor:"#ff5a3c",
    padding:10,
    borderRadius:5,
    marginTop:20
  }
});