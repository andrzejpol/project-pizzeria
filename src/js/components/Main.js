/* eslint-disable linebreak-style */

import {
  select,
  templates
} from '../settings';
import utils from '../utils.js';

class Main {
  constructor(id, data) {
    const thisMain = this;

    thisMain.id = id;
    thisMain.data = data;

    thisMain.renderMainPage();
  }

  renderMainPage() {
    const thisMain = this;

    const generatedHTML = templates.mainPage(thisMain.data);
    // console.log('generated HTML:', generatedHTML);

    thisMain.element = utils.createDOMFromHTML(generatedHTML);

    const mainContainer = document.querySelector(select.containerOf.main);

    mainContainer.appendChild(thisMain.element);
  }
}

export default Main;
