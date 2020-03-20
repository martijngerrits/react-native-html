import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BasicExampleScreen } from './BasicExampleScreen';
import { ListIndicatorExampleScreen } from './ListIndicatorExampleScreen';
import { MainScreen } from './MainScreen';
import { RootStackParamList } from './RootStack';
import { CustomNodeExampleScreen } from './CustomNodeExampleScreen';
import { InternalLinkExampleScreen } from './InternalLinkExampleScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="BasicExample" component={BasicExampleScreen} />
        <Stack.Screen name="ListIndicatorExample" component={ListIndicatorExampleScreen} />
        <Stack.Screen name="CustomNodeExample" component={CustomNodeExampleScreen} />
        <Stack.Screen name="InternalLinkExample" component={InternalLinkExampleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
