import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import DoneButton from './DoneButton';
import Ionicon from '@expo/vector-icons/Ionicons';
import { EditableWorkout } from '../types/EditableWorkout';

import { deleteEditableWorkout } from '../hooks/useMyWorkouts';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import BlockActionsModal from './BlockActionsModal';


interface WorkoutBlockProps {
  editing?: string;
  workout: EditableWorkout;
  updateName: (payload: EditableWorkout) => Promise<void>;
  onPress: (w: EditableWorkout) => void;
  deleteName: (id:string) => Promise<void>;
}

const WorkoutBlock: React.FC<WorkoutBlockProps> = ({ id, editing, name: propName, updateName,onPress,deleteName }) => {
  const [name, setName] = useState<string>(propName);
  const [modalVisible, setModalVisible] = useState(false);
  if (editing === id) {
    return (
      <BlockContainer>
        <TextInput
          accessibilityLabel="Text input field"
          accessibilityHint="rename workout"
          autoFocus={true}
          placeholder="Enter workout name"
          className="flex-1"
          value={name}
          onChangeText={setName}
        />
        <DoneButton onPress={() => updateName({ ...workout, name })} />
      </BlockContainer>
    );
  }

  return (
    <BlockContainer>
      <TouchableOpacity
        accessibilityRole="button"
        className="flex h-full flex-1 flex-row items-center p-1"
        onPress={() => onPress(workout)}
        hitSlop={{ top: 20, bottom: 20, left: 20 }}
      >
        <Text className="text-base font-medium">{name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        className="flex h-full flex-row items-center justify-center p-1"
        hitSlop={{ top: 20, bottom: 20, right: 20 }}
      >
        
        <Ionicon onPress={()=> setModalVisible(true)} name="ellipsis-horizontal" size={16} />
          <GestureHandlerRootView style={{ flex: 1 }}>
        
            <View>
              <StatusBar style="light"/>
              {modalVisible && <BlockActionsModal deleteWorkout={()=>deleteName(id)}/>}
            </View>
          </GestureHandlerRootView>
      </TouchableOpacity>
    </BlockContainer>
  );
};

export default WorkoutBlock;
