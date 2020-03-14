import React from 'react';
import { HtmlScreenBase } from './HtmlScreenBase';

const html = `<p>test 123</p>
<p>alinea 2</p>
<img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="272" height="90" />
<p>plaatje zonder width en height</p>
<img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" />
<ul><li>test 123</li><li>test 456</li></ul>
<ol><li>woep woep</li><li>yeah </li></ol>
<p>Hier is een stukje tekst en een <a href="https://www.google.com">link</a>. Grappig he?</p>`;

export const Example1Screen = () => {
  return <HtmlScreenBase rawHtml={html} />;
};
