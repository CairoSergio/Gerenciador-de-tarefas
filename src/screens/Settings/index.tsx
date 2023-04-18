import React from 'react';
import { Button, View } from 'react-native';
import AlarmClock from 'react-native-alarm-clock';

const Alarm = () => {
  const setAlarm = async () => {
    const alarmTime = new Date();
    alarmTime.setHours(16);
    alarmTime.setMinutes(40);
    alarmTime.setSeconds(0);
    const alarmId = await AlarmClock.createAlarm(
      alarmTime.getTime().toString(),
      'Alarme tocando!',
    );
  
    console.log(`Alarme ${alarmId} criado com sucesso!`);
  };
  

  return (
    <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
      <Button
        title="Definir alarme"
        onPress={setAlarm}
      />
    </View>
  );
};

export default Alarm;
