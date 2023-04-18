import React, { useState, useEffect } from "react";
import { Modal, Text, TouchableOpacity, ScrollView , View, TextInput, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import DateTimePicker from '@react-native-community/datetimepicker';
import { addTarefa, createTable, select } from "../../Database/database";
import { StatusBar } from "expo-status-bar";
import Definicoes from "../Settings";
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

interface InTarefas{
  id: number;
  titulo: string;
  descricao: string;
  dataInicio: Date;
  dataTermino: Date;
  categoria: string;
}
declare function alert(message: string): void;

function DayFrid({dia, diasemana, isActive, onDayPress}: DayProps): JSX.Element {
  const [ today, setToday ] = useState<boolean>(false);
  useEffect(() => {
    if (dia == new Date().getDate().toString()) {
      setToday(true);
    }
  }, []);
  return(
    <View style={styles.daygrid}>
        <Text style={styles.semana}>{diasemana}</Text>
        <TouchableOpacity 
        style={[
          styles.addday, 
          isActive && styles.dayative,
          today && styles.todayBorder,
        ]} 
        onPress={() => onDayPress(!isActive)}>
          <Text style={[styles.day, isActive && {color: '#00e0fd'}]}>{dia}</Text>
        </TouchableOpacity>
    </View>
  )
}


const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const dataAtual = new Date();
const diaAtual = dataAtual.getDate();
const dias = Array.from({ length: 7 }, (_, i) => new Date(dataAtual.getFullYear(), dataAtual.getMonth(), diaAtual + i - dataAtual.getDay()));
export default function Home({navigation}: any): JSX.Element {
  const [activeDay, setActiveDay] = useState<number>(diaAtual);
  const [ modal, setModal] = useState<boolean>(false)
  const [show, setShow] = useState(false);
  const [termino2, setTermino2] = useState(new Date());
  const [ inicio2, setInicio2 ] = useState(new Date());
  const [ tarefinicio, setTarefaInicio ] = useState(new Date());
  // const [showInicio, setShowInicio] = useState(false);
  // const [isInicio, setIsInicio] = useState(false);
  const [ horadeinicio, setHoradeinicio ] = useState('')
  const [ horadetermino, setHodadetermino ] = useState('')
  const [nome, setNome]= useState<string>('')
  const [descricao, setDescricao]= useState<string>('')
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');
  const [ novaCategoria, setNovaCategoria] = useState<boolean>(false)
  const [ isloading, setIsloading] = useState<boolean>(false)
  const [tarefas, setTarefas] = useState([]);
  
  function Tarefas(): JSX.Element {
    const TruncatedText: React.FC<Props> = ({ text }) => {
      const truncated = text.length > 150 ? text.slice(0, 150)+'...' : text;
      return <Text style={{fontFamily:'noto', marginTop:10}}>{truncated}</Text>;
    };
    useEffect(() => {
      select().then((dados: any) => {
        setTarefas(dados);
      });
    }, []);
    if (tarefas && tarefas.length > 0) {
      return (
        <>
          {tarefas.map((tarefa: InTarefas, i) => (
            // setTarefaInicio(tarefa.dataInicio),
            // console.log(tarefinicio),
            // console.log(tarefa.dataInicio),
            <View style={styles.Tarefa} key={tarefa.id}>
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
                <TouchableOpacity>
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
                }}
              >
                <Text style={{ fontFamily: "noto-bold", color: "#fff" }}>
                  {tarefinicio.toString()}
                </Text>
                <Text>{tarefa.categoria}</Text>
              </View>
            </View>
          ))}
        </>
      );
    }
    return <></>;
  }
  const handleCategoriaPress = (categoria: string) => {
    setSelectedCategoria(categoria);
  }
  // const formatTime = (date: Date): string => {
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   return `${hours}  :  ${minutes}`;
  // }
  
  // const onChange = (event: any, selectedDate?: Date): void => {
  //   const currentDate = selectedDate || (isInicio ? inicio : termino);
  //   setShow(false);
  //   if (isInicio) {
  //     setInicio(currentDate);
  //     console.log(inicio)
  //   } else {
  //     setTermino(currentDate);
  //     console.log(termino)
  //   }
  //   // const currentDate = selectedDate || (showInicio ? inicio : termino);
  //   // const now = new Date();
  //   // const selectedHour = currentDate.getHours();
  //   // const selectedMinute = currentDate.getMinutes();
  //   // const currentHour = now.getHours();
  //   // const currentMinute = now.getMinutes();
  //   // setShow(false)
  //   // if (selectedDate && selectedHour < currentHour || selectedHour === currentHour && selectedMinute <= currentMinute) {
  //   //   alert('A hora selecionada deve ser maior do que a hora atual.');
  //   //   return;
  //   // }
  
  //   // if (showInicio) {
  //   //   setInicio(currentDate);
  //   //   setHoradeinicio(formatTime(currentDate));
  //   // } else if (showTermino) {
  //   //   if (!horadeinicio) {
  //   //     alert('Selecione a hora de início primeiro');
  //   //     return;
  //   //   }
  //   //   const selectedHour = currentDate.getHours();
  //   //   const selectedMinute = currentDate.getMinutes();
  //   //   const startHour = inicio.getHours();
  //   //   const startMinute = inicio.getMinutes();
  //   //   if (selectedHour < startHour || selectedHour === startHour && selectedMinute <= startMinute) {
  //   //     alert('A hora de término deve ser depois da hora de início.');
  //   //     return;
  //   //   }
  //   //   setTermino(currentDate);
  //   //   setHodadetermino(formatTime(currentDate));
  //   // }
  
  //   // setShow(false);
  // };
  
  const handleInicio = (): void => {
    // setIsInicio(true);
    setShow(true);
  };
  
  
  const handleTermino = (): void => {
    if(horadeinicio===''){
      alert('Coloque a hora de inicio primero')
    }else{
      // setIsInicio(false);
      setShow(true);
    }
  };
  const handleDayPress = (day: number) => {
    setActiveDay(day);
  }
  function handleCreate() {
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
  
  async function handlesavetask(){
    if(nome === "" || descricao==="" || horadeinicio==="" || horadetermino===""){
      alert('Todos os campos sao de caracter obrigatorio')
    }else{
      createTable()
      try {
        const id = await addTarefa(nome, descricao, inicio2, termino2, 'TODOS');
        console.log('Tarefa adicionada com id:', id);
        alert('Dados salcos com sucesso')
      } catch (error) {
          console.log('Erro ao adicionar tarefa:', error);
        }
      }
      console.log(`nome: ${nome}, Desciçao: ${descricao}, Data De inicio: ${horadeinicio}, Data de termino: ${horadetermino}`)
  }
  const Categorias = [
    'TODAS',
    'ESCOLA',
    'TRABALHO',
    'GYM',
    'TRABALHOS DOMESTICOS',
    'SERIES'
  ]
  function fecharModal(){
    setHoradeinicio('')
    setHodadetermino('')
    setModal(false)
  }
  function fecharcategoria(){
    setIsloading(true)
    setNovaCategoria(false)
  }
  const [inicialize, setInicialize] = useState(new Date());
  const [termino, setTermino] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isInicialize, setIsInicialize] = useState(false);

  const handleDateChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || (isInicialize ? inicialize : termino);
    setShowPicker(false);
    if (isInicialize) {
      setInicialize(currentDate);
    } else {
      setTermino(currentDate);
    }
  };

  const handleInicializePress = () => {
    setIsInicialize(true);
    setShowPicker(true);
  };

  const handleTerminoPress = () => {
    if (inicialize > termino) {
      alert('A hora de término deve ser depois da hora de início.');
      return;
    }
    setIsInicialize(false);
    setShowPicker(true);
  };

  const formatTime = (date: any) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return(
    <View style={styles.container}>
        <Modal visible={novaCategoria} transparent>
          <TouchableOpacity 
            style={styles.modalStyle}
            onPress={fecharcategoria}
          >
            <View style={{ width:'90%',backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
              <View style={styles.headermodel}>
                <Text style={{fontFamily:'noto-bold', fontSize:15}}>Nova Categoria</Text>
              </View>
              <TextInput style={{borderWidth:2, height:40, borderRadius:5, padding:10, marginTop:10, fontFamily:'noto', marginBottom:10}}/>
              <TouchableOpacity style={{height:40, alignItems:'center',elevation:4,borderRadius:5,backgroundColor:'#00e0fd', padding:10, marginTop:10, marginBottom:10}}>
                <Text style={{fontFamily:'roboto-bold', fontSize:16,color:'#fff'}}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
            {Categorias.map((categoria, i) => (
                <TouchableOpacity
                  style={[
                    styles.categ,
                    selectedCategoria === categoria && styles.selectedCateg
                  ]}
                  onPress={() => handleCategoriaPress(categoria)}
                  key={i}
                >
                  <Text style={[
                    styles.categText,
                    selectedCategoria === categoria && styles.selectedCategText
                  ]}>{categoria}</Text>
                </TouchableOpacity>
            ))}

          </ScrollView>
          <TouchableOpacity style={styles.newcateg} onPress={()=> setNovaCategoria(true)}>
            <Ionicons name="add" color='#fff' size={20}/>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{width:'100%'}}>
          <View style={{width:'100%', justifyContent:'center',alignItems:'center'}}>
            <Tarefas/>
          </View>
        </ScrollView>
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
            <View style={{ width:'90%',backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{height:40, marginTop:5}}>
                  <TouchableOpacity style={{paddingLeft:10,marginRight:15,paddingRight:10,justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:5, height:40}}>
                      <Text style={{fontFamily:'noto'}} >TODOS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{paddingLeft:10,marginRight:15,paddingRight:10,justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:5, height:40}}>
                      <Text style={{fontFamily:'noto'}} >TRABALHO</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{paddingLeft:10,marginRight:15,paddingRight:10,justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:5, height:40}}>
                      <Text style={{fontFamily:'noto'}} >GYM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{paddingLeft:10,marginRight:15,paddingRight:10,justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:5, height:40}}>
                      <Text style={{fontFamily:'noto'}} >FACULDADE</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:20}}>
                <TouchableOpacity style={styles.Time} onPress={handleInicializePress}>
                  <View>
                    {
                      horadeinicio ? (
                        <Text>{formatTime(horadeinicio)}</Text>
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
                        <Text>{formatTime(horadetermino)}</Text>
                      ):(
                        <Text>Hora de Termino</Text>
                      )
                    }
                  </View>
                </TouchableOpacity>

              </View>
              <TouchableOpacity style={{borderRadius:10,elevation:4,width:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'#00e0fd', height:45, marginTop:20}}>
                  <Text style={{color:'#fff', fontFamily:'noto-bold', fontSize:17}}>Salvar</Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={isInicialize ? inicialize : termino}
                  mode='time'
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                /> 
              )}
            </View>
          </TouchableOpacity>
        </Modal>
        <StatusBar style="light"/>
    </View>
  );
}