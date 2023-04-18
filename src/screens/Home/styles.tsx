import {StyleSheet} from 'react-native'
interface IStyles{
    container: object,
    text: object,
    header: object,
    calendar: object,
    day: object,
    daygrid: object,
    semana: object,
    addday: object,
    dayative: object,
    todayBorder: object,
    add: object,
    modalStyle: object,
    headermodel: object,
    modaltitle: object,
    modalBody: object,
    Time: object,
    Tarefa: object,
    categorias: object,
    newcateg: object,
    categ: object,
    categText: object
    selectedCateg: object,
    selectedCategText:object
}
export const styles:IStyles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      backgroundColor:'#fff'
    },
    text: {
      fontFamily: 'roboto-bold',
      fontSize: 30,
      marginTop: -5,
      color:'#fff'
    },
    header: {
      marginTop: 30, 
      width: '90%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    calendar: {
      width: '100%',
      // backgroundColor: '#fff',
      position: "relative",
      height: 100,
      flexDirection: 'row'
    },
    daygrid:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      gap:10,
      width:55,
      height:'100%',
    },
    semana:{
      fontFamily:'inter-regular',
      fontSize:13,
      color:'#fff'
    },
    day:{
      fontFamily:'inter-regular',
      color:'#f5f5f5',
    },
    addday:{
      height:35,
      width:35,
      borderRadius:30, 
      justifyContent:'center',
      alignItems:'center',
    },
    dayative:{
      backgroundColor:'#fff'
        
    },
    todayBorder:{
      borderWidth:2,
      borderColor:'#fff'
    },
    add:{
      position:"absolute",
      bottom:25,
      height:55,
      width:55,
      borderRadius:30,
      backgroundColor:'#00e0fd',
      justifyContent:'center',
      alignItems:'center',
      right:30,
      elevation:5,
      zIndex:100
    },  
    modalStyle:{
      flex: 1, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    headermodel:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    modaltitle:{
        fontSize:16,
        fontFamily:'noto-bold'
    },
    modalBody:{
        width:'100%',
        marginTop:20
    },
    Time:{
        width:'44%', 
        height:44, 
        borderWidth:1, 
        borderRadius:10, 
        justifyContent:'center', 
        alignItems:'center',
    },
    Tarefa:{
        width:'90%',
        padding:15,
        marginTop:20,
        backgroundColor:'#00ffaa',
        borderRadius:8,
        elevation:5
    },
    categorias:{
      height:40,
      width:'95%',
      marginTop:10,
      marginBottom:10,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'
    },
    newcateg:{
      flexDirection:'row',
      // position:'absolute',
      height:'100%',
      justifyContent:'center',
      backgroundColor:'#00e0fd',
      padding:10, 
      alignItems:'center', 
      borderRadius:8
    },
    categ:{
      flexDirection:'row', 
      height:'100%', 
      justifyContent:'center',
      padding:10,
      paddingLeft:20,
      paddingRight:20,
      borderWidth:1, 
      alignItems:'center', 
      marginLeft:10,
      marginRight:5,
      gap:2, 
      borderRadius:8,

    },
    categText: {
      fontFamily: 'noto',
      fontSize: 12,
    },
    selectedCateg: {
      backgroundColor: '#00ddff64',
      borderWidth:0,
    },
    selectedCategText:{
      color:'#fff',
      fontFamily:'noto-bold'
    }
  })
  