import React, { useState, useRef, RefObject } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { HtmlParseAndView, MinimalScrollView } from '@react-native-html/renderer';

import { htmlStyles } from './htmlStyles';

export const ParseUrlScreen: React.FC = () => {
  const [url, setUrl] = useState('');
  const [cssClass, setCssClass] = useState<string | undefined>();
  const [rawHtml, setRawHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasScrollViewRef, setHasScrollViewRef] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const fetchAndParse = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const content = await response.text();

      setRawHtml(content);
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>View and parse by url</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter url.."
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          style={styles.input}
        />
        <TextInput
          placeholder="Enter css class on html page (e.g., article__main)"
          onChangeText={setCssClass}
          autoCapitalize="none"
          style={styles.input}
        />
        <TouchableOpacity onPress={fetchAndParse} style={styles.button}>
          <Text style={styles.buttonLabel}>Parse and View</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator />}
      <ScrollView
        ref={instance => {
          setHasScrollViewRef(true);
          scrollRef.current = instance;
        }}
      >
        {!loading && rawHtml && hasScrollViewRef ? (
          <HtmlParseAndView
            rawHtml={rawHtml}
            htmlStyles={htmlStyles}
            scrollRef={(scrollRef as unknown) as RefObject<MinimalScrollView>}
            parseFromCssClass={cssClass || undefined}
            containerStyle={styles.htmlContainer}
          />
        ) : (
          <Text style={styles.noContent}>No content yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  htmlContainer: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  inputContainer: {
    margin: 20,
  },
  input: {
    marginVertical: 3,
  },
  button: {
    backgroundColor: 'lightblue',
    marginVertical: 10,
    borderRadius: 5,
    padding: 5,
    width: 150,
  },
  buttonLabel: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noContent: {
    marginHorizontal: 20,
  },
});
