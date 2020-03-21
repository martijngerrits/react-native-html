import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { HtmlParseAndView } from '@react-native-html/renderer';

import { htmlStyles } from './htmlStyles';

export const ParseUrlScreen = () => {
  const [url, setUrl] = useState('');
  const [cssClass, setCssClass] = useState<string | undefined>();
  const [rawHtml, setRawHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasScrollViewRef, setHasScrollViewRef] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const fetchAndParse = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const content = await response.text();

      setRawHtml(content);
    } catch (err) {
      Alert.alert('Error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>View and parse by url</Text>
      <View style={styles.inputContainer}>
        <TextInput placeholder="url" onChangeText={setUrl} />
        <TextInput placeholder="parse from css class" onChangeText={setCssClass} />
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
            scrollRef={scrollRef.current}
            parseFromCssClass={cssClass || undefined}
          />
        ) : (
          <Text>No content yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    marginVertical: 10,
    borderRadius: 10,
    padding: 5,
  },
  buttonLabel: {
    fontWeight: 'bold',
  },
});
