import { HtmlStyles } from '@react-native-html/renderer';

export const htmlStyles: HtmlStyles = {
  text: {
    fontSize: 18,
    lineHeight: 18 * 1.4,
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
  },
  paragraphAfterHeader: {
    marginTop: 0,
  },
  image: {
    marginVertical: 0,
  },
  list: {
    marginVertical: 5,
  },
  h1: {
    fontSize: 30,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
    lineHeight: 30,
  },
  h2: {
    fontSize: 26,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
    lineHeight: 26,
  },
  h3: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
    lineHeight: 24,
  },
  listItem: {
    marginVertical: 2,
  },
  listItemContent: {},
  table: {
    th: {
      padding: 20,
      backgroundColor: 'darkgrey',
      fontSize: 25,
      textAlign: 'left',
    },
    odd: {
      backgroundColor: 'lightgrey',
    },
  }
};
