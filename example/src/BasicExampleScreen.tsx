import React from 'react';
import { HtmlScreenBase } from './HtmlScreenBase';

const html = `<h1>Basic Example</h1>
<p>test 123</p>
<p>alinea 2</p>
<h2>Titel</h2>
<img src="https://i.picsum.photos/id/250/272/92.jpg" width="272" height="90" />
<p>plaatje zonder width en height</p>
<img src="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png" />
<ul><li>test 123</li><li>test 456</li></ul>
<ol><li>woep woep</li><li>yeah </li></ol>
<h3>Kopje</h3>
<p>Hier is een stukje tekst en een <a href="https://www.google.com">link</a>. Grappig he?</p>
<ul><li>dubbel 1:<ul><li>a</li><li>b</li></ul></li><li>test 456</li></ul>
<img src="https://picsum.photos/seed/picsum/1200/800" />
`;

export const BasicExampleScreen: React.FC = () => {
  return (
    <HtmlScreenBase
      rawHtml={html}
      htmlViewProps={{
        htmlStyles: {
          // testing extra margin on image
          image: {
            // marginLeft: 20,
            // marginRight: 20,
          },
        },
      }}
    />
  );
};
