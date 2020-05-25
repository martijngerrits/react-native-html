import React from 'react';
import { HtmlScreenBase } from './HtmlScreenBase';

const html = `<h1>IFrame Example</h1>
<h3>Instagram with width and height specified:</h3>
<iframe width="320" height="440" src="https://instagram.com/p/a1wDZKopa2/embed" frameborder="0"></iframe>
<h3>Instagram with auto-height:</h3>
<iframe src="https://instagram.com/p/a1wDZKopa2/embed" frameborder="0"></iframe>
<h3>Youtube video with bigger sizes than viewport</h3>
<iframe src="https://www.youtube.com/embed/a8oEd0uimns" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
`;

export const IFrameExampleScreen: React.FC = () => {
  return <HtmlScreenBase rawHtml={html} />;
};
