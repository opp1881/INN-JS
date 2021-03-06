import { PATH_1, PATH_2, STYLE } from './button-constants';
import { IButtonConfiguration } from '../types';

interface ITagOptions {
  id?: string;
  className?: string;
  text?: string;
  rel?: string;
  href?: string;
  target?: string;
}

function createSvgElement(type: string, options = {}): SVGElement {
  const element = document.createElementNS('http://www.w3.org/2000/svg', type);
  Object.keys(options).forEach(
    (key: string): void => {
      element.setAttribute(key, options[key]);
    }
  );
  return element;
}

function createLogo(): SVGElement {
  const svg = createSvgElement('svg', {
    width: '80',
    height: '38',
    viewBox: '0 0 130 50',
    class: 'inn-sso-logo'
  });

  const group = createSvgElement('g', {
    fill: 'none'
  });

  const path1 = createSvgElement('path', PATH_1);
  const path2 = createSvgElement('path', PATH_2);

  group.appendChild(path1);
  group.appendChild(path2);
  svg.appendChild(group);
  return svg;
}

function createTag(tagName: string, options: ITagOptions = {}): HTMLElement {
  const tag = document.createElement(tagName);
  if (options.className) {
    tag.setAttribute('class', options.className);
  }
  if (options.id) {
    tag.setAttribute('id', options.id);
  }

  if (options.text) {
    tag.innerText = options.text;
  }

  if (tagName === 'a') {
    if (options.rel) {
      (tag as HTMLAnchorElement).rel = options.rel;
    }
    if (options.href) {
      (tag as HTMLAnchorElement).href = options.href;
    }
  }
  return tag;
}

function appendStyle(parent: HTMLElement): void {
  parent.appendChild(
    createTag('style', {
      text: STYLE
    })
  );
}

function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(
      `Could not find container with id=${id} to append button to`
    );
  }
  return element;
}

export function addButtonTo(
  id: string,
  { buttonText, helpText, profileLink, profileLinkText }: IButtonConfiguration
): HTMLElement {
  const parent = getElementById(id);

  const buttonContainer = createTag('div', {
    className: 'inn-sso-button-container'
  });
  appendStyle(buttonContainer);

  const button = createTag('button', {
    id: 'inn-sso-button',
    className: 'inn-sso-button'
  });
  button.setAttribute('type', 'button');

  button.appendChild(createLogo());
  button.appendChild(createTag('span', { text: buttonText }));

  buttonContainer.appendChild(button);

  if (helpText) {
    const helpTextElement = createTag('p');
    helpTextElement.appendChild(createTextNode(helpText));

    if (profileLink && profileLinkText) {
      helpTextElement.appendChild(createTag('br'));
      helpTextElement.appendChild(
        createTag('a', {
          rel: 'noopener noreferrer',
          href: profileLink,
          target: '_blank',
          text: profileLinkText
        })
      );
    }

    buttonContainer.appendChild(helpTextElement);
  }

  parent.appendChild(buttonContainer);
  return button;
}
