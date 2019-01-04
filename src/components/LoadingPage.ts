const LOADING_PAGE_STYLE = `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: -8px;
    background-image: url(https://inn-qa-oidsso.opplysningen.no/oidsso/js/inn/inn-background.png);
    background-size: cover;
    min-height: 640px;
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

export default function LoadingPage(): HTMLElement {
  const div = document.createElement('div');
  div.setAttribute('class', 'intializing-container');
  div.setAttribute('style', LOADING_PAGE_STYLE);
  div.appendChild(document.createTextNode('Initializing session...'));
  return div;
}
