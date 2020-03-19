import React from 'react';
import { HtmlScreenBase } from './HtmlScreenBase';

const html = `<h1>Basic Example</h1>
<p>test 123</p>
<p>alinea 2</p>
<h2>Titel</h2>
<img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="272" height="90" />
<p>plaatje zonder width en height</p>
<img src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png" />
<ul><li>test 123</li><li>test 456</li></ul>
<ol><li>woep woep</li><li>yeah </li></ol>
<h3>Kopje</h3>
<p>Hier is een stukje tekst en een <a href="https://www.google.com">link</a>. Grappig he?</p>
<ul><li>dubbel 1:<ul><li>a</li><li>b</li></ul></li><li>test 456</li></ul>
`;

export const BasicExampleScreen = () => {
  return <HtmlScreenBase rawHtml={html} />;
};
