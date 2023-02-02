import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AddButton from '../../components/AddButton';
import SetCard from '../../components/SetCard';
import { getExerciseInWorkout, updateExerciseInWorkout } from '../../hooks/useEditableWorkout';
import { NavigatorParamList } from '../DrawerNavigator';

type EditExercisePageProps = NativeStackScreenProps<NavigatorParamList, 'EditExercisePage'>;

export type Set = {
  key: number;
  reps: string;
  pre: string;
  orm: string;
};

// TODO: Append rests or sets, not just sets
const EditExercisePage: React.FC<EditExercisePageProps> = ({ route }) => {
  const { exerciseName, workoutId } = route.params;

  const [sets, setSets] = useState<Set[]>([]);

  const updateSet = async (key, property, val) => {
    const _sets = sets.map((set) => {
      if (set.key === key) {
        const _set = { ...set };
        _set[property] = val;
        return _set;
      }
      return set;
    });

    setSets(_sets);
    updateExerciseInWorkout(exerciseName, { name: exerciseName, sets: _sets }, workoutId);
  };

  const appendEmptySet = () => {
    setSets([...sets, { key: sets.length, reps: '', pre: '', orm: '' }]);
    // Doesn't update Supabase with empty sets
  };

  const reorderSets = (reorder: Set[]) => {
    setSets(reorder);
    updateExerciseInWorkout(exerciseName, { name: exerciseName, sets: reorder }, workoutId);
  };

  useEffect(() => {
    const fetchSets = async () => {
      const exercise = await getExerciseInWorkout(exerciseName, workoutId);
      setSets(exercise ? exercise.sets : []);
    };

    fetchSets().catch(console.error);
  }, []);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity accessibilityRole="button" onLongPress={drag} disabled={isActive}>
          <View className="py-2">
            <SetCard
              reps={item.reps}
              setReps={(val) => updateSet(item.key, 'reps', val)}
              pre={item.pre}
              setPre={(val) => updateSet(item.key, 'pre', val)}
              orm={item.orm}
              setOrm={(val) => updateSet(item.key, 'orm', val)}
            />
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <>
      <TouchableWithoutFeedback accessibilityRole="button" onPress={Keyboard.dismiss}>
        <View className="h-full p-10 px-5">
          <DraggableFlatList
            data={sets}
            onDragEnd={({ data }) => reorderSets(data)}
            keyExtractor={(item) => '' + item.key}
            renderItem={renderItem}
          />
        </View>
      </TouchableWithoutFeedback>
      <AddButton onPress={() => appendEmptySet()} />
    </>
  );
};

export default EditExercisePage;
