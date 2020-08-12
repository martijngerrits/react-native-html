import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from './RootStack';

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
}

export const MainScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate('ParseUrl')}>
          <Text style={styles.touchableLabel}>Parse html by url</Text>
        </TouchableOpacity>
        <Text>Examples:</Text>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('BasicExample')}
        >
          <Text style={styles.touchableLabel}>Basic Example</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('ListIndicatorExample')}
        >
          <Text style={styles.touchableLabel}>List Indicator Example</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('CustomNodeExample')}
        >
          <Text style={styles.touchableLabel}>Custom Node Example</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('InternalLinkExample')}
        >
          <Text style={styles.touchableLabel}>Internal Link Example</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('ArticleExample')}
        >
          <Text style={styles.touchableLabel}>Article Example (Slower)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('CachedArticleExample')}
        >
          <Text style={styles.touchableLabel}>Cached Article Example (Faster)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('ListExample')}
        >
          <Text style={styles.touchableLabel}>List Example</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('IFrameExample')}
        >
          <Text style={styles.touchableLabel}>IFrame Example</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('TableExample')}
        >
          <Text style={styles.touchableLabel}>Table Example</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('CustomLinkHandlingExample')}
        >
          <Text style={styles.touchableLabel}>Custom Link Handling Example</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  touchable: {
    marginVertical: 20,
  },
  touchableLabel: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
