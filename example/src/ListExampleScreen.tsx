import React from 'react';
import { HtmlScreenBase } from './HtmlScreenBase';

const rawHtml = `<ol class="bullets">
<li><b>Title 1:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
<li><b>Title 2:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
<li><b>Large Image 3:</b><div><img src="https://picsum.photos/seed/picsum/1200/800" /></div></li>
<li><b>Inline Large Image 4:</b><span><img src="https://picsum.photos/seed/picsum/1200/800" /></span></li>
<li><b>Title 5:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
<li><b>Title 6:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
<li><h3>Header Title 7:</h3> 
<p>another text containg <b>bold</b></p>
<ul>
    <li><b>Title 1:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
    <li><b>Title 2:</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
</ul>
</li>
</ol>
<div data-ga-id="auteur-blok" class="block block__author">
    <div class="row">
                    <div class="block__author--left">
                <a href="https://www.wikipedia.org">
                                            
    
            <img src="https://i.picsum.photos/id/200/400/400.jpg" />
    
                </a>
            </div>
        
        <div class="block__author--right">
            <h2 class="block__author__name">
                Author Name
            </h2>
                            <h2 class="block__author__function">
                    Job title
                </h2>
            
                            <p class="block__author__bio">
                    Author name is&nbsp;job title and job description
<br>
<br><b>Contact</b>
<br><a href="https://www.wikipedia.org" target="_blank" rel="noopener">Website</a>
<br><a href="https://www.instagram.com" target="_blank" rel="noopener">Instagram</a>
                </p>
                                        <h5 class="block__author__link">
                    <a href="https://www.wikipedia.org">Read everything about Author Name</a>
                </h5>
                    </div>
    </div>
</div>
`;

export const ListExampleScreen: React.FC = () => {
  return <HtmlScreenBase rawHtml={rawHtml} />;
};
