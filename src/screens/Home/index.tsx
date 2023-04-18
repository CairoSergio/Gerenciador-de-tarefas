import React,{useState, useEffect} from "react";
import {  Text, View,TouchableOpacity, ActivityIndicator} from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { Modal } from "react-native";
import { ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";

import { updateTarefa,addTarefa, createTable,selectTarefaCategoria, select,selectCategoria, deleteTarefa,selectCategoriafilter } from "../../Database/database";
type DayProps = {
    dia: string,
    diasemana: string,
    onDayPress: (status: boolean) => void,
    isActive: boolean,
    key: number,
}
interface Props {
    text: string;
}
interface Categorias{
    categoria: string
}
interface InTarefas{
    id: number;
    titulo: string;
    descricao: string;
    dataInicio: Date;
    dataTermino: Date;
    categoria: string;
}
declare function alert(message: string): void;
  
const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const dataAtual = new Date();
const diaAtual = dataAtual.getDate();
const dias = Array.from({ length: 7 }, (_, i) => new Date(dataAtual.getFullYear(), dataAtual.getMonth(), diaAtual + i - dataAtual.getDay()));

export default function Definicoes({navigation}:any): JSX.Element{

    const [ modal, setModal] = useState<boolean>(false)
    const [activeDay, setActiveDay] = useState<number>(diaAtual);
    const [ horadeinicio, setHoradeinicio ] = useState('')
    const [ horadetermino, setHodadetermino ] = useState('')
    const [nome, setNome]= useState<string>('')
    const [descricao, setDescricao]= useState<string>('')
    const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');
    const [selectedEdit, setSelectedEdit] = useState<string>('');
    const [Categoriafilter, setCategoriafilter] = useState<string[] | any>([]);
    const [inicialize, setInicialize] = useState(new Date());
    const [termino, setTermino] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [isInicialize, setIsInicialize] = useState(false);
    const [ novaCategoria, setNovaCategoria] = useState<boolean>(false)
    const [ newCategoria, setNewCategoria] = useState<string>('')
    const [isLoadind, setIsLoading] = useState<boolean>(false)
    const [tarefaLoading, setTarefaloading] = useState<boolean>(false)
    const [detalhes, setDetalhes] = useState<boolean>(false)
    const [Editart, setEditart] = useState<boolean>(false)
    const [Tareasdetalhes, setTarefasDetalhes] = useState<any>([])
    const [tarefas, setTarefas] = useState([])
    const [  currentID, setCurrentId ]  = useState<number>(0)
    function DayFrid({dia, diasemana, isActive, onDayPress}: DayProps): JSX.Element {
        const [ today, setToday ] = useState<boolean>(false);
        useEffect(() => {
          if (dia == new Date().getDate().toString()) {
            setToday(true);
          }
        }, []);
        function changeday(){
            setTarefaloading(true)
            setSelectedCategoria('TODAS')
            onDayPress(!isActive)
            atualizzar()
        }
        return(
            <View style={styles.daygrid}>
                <Text style={styles.semana}>{diasemana}</Text>
                <TouchableOpacity 
                style={[
                    styles.addday, 
                    isActive && styles.dayative,
                    today && styles.todayBorder,
                ]} 
                onPress={changeday}>
                    <Text style={[styles.day, isActive && {color: '#00e0fd'}]}>{dia}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    function handleCreate() {
        setSelectedCategoria('TODAS')
        const selectedDate = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), activeDay);
        const selectedDayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const today = new Date();
        const todayDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
        if (selectedDayOfWeek < todayDayOfWeek) {
          alert('A data selecionada já passou e a tarefa não pode ser adicionada.');
        } else {
          setModal(true);
        }
    }
    function Detalhes(id: number, titulo: string, descricao: string, datainicio:Date, datatermino:Date, categoria:string){

        setDetalhes(true)
        setCurrentId(id)
        const Dados = {Titolu: titulo, Descricao: descricao, DataDeinicio: datainicio,DataDeTermino: datatermino, Categoria: categoria}
        setTarefasDetalhes(Dados)
        const datedeinicio = new Date(datainicio);
        const horainicio = datedeinicio.toLocaleString('pt-BR', {
            hour: 'numeric',
            minute: 'numeric',
        });
        const datedetermino = new Date(datatermino);
        const horatermino = datedetermino.toLocaleString('pt-BR', {
            hour: 'numeric',
            minute: 'numeric',
        });
    }
    const handleDateChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || (isInicialize ? inicialize : termino);
        setShowPicker(false);
        const selected = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), activeDay);
        const selectedDayOfWeek = selected.getDay();
        const today = new Date();
        const todayDayOfWeek = today.getDay();

        if (isInicialize) {

          const currentHour = new Date().getHours();
          const currentMinute = new Date().getMinutes();
          const selectedHour = currentDate.getHours();
          const selectedMinute = currentDate.getMinutes();
        
          if (selectedDayOfWeek> todayDayOfWeek){
            setInicialize(currentDate);
            setHoradeinicio(currentDate);
          }else{
            if (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute <= currentMinute)) {
                Alert.alert('Hora invalida', 'A hora de inicio precisa ser acima da hora atual.');
                return;
            } else {
            setInicialize(currentDate);
            setHoradeinicio(currentDate);
            }
          }
        } else {
          const startHour = inicialize.getHours();
          const startMinute = inicialize.getMinutes();
          const selectedHour = currentDate.getHours();
          const selectedMinute = currentDate.getMinutes();
      
          if (selectedHour < startHour || (selectedHour === startHour && selectedMinute <= startMinute)) {
            Alert.alert('Hora invalida', 'A hora selecionada precisa ser acima da hora de inicio.');
            return;
          } else {
            setTermino(currentDate);
            setHodadetermino(currentDate);
          }
        }
      };
      
      
      
    const handleInicializePress = () => {
        setIsInicialize(true);
        setShowPicker(true);
    };
    const formatTime = (date: any) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    const handleTerminoPress = () => {
        if (horadeinicio===""){
            Alert.alert('Hora invalida','A hora de término deve ser depois da hora de início.');
            return;
        }
        setIsInicialize(false);
        setShowPicker(true);
    };
    function fecharModal(){
        if(isLoadind){
            return;
        }
        setIsLoading(true)
        Alert.alert(
            'Fechar Tarefa',
            'Deseja Cancelar essa tarefa?',
            [
                {text: 'Não', onPress: () =>{setIsLoading(false),setModal(true)}, style: 'cancel'},
                {text: 'Sim', onPress: () =>{
                    setHoradeinicio('')
                    setHodadetermino('')
                    setDescricao('')
                    setNome('')
                    setSelectedEdit('')
                    setNewCategoria('')
                    setModal(false)
                    setEditart(false)
                    atualizzar()
              }},
            ]
        );
    }
    const handleDayPress = (day: number) => {
        setActiveDay(day);
    }
    const [Categorias, setCategorias]=useState<string[] | any>([])
    const handleCategoriaPress = (categoria: string) => {
        setTarefaloading(true)
        setSelectedCategoria(categoria);
        setSelectedEdit(categoria)
        selectTarefaCategoria(activeDay,categoria).then((dados:any)=>{
            if(categoria==="TODAS"){
                atualizzar()
                setTarefaloading(false)
            }else{
                setTarefas(dados)
                setTarefaloading(false)

            }
        })
    }
    function fecharcategoria(){
        Alert.alert('Fechar Categoria','Você deseja cancelar essa Categoria?',
        [
            {text:'Não', onPress: () => setNovaCategoria(true)},
            {text:'Sim', onPress: () => setNovaCategoria(false)}
        ])
    }

    function Tarefas(): JSX.Element {
        const TruncatedText: React.FC<Props> = ({ text }) => {
            const lines = text.split('\n', 6); // divide o texto em linhas
            const truncatedLines = lines.map(line => {
              if (line.length > 130) { // verifica se a linha tem mais de 130 caracteres
                return line.slice(0, 130) + '...'; // adiciona "..." se a linha for maior que 130 caracteres
              } else {
                return line;
              }
            });
            const truncatedText = truncatedLines.join('\n'); // junta as linhas com um caractere de quebra de linha
            return <Text style={{fontFamily:'noto', marginTop:10}}>{truncatedText}</Text>;
        };
        const TruncatedCatego: React.FC<Props> = ({ text }) => {
            const lines = text.split('\n', 1); // divide o texto em linhas
            const truncatedLines = lines.map(line => {
              if (line.length > 18) { // verifica se a linha tem mais de 130 caracteres
                return line.slice(0, 18) + '...'; // adiciona "..." se a linha for maior que 130 caracteres
              } else {
                return line;
              }
            });
            const truncatedText = truncatedLines.join('\n'); // junta as linhas com um caractere de quebra de linha
            return <Text style={{fontFamily:'noto', color:'#fff'}}>{truncatedText}</Text>;
        };
          
        
        if (tarefas && tarefas.length > 0) {
          return (
            <>
              {tarefas.map((tarefa: InTarefas, i) => {
                const dateinicio = new Date(tarefa.dataInicio);
                const horainicio = dateinicio.toLocaleString('pt-BR', {
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const datetermino = new Date(tarefa.dataTermino);
                const horatermino = datetermino.toLocaleString('pt-BR', {
                    hour: 'numeric',
                    minute: 'numeric',
                });
                const now = new Date().getTime();
                const termino = datetermino.getTime();
                const datadehoje =new Date().getDate()

                const isTerminado = termino < now && activeDay == datadehoje;
                return(
                    <View style={[styles.Tarefa,
                        isTerminado && { backgroundColor: '#424242' } ]} key={tarefa.id}>
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-between" }}
                        >
                            <Text
                            style={{
                                color: "#fff",
                                alignItems: "center",
                                fontFamily: "roboto-bold",
                                fontSize: 17,
                                maxWidth: "90%",
                            }}
                            >
                            {tarefa.titulo}
                            </Text>
                            <TouchableOpacity onPress={
                                ()=>Detalhes(
                                    tarefa.id,
                                    tarefa.titulo,
                                    tarefa.descricao,
                                    tarefa.dataInicio,
                                    tarefa.dataTermino,
                                    tarefa.categoria
                                    )
                            
                            }>
                                <Ionicons name="menu-outline" color="#fff" size={23} />
                            </TouchableOpacity>
                        </View>
                        <TruncatedText text={tarefa.descricao} />
                        <View
                            style={{
                            marginTop: 15,
                            width: "100%",
                            borderTopWidth: 1,
                            borderTopColor: "#fff",
                            flexDirection:'row',
                            justifyContent:'space-between'
                            }}
                        >
                            <Text style={{ fontFamily: "noto-bold", color: "#fff" }}>
                                {horainicio} : {horatermino}
                            </Text>
                            <TruncatedCatego text={tarefa.categoria.toLocaleUpperCase()}/>
                        </View>
                    </View>
                )
            })}
            </>
          );
        }
        setTarefaloading(false)
        return <></>;
    }
    async function handlesavetask(){
        if(Editart===true){
            setIsLoading(true)
            const HoursStart = inicialize.toLocaleTimeString('pt-BR',{
                hour:'numeric'
            }) 
            const HoursEnd = termino.toLocaleTimeString('pt-BR',{
                hour:'numeric'
            }) 
            const startHour = parseInt(HoursStart.split(':')[0]);
            const startMinute = parseInt(HoursStart.split(':')[1]);
            const endHour = parseInt(HoursEnd.split(':')[0]);
            const endMinute = parseInt(HoursEnd.split(':')[1]);

            if (startHour > endHour || (startHour === endHour && startMinute > endMinute)) {
                Alert.alert('Hora inválida', 'A hora de início deve ser antes da hora de término', [ {text:'Ok', onPress: ()=>setIsLoading(false)}]);
                return;
                }
            else{
                try{
                    const id = await updateTarefa(currentID, nome, descricao, inicialize, termino, selectedCategoria, activeDay);
                    Alert.alert('Tarefa Atualizada', 'A sua tarefa foi atualizada com sucesso',[{text:'OK', onPress: ()=> {
                        setHoradeinicio('')
                        setHodadetermino('')
                        setSelectedEdit('')
                        setDescricao('')
                        setNome('')
                        setNewCategoria('')
                        atualizzar()
                        setIsLoading(false)
                        setSelectedCategoria('TODAS')
                        selectTarefaCategoria(activeDay,selectedCategoria).then((dados:any)=>{
                            atualizzar()
                        })
                        setModal(false)
                        setEditart(false)
                    }}])
                }catch(erro){
                    console.log('erro ao atualizar:', erro)
                    atualizzar()
                }
            }
        }else{
            if(nome === "" || descricao==="" || horadeinicio==="" || horadetermino==="" || selectedCategoria==="TODAS"){
                alert('Todos os campos sao de caracter obrigatorio')
            }
            else{
                setIsLoading(true)
                createTable()
                try {
                    const id = await addTarefa(nome, descricao, inicialize, termino, selectedCategoria, activeDay);
                    Alert.alert('Tarefa salva', 'A sua tarefa foi salva com sucesso',[{text:'OK', onPress: ()=> {
                        setHoradeinicio('')
                        setHodadetermino('')
                        setDescricao('')
                        setNome('')
                        setModal(false)
                        setSelectedEdit('')
                        setNewCategoria('')
                        setSelectedCategoria('TODAS')
                        atualizzar()
                        setIsLoading(false)
                        selectTarefaCategoria(activeDay,selectedCategoria).then((dados:any)=>{
                            atualizzar()

                        })
                    }}])
                } catch (error) {
                    console.log('Erro ao adicionar tarefa:', error);
                    atualizzar()
                }
            }
        }
        console.log(`nome: ${nome}, Desciçao: ${descricao}, Data De inicio: ${inicialize}, Data de termino: ${termino}`)
    }
    function apagar(id:number){
        Alert.alert('Remover Tarefa', 'Desja remover essa tarefa?',[{
            text:'Não', onPress: ()=>{return;} ,style:'cancel',
        },
        {    text:'Sim', onPress: ()=>{
                deleteTarefa(id)
                atualizzar()
                setDetalhes(false)
                setSelectedCategoria('TODAS')

            } ,style:'destructive'
        }])
    }
    function fechardetalhes(){
        setDetalhes(false) 
        setCurrentId(0)
    }
    function editarTarefa(){
        const now = new Date();
        const termino = new Date(Tareasdetalhes.DataDeTermino);
        const datadehoje =new Date().getDate()

        const isTerminado = termino < now && activeDay == datadehoje;
        if(isTerminado){
            Alert.alert('Invalido','Voce nao pode editar essa tarefa')
        }else{

            setDetalhes(false)
            setEditart(true)
            setModal(true)
            setNome(Tareasdetalhes.Titolu)
            setDescricao(Tareasdetalhes.Descricao)
            setSelectedCategoria(Tareasdetalhes.Categoria)
            setNewCategoria(Tareasdetalhes.Categoria)
            setHoradeinicio(Tareasdetalhes.DataDeinicio)
            setHodadetermino(Tareasdetalhes.DataDeTermino)
        }
    }
    function atualizzar(){
        select(activeDay).then((dados: any) => {
            setTarefas(dados)
        });
        selectCategoria().then((dados: any) => {
            // Use a Set to keep track of unique categories
            const uniqueCategorias = new Set();
        
            // Loop through the data and add unique categories to the Set
            dados.forEach((item: any) => {
              uniqueCategorias.add(item.categoria);
            });
        
            // Convert the Set back to an array and set the state
            setCategorias(Array.from(uniqueCategorias));
            setIsLoading(false)
        });
        selectCategoriafilter(activeDay).then((dados: any) => {
            // Use a Set to keep track of unique categories
            const uniqueCategorias = new Set();
        
            // Loop through the data and add unique categories to the Set
            dados.forEach((item: any) => {
              uniqueCategorias.add(item.categoria);
            });
        
            // Convert the Set back to an array and set the state
            setCategoriafilter(Array.from(uniqueCategorias));
            setIsLoading(false)
        });
    }
    useEffect(() => {
        select(activeDay).then((dados: any) => {
            setTarefas(dados)
        });
        selectCategoriafilter(activeDay).then((dados: any) => {
            // Use a Set to keep track of unique categories
            const uniqueCategorias = new Set();
        
            // Loop through the data and add unique categories to the Set
            dados.forEach((item: any) => {
              uniqueCategorias.add(item.categoria);
            });
        
            // Convert the Set back to an array and set the state
            setCategoriafilter(Array.from(uniqueCategorias));
            setTarefaloading(false)
        });
        selectCategoria().then((dados: any) => {
            // Use a Set to keep track of unique categories
            const uniqueCategorias = new Set();
        
            // Loop through the data and add unique categories to the Set
            dados.forEach((item: any) => {
              uniqueCategorias.add(item.categoria);
            });
        
            // Convert the Set back to an array and set the state
            setCategorias(Array.from(uniqueCategorias));
            setTarefaloading(false)
        });
    },[activeDay]);
    // 9449f5e1-b441-49fd-8f63-013f1d9e03c0
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.add} onPress={handleCreate}>
                <Ionicons size={30} color='#fff' name="add"/>
            </TouchableOpacity>
            <View style={{backgroundColor:"#00e0fd", width:"100%", alignItems:'center', elevation:6}}>
                <View style={styles.header}>
                    <Text style={styles.text}>Tarefas</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate('Definicoes')}>
                    <Ionicons name="settings" size={26} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.calendar}>
                    {dias.map((day, i) => (
                    <DayFrid 
                        key={i} 
                        dia={`${day.getDate()}`} 
                        diasemana={`${diasDaSemana[i]}`} 
                        isActive={activeDay === day.getDate()} 
                        onDayPress={() => handleDayPress(day.getDate())}
                    />
                    ))}
                </View>
            </View>
            <View style={styles.categorias}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[
                            styles.categ,
                            selectedCategoria === 'TODAS' && styles.selectedCateg
                        ]}
                        onPress={() => handleCategoriaPress('TODAS')}
                    >
                        <Text style={[
                            styles.categText,
                            selectedCategoria === 'TODAS' && styles.selectedCategText
                        ]}>TODAS</Text>
                    </TouchableOpacity>
                    {
                        tarefaLoading ? (
                            <ActivityIndicator
                            color='#00e0fd'
                            size={22}
                            />
                        ) : (

                            Categoriafilter.map((catego: any, i:number) => (
                                <TouchableOpacity
                                    style={[
                                        styles.categ,
                                        selectedCategoria === catego && styles.selectedCateg
                                    ]}
                                    onPress={() => handleCategoriaPress(catego)}
                                    key={i}
                                >
                                    <Text style={[
                                        styles.categText,
                                        selectedCategoria === catego && styles.selectedCategText
                                    ]}>{catego.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))
                        )
                    }
                </ScrollView>
            </View>
            {
                tarefaLoading ? (
                    <View
                    style={{flexDirection:'column',justifyContent:'center', alignItems:'center',width:'100%', height:'50%'}}>
                        <ActivityIndicator
                        size={50}
                        color="#00e0fd"
                        />
                    </View>
                    )
                : tarefas && tarefas.length === 0 ?
                (
                    <View 
                    style={{flexDirection:'column',justifyContent:'center', alignItems:'center',width:'100%', height:'50%'}}>
                        <Text style={{fontSize:60}}>😪</Text>
                        <Text style={{fontFamily:'roboto-bold'}}>Esta data esta sem nenhuma tarefa definida</Text>
                    </View>
                ) :
                (
                    <ScrollView showsVerticalScrollIndicator={false} style={{width:'100%'}}>
                        <View style={{width:'100%', justifyContent:'center',alignItems:'center', marginBottom:70}}>
                            <Tarefas/>
                        </View>
                    </ScrollView>
                )
            }
            <Modal visible={novaCategoria} transparent>
                <TouchableOpacity 
                    style={styles.modalStyle}
                    onPress={fecharcategoria}
                >
                    <View style={{ width:'90%',backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                    <View style={styles.headermodel}>
                        {
                            Editart ? (

                                <Text style={{fontFamily:'noto-bold', fontSize:15}}>Aualizar Categoria</Text>
                            ) : (

                                <Text style={{fontFamily:'noto-bold', fontSize:15}}>Nova Categoria</Text>
                            )
                        }
                    </View>
                    <TextInput
                        value={newCategoria}
                        onChangeText={(e)=>setNewCategoria(e)} 
                        style={{borderWidth:2, height:40, borderRadius:5, padding:10, marginTop:10, fontFamily:'noto', marginBottom:10}}
                    />
                    <TouchableOpacity
                    onPress={()=>{setNovaCategoria(false)}} 
                    style={{height:40, alignItems:'center',elevation:4,borderRadius:5,backgroundColor:'#00e0fd', padding:10, marginTop:10, marginBottom:10}}>
                        <Text style={{fontFamily:'roboto-bold', fontSize:16,color:'#fff'}}>Salvar</Text>
                    </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
            <Modal
                visible={modal}
                animationType="fade"
                transparent={true}
                onRequestClose={fecharModal}
            >
                <TouchableOpacity
                    style={styles.modalStyle}
                    activeOpacity={1}
                    onPressOut={fecharModal}
                >

                    <TouchableOpacity
                    activeOpacity={1} 
                    onPress={()=>{return;}}
                    style={{ width:'90%',backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                        {
                            isLoadind ? 
                            (
                                <ActivityIndicator
                                    color="#00e0fd"
                                    size={40}
                                />
                            )  : 
                            (
                                <ScrollView>
                                    <View style={styles.headermodel}>
                                        <Text style={styles.modaltitle}>Nova Tarefa</Text>
                                        <TouchableOpacity onPress={fecharModal}>
                                        <Ionicons name="close" size={22}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.modalBody}>
                                        <Text style={{fontFamily:'noto'}}>Nome da tarefa</Text>
                                        <TextInput
                                        onChangeText={(e:any)=>setNome(e)}
                                        value={nome}  
                                        style={{borderWidth:2, height:40, borderRadius:5, padding:10, marginTop:10, fontFamily:'noto', marginBottom:10}}
                                        />
                                        <Text 
                                        style={{fontFamily:'noto'}}>Descrição da tarefa</Text>
                                        <TextInput
                                            onChangeText={(e:any)=>setDescricao(e)}
                                            value={descricao} 
                                            multiline={true}  
                                            style={{borderWidth:2, borderRadius:5, padding:10, marginTop:10, fontFamily:'noto'}}
                                        />
                                        <Text style={{fontFamily:'noto', marginTop:15}}>Categorias</Text>
                                        <View style={styles.categorias}>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{height:40, width:"100%"}}>
                                                {Categoriafilter.map((catego: any, i:number) => (
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.categ,
                                                            selectedCategoria === catego && styles.selectedCateg ||
                                                            selectedEdit === catego && styles.selectedCateg
                                                        ]}
                                                        onPress={() => handleCategoriaPress(catego)}
                                                        key={i}
                                                    >
                                                        <Text style={[
                                                            styles.categText,
                                                            selectedCategoria === catego && styles.selectedCategText ||
                                                            selectedEdit === catego && styles.selectedCategText
                                                        ]}>{catego.toUpperCase()}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                                {
                                                (Editart && newCategoria && newCategoria !== selectedCategoria) ? (
                                                    <TouchableOpacity
                                                        style={[
                                                        styles.categ,
                                                        selectedCategoria === newCategoria && styles.selectedCateg
                                                        ]}
                                                        onPress={() => handleCategoriaPress(newCategoria)}
                                                    >
                                                        <Text style={[
                                                        styles.categText,
                                                        selectedCategoria === newCategoria && styles.selectedCategText
                                                        ]}>{newCategoria}</Text>
                                                    </TouchableOpacity>
                                                ) :(!Editart) ?(
                                                    <TouchableOpacity
                                                        style={[
                                                        styles.categ,
                                                        selectedCategoria === newCategoria && styles.selectedCateg
                                                        ]}
                                                        onPress={() => handleCategoriaPress(newCategoria)}
                                                    >
                                                        <Text style={[
                                                        styles.categText,
                                                        selectedCategoria === newCategoria && styles.selectedCategText
                                                        ]}>{newCategoria}</Text>
                                                    </TouchableOpacity>
                                                ):(
                                                    <View></View>
                                                )
                                                }
                                                {
                                                    Editart && selectedEdit ? (
                                                    <TouchableOpacity
                                                        style={[
                                                        styles.categ,
                                                        selectedCategoria === newCategoria && styles.selectedCateg
                                                        ]}
                                                        onPress={() => handleCategoriaPress(newCategoria)}
                                                    >
                                                        <Text style={[
                                                        styles.categText,
                                                        selectedCategoria === newCategoria && styles.selectedCategText
                                                        ]}>{newCategoria}</Text>
                                                    </TouchableOpacity>
                                                    ) : (
                                                        <View></View>
                                                    )
                                                }
                                            </ScrollView>
                                            <TouchableOpacity style={styles.newcateg} onPress={()=> setNovaCategoria(true)}>
                                                <Ionicons name="add" color='#fff' size={20}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                                        <TouchableOpacity style={styles.Time} onPress={handleInicializePress}>
                                        <View>
                                            {
                                            horadeinicio ? (
                                                <Text>{new Date(horadeinicio).toLocaleTimeString('pt-BR',{hour:'numeric', minute:"numeric"})}</Text>
                                            ):(
                                                <Text>Hora de inicio</Text>
                                            )
                                            }
                                        </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.Time]} onPress={handleTerminoPress}>
                                        <View>
                                            {
                                                horadetermino ?(
                                                    <Text>{new Date(horadetermino).toLocaleTimeString('pt-BR',{hour:'numeric', minute:'numeric'})}</Text>
                                                ):(
                                                    <Text>Hora de Termino</Text>
                                                )
                                            }
                                        </View>
                                        </TouchableOpacity>

                                    </View>
                                    <TouchableOpacity 
                                    onPress={handlesavetask}
                                    style={{borderRadius:10,elevation:4,width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'#00e0fd', height:45, marginTop:20}}>
                                        {
                                            Editart ? (
                                                <Text style={{color:'#fff', fontFamily:'noto-bold', fontSize:17}}>
                                                    Atualizar
                                                </Text>
                                            ) : (
                                                <Text style={{color:'#fff', fontFamily:'noto-bold', fontSize:17}}>
                                                    Salvar
                                                </Text>
                                            )
                                        }
                                    </TouchableOpacity>
                                    {showPicker && (
                                        <DateTimePicker
                                        testID="dateTimePicker"
                                        value={isInicialize ? inicialize : termino}
                                        mode='time'
                                        is24Hour={true}
                                        onChange={handleDateChange}
                                        /> 
                                    )}
                                </ScrollView>
                            )
                        }
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            <Modal
                visible={detalhes}
            >
                <View style={{width:"100%",alignItems:"center", justifyContent:'center'}}>

                    <View style={{width:'95%',marginTop:20,alignItems:'center', flexDirection:'row',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'roboto-bold', fontSize:20}}>Detalhes da Tarefa</Text>
                        <View style={{flexDirection:"row",gap:20}}>
                            <TouchableOpacity onPress={fechardetalhes}>
                                <Ionicons  name='close' size={26}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{width:'95%'}} showsVerticalScrollIndicator={false}>
                        <Text style={{fontSize:18,fontFamily:'noto-bold', marginTop:20}}>
                            Titulo
                        </Text>
                        <View style={{width:'100%', marginTop:5,padding:15, backgroundColor:'#292929a3', borderRadius:5}}>
                            <Text style={{color:'#fff',fontFamily:'noto'}}>{Tareasdetalhes.Titolu}</Text>
                        </View>
                        <Text style={{fontSize:18,fontFamily:'noto-bold', marginTop:20}}>
                            Descriçao
                        </Text>
                        <View style={{width:'100%', padding:15,marginTop:5, backgroundColor:'#292929a3', borderRadius:5}}>
                            <Text style={{color:'#fff',fontFamily:'noto'}}>{Tareasdetalhes.Descricao}</Text>
                        </View>
                        <Text style={{fontSize:18,fontFamily:'noto-bold', marginTop:20}}>
                            Hora
                        </Text>
                        <View style={{width:'100%', padding:15, marginTop:5,backgroundColor:'#292929a3', borderRadius:5}}>
                            <Text style={{fontFamily:'noto',color:'#fff'}}>{
                            new Date(
                                Tareasdetalhes.DataDeinicio
                            ).toLocaleTimeString('pt-BR', {
                                hour: 'numeric',
                                minute: 'numeric',
                            })
                            } : {
                            new Date(Tareasdetalhes.DataDeTermino).toLocaleTimeString('pt-BR',{
                                hour:'numeric',
                                minute:'numeric'
                            })
                            }</Text>
                        </View>
                        <Text style={{marginTop:20,fontFamily:'noto-bold',fontSize:18}}>
                            Categoria
                        </Text>
                        <View style={{width:'100%', marginTop:5,padding:15, backgroundColor:'#292929a3', borderRadius:5}}>
                            <Text style={{color:'#fff', fontFamily:'noto'}}>{Tareasdetalhes.Categoria}</Text>
                        </View>
                        <TouchableOpacity
                        onPress={()=>apagar(currentID)} 
                        style={{justifyContent:'center', alignItems:'center',width:'100%', height:45, borderRadius:5, marginTop:20,backgroundColor:"#ff2828"}}
                        >
                            <Text style={{color:'#fff', fontFamily:'roboto-bold', fontSize:17}}>
                                Apagar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={editarTarefa}
                        style={{marginTop:10,marginBottom:30,justifyContent:'center', alignItems:'center',width:'100%', height:45, borderRadius:5, backgroundColor:"#00e0fd"}}
                        >
                            <Text style={{color:'#fff', fontFamily:'roboto-bold', fontSize:17}}>
                                Editar
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
            <StatusBar style="light"/>
        </View>
    )
}