import React from 'react';
import { HtmlStyles } from '@react-native-html/renderer';

import { HtmlScreenBase } from './HtmlScreenBase';

const html = `
<h1>Table Example</h1>
<table>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Ernst Handel</td>
    <td>Roland Mendel</td>
    <td>Austria</td>
    <td>Roland Mendel</td>
    <td>Austria</td>
  </tr>
  <tr>
    <td>Island Trading</td>
    <td>Helen Bennett</td>
    <td>UK</td>
    <td>Helen Bennett</td>
    <td>UK</td>
  </tr>
  <tr>
    <td>Laughing Bacchus Winecellars</td>
    <td>Yoshi Tannamuri</td>
    <td>Canada</td>
    <td>Yoshi Tannamuri</td>
    <td>Canada</td>
  </tr>
  <tr>
    <td>Magazzini Alimentari Riuniti</td>
    <td>Giovanni Rovelli</td>
    <td>Italy</td>
    <td>Giovanni Rovelli</td>
    <td>Italy</td>
  </tr>
</table>
`;

// Some colorful example styling
const htmlStyles: HtmlStyles = {
  table: {
    th: {
      padding: '20px 20px 20px 5px',
      backgroundColor: 'orange',
      fontSize: 25,
      fontWeight: '100',
      textAlign: 'left',
    },
    td: {
      paddingHorizontal: 10,
    },
    odd: {
      backgroundColor: 'blue',
      color: 'white',
    },
    even: {
      backgroundColor: 'lightblue',
    }
  }
}

export const TableExampleScreen: React.FC = () => {
  return <HtmlScreenBase rawHtml={html} htmlViewProps={{ htmlStyles }} />;
};
