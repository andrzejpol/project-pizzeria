/* eslint-disable linebreak-style */

import {
  select,
  templates,
  classNames,
  settings
} from '../settings.js';
import utils from '../utils.js';

class Main {
  constructor(id, data) {
    const thisMain = this;

    thisMain.id = id;
    thisMain.data = data;

    thisMain.renderMainPage();
    thisMain.getElements();

    setInterval(function () {
      thisMain.carousel();
    }, thisMain.time);

  }

  getElements() {
    const thisMain = this;

    thisMain.content = thisMain.element.querySelector(select.containerOf.carousel).children;
    thisMain.mark = thisMain.element.querySelector(select.containerOf.mark).children;

    thisMain.time = settings.carouselTime.time;

    thisMain.repeat = 0;

  }

  carousel() {
    const thisMain = this;

    thisMain.repeat++;
    if (thisMain.repeat === 3) {
      thisMain.repeat = 0;
    }

    for (let content of thisMain.content) {
      content.classList.remove(classNames.carousel.content);
      // console.log('content', content);
    }

    for (let mark of thisMain.mark) {
      mark.classList.remove(classNames.carousel.mark);
      // console.log('mark', mark);
    }

    thisMain.content[thisMain.repeat].classList.add(classNames.carousel.content);
    thisMain.mark[thisMain.repeat].classList.add(classNames.carousel.mark);
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
