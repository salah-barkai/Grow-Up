import { useState, useEffect } from 'react';
import { StyleSheet, Text, View , ScrollView, TextInput, TouchableOpacity} from 'react-native';
import List from './components/list';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [citation, setcitation] = useState([]);
  const [list, setlist] = useState('');
  const [lists, setlists] = useState([]);

  useEffect(()=>{
    loadtask();
  },[]);

  const addlist = async () =>{
    const newlist = [...lists, list];
    setlists(newlist);

    await AsyncStorage.setItem('lists', JSON.stringify(newlist));

    setlist('');
  };

  const removeTask = async (index) => {
    try {
      // Supprimer la tâche de la liste
      const newlist = [...lists];
      newlist.splice(index, 1);
  
      // Mettre à jour l'état avec la nouvelle liste
      setlists(newlist);
  
      // Sauvegarder la liste mise à jour dans AsyncStorage
      await AsyncStorage.setItem('lists', JSON.stringify(newlist));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };
  

  const loadtask = async () =>{
    const savedlist = await AsyncStorage.getItem('lists');
    if (savedlist) {
      setlists(JSON.parse(savedlist));
    }
  };

  useEffect(()=>{
     const fetchData = async () => {
      const url = 'https://quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com/quote?token=ipworld.info';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'b7c9b4aea6msh0b953b86d93121ep13ae74jsnea60029e00c5',
          'X-RapidAPI-Host': 'quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com'
        }
      };
      
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        setcitation(result);
      } catch (error) {
        console.error(error);
      }
     }
     fetchData();
  },[]);


  return (
    <View style={styles.container}>
      <View style={styles.logocontainer}>
        <Text style={styles.logo}>Grow-Up</Text>
      </View>
      <View style={styles.inputcontainer}>
          <View style={styles.textinput}>
            <TextInput placeholder='Write new project' style={styles.input} 
             value={list} onChangeText={setlist}></TextInput>
          </View>
          <TouchableOpacity style={styles.btn} onPress={addlist}>
            <Text style={styles.btntext}>+</Text>
          </TouchableOpacity>
      </View>
     <ScrollView>
        <ScrollView style={styles.listcontainer}>
            {lists.map((listItem, index) => (
              <TouchableOpacity onPress={() => removeTask(index)}>
                <List key={index} text={listItem}/>
              </TouchableOpacity>
              ))}
         </ScrollView>

        <ScrollView style={styles.citationcontainer}>
         <Text style={styles.citation}>{`" ${citation.text} "`}</Text>
         <Text style={styles.author}>{citation.author}</Text>
        </ScrollView>

        
     </ScrollView>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  logocontainer:{
     width:'auto',
     margin: 0,
     padding: 15,
     borderRadius: 1,
     backgroundColor: 'blue',
     width: '100%',
     
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 2,
    color: 'white'
  },
  listcontainer: {
    margin: 20,
    textAlign: 'center',
  },
  textinput: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 20,
    backgroundColor: 'whitesmoke',
    padding: 15,
    width: 230,
    borderRadius: 10,
  },
  input: {
    width: 'auto',
    padding: 5,
    borderWidth: 0,
  },
  btn: {
    borderRadius: 50,
    width: 50, 
    height: 50, 
    backgroundColor: 'blue',
    margin: 20,
    padding: 8,
    justifyContent: 'center',
    textAlign:'center',
    alignItems: 'center'
  },
  inputcontainer:{
    flexDirection: 'row',
    flexWrap: 'wrap', 
    marginBottom:5,
  },
  btntext: {
      fontWeight: 'bold',
      fontSize:18,
      color: 'white'
    },
  citationcontainer: {
    margin: 20,
    textAlign: 'center',
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 15,
   
  },
  citation: {
    fontSize: 15,
    margin: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  author: {
    margin: 5,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  }
});
