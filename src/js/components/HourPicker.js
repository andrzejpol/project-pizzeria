/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

import utils from '../utils.js';
import BaseWidget from './BaseWidget.js';
import {
  select,
  settings
} from '../settings.js';


class HourPicker extends BaseWidget {

  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.value = thisWidget.dom.input.value;

    thisWidget.dom.availabilityRangeSlider = document.querySelector('#availability');

    thisWidget.date = '2020-03-21';

    thisWidget.open = settings.hours.open;
    thisWidget.close = settings.hours.close;

    thisWidget.initPlugin();
  }

  updateBooking(booking) {
    const thisWidget = this;

    thisWidget.events = booking;
    // console.log('thisWidget.events', thisWidget.events);

    thisWidget.parseData();

  }

  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });
  }

  parseData() {
    const thisWidget = this;

    thisWidget.booked = thisWidget.events[thisWidget.date];
    // console.log('thisWidget.booked', thisWidget.booked);

    thisWidget.initTableAvailability();
  }

  initTableAvailability() {
    const thisWidget = this;

    thisWidget.tableAvailability = [];


    for (let i = thisWidget.open; i < thisWidget.close; i += 0.5) {
      // console.log('i', i);

      if (thisWidget.booked[i]) {
        thisWidget.booked[i].push[1];
      } else {
        thisWidget.booked[i] = [];
      }

      thisWidget.tableAvailability.push(thisWidget.booked[i].length);
    }
    // console.log('tableAvailability',thisWidget.tableAvailability);

    for (let i = 0; i < thisWidget.tableAvailability.length; i++) {
      const divRangeSlider = document.createElement('div');
      // console.log('div', divRangeSlider);
      divRangeSlider.classList.add('availability-div');
      if (thisWidget.tableAvailability[i] === 1 || thisWidget.tableAvailability[i] === 2) {
        divRangeSlider.classList.add('medium');
      } else if (thisWidget.tableAvailability[i] === 3) {
        divRangeSlider.classList.add('full');
      } else {
        divRangeSlider.classList.add('empty');
      }
      thisWidget.dom.availabilityRangeSlider.appendChild(divRangeSlider);
    }
  }

  parseValue(value) {
    const thisWidget = this;

    thisWidget.hours = utils.numberToHour(value);
    // console.log(thisWidget.hours); 
    // return set time value on slider

    return thisWidget.hours;
  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value;

    // console.log(thisWidget.dom.output.innerHTML);
    // return set time value on slider
  }
}

export default HourPicker;
