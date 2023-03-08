/* eslint-disable react-native-a11y/has-valid-accessibility-ignores-invert-colors */
import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useMyEditableWorkouts } from '../hooks/useMyEditableWorkouts';
import { useAuth } from '../contexts/AuthProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DrawerWorkoutBlock from './blocks/DrawerWorkoutBlocks';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile } from '../utils/db/profiles';
import { ProfileType } from '../types';

const CustomDrawer = () => {
  const navigation = useNavigation();
  const { session } = useAuth();
  const { editableWorkouts, fetch } = useMyEditableWorkouts(session);
  const [userData, setUserData] = React.useState<ProfileType>({});

  //loads user profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(session);
      setUserData(data);
    };

    fetchProfile().catch(console.error);
  }, []);

  /**
   * on refresh, fetches profile data
   * + editable workouts and rerenders
   */
  const refresh = () => {
    if (fetch != undefined) {
      fetch();
    }
    getUserProfile(session)
      .then((data) => {
        setUserData(data);
      })
      .catch(console.error);
  };

  return (
    <View className="h-full w-full">
      {/**Banner + Profile Block */}
      <LinearGradient className="mb-3 h-32" colors={['#888787', '#9A9A9A', '#FFFFFF']}>
        <View className="flex h-full w-full flex-row border-b-2 border-neutral-300">
          <View className="my-auto">
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => {
                navigation.navigate('Profile');
              }}
            >
              <Image
                source={
                  userData.avatar_url
                    ? {
                        uri:
                          'https://veorawmuwkuyzbxadxgv.supabase.co/storage/v1/object/public/avatars/' +
                          session?.user.id +
                          '/' +
                          userData.avatar_url,
                      }
                    : require('../assets/genericProfilePic.jpg')
                }
                className="mt-4 ml-4 h-[70] w-[70] rounded-full"
              ></Image>
            </TouchableOpacity>
          </View>
          <View className="my-auto ml-2 flex flex-col">
            <Text className="mt-4 font-bebas text-lg text-neutral-700">
              {userData.full_name ? userData.full_name : 'NO NAME'}
            </Text>
            <View className="flex flex-row gap-1">
              <Text className="font-bebas text-[10px]">{userData.bodyweight + ' lbs'}</Text>
              <MaterialCommunityIcons name="weight-lifter" size={14} color="black" />
            </View>
          </View>
          <View className="flex h-full flex-grow flex-row justify-end ">
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => {
                refresh();
              }}
              className="m-3 flex flex-col justify-end"
            >
              <Ionicons name="refresh" size={20} color="#888787" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {/**END OF BANNER + PROF BLOCK */}
      {/** WORKOUT + EXERCISE BLOCKS */}
      <View className="flex w-full flex-col px-4">
        <View className="w-[100] border-b-2 border-neutral-300">
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              navigation.navigate('MyWorkoutsStack', {
                screen: 'MyWorkouts',
              });
            }}
          >
            <Text className=" font-bebas text-lg text-neutral-500">My Workouts</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {editableWorkouts.map((workout) => {
            return (
              <DrawerWorkoutBlock
                key={workout.id}
                editableWorkout={workout}
                editableWorkoutNavigate={(id, workoutName) => {
                  navigation.navigate('MyWorkoutsStack', {
                    screen: 'EditWorkoutPage',
                    params: {
                      editableWorkoutId: id,
                      editableWorkoutName: workoutName,
                      exerciseName: '',
                    },
                  });
                }}
                editableExerciseNavigate={(id, workoutName, exercise) => {
                  navigation.navigate('MyWorkoutsStack', {
                    screen: 'EditExercisePage',
                    params: {
                      editableWorkoutId: id,
                      editableWorkoutName: workoutName,
                      exerciseName: exercise,
                    },
                  });
                }}
              />
            );
          })}
        </ScrollView>
      </View>
      {/**END OF BANNER + PROF BLOCKS */}
    </View>
  );
};

export default CustomDrawer;

{
  /**

*/
}
