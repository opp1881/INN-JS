import { getBackgroundImageUrl } from '../services/config';

function getLoadingPageStyle(): string {
  return `
    margin: -8px;
    background-image: url(${getBackgroundImageUrl()});
    background-size: cover;
    min-height: 700px;
    background-position-x: 50%;
    background-position-y: 0;
    background-attachment: scroll;
    background-color: #f3f9fc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: OpenSans-Regular,sans-serif;
    font-size: 1.3rem;
`;
}

/*
export default function LoadingPage(): HTMLElement {
  const div = document.createElement('div');
  div.setAttribute('class', 'intializing-container');
  div.setAttribute('style', getLoadingPageStyle());
  div.appendChild(document.createTextNode('Initializing session...'));
  return div;
}
*/

export default function LoadingPage(): string {
  const div = document.createElement('div');
  div.setAttribute('class', 'intializing-container');
  div.setAttribute('style', getLoadingPageStyle());
  div.appendChild(document.createTextNode('Initializing session...'));
  return "<div class='intializing-container' style='" + getLoadingPageStyle() + "'>Initializing session...</div>" ;
}

