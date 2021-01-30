import _createSlider from './create-slider.js';
import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this._container = null;
    this._steps = steps;
    this._value = value;
    this._sliderValue = null;
    this._sliderThumb = null;
    this._sliderProgress = null;
    this._slider = null;
    this.span = null;
    this.percent = null;
    this._render();
  }



  get elem () {
    return this._container;
  }

  _render() {
    this._container = createElement(_createSlider(this._steps, this._value));
    this._getElementsForListener();
    this._customStyle();
  }

  _customStyle() {
    const position = 100 / (this._steps - 1) * this._value;
    this._sliderProgress = this._container.querySelector('.slider__progress');
    this._sliderThumb = this._container.querySelector('.slider__thumb');
    this._sliderProgress.style.width = `${position}%`;
    this._sliderThumb.style.left = `${position}%`;
  }

  _getElementsForListener () {
    this._sliderValue = this._container.querySelector('.slider__value');
    this.click = null;
    this._sliderThumb = this._container.querySelector('.slider__thumb');
    this._sliderProgress = this._container.querySelector('.slider__progress');
    this.stepActive = this._container.querySelectorAll('.slider__steps span');
    this.stepActive[Number(this._sliderValue.innerHTML)].classList.add('slider__step-active');

    this._sliderThumb.ondragstart = () => false;
    this._addingEventListeners();
  }

  _addingEventListeners = () => {
    this._container.addEventListener('click', (event) => {
      this._calculateMousePosition(event);
      this._removeMouse();
    });

    this._sliderThumb.addEventListener('pointerdown', this.onMouseMove);
  }

  onMouseMove = () => {
    document.addEventListener('pointermove', this._calculateMousePosition);
    document.addEventListener('pointerup', this._removeMouse);
  }

  _calculateMousePosition = (event) => {
    this._container.classList.add('slider_dragging');
    const left = event.clientX - this._container.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    const segments = this._steps - 1;

    if (leftRelative < 0) {
      leftRelative = 0;
    }
    if (leftRelative > 1) {
      leftRelative = 1;
    }

    const approximateValue = leftRelative * segments;
    this._value = Math.round(approximateValue);
    this.percent = this._value / segments * 100;
    this._settingSliderStyles(leftRelative * 100);
  }

  _removeMouse = () => {
    this._container.classList.remove('slider_dragging');
    this._settingSliderStyles(this.percent);
    this._addedCustomEvents();
    this._sliderThumb.pointerdown = null;
    document.removeEventListener('pointermove', this._calculateMousePosition);
    document.removeEventListener('pointerup', this._removeMouse);
  }

  _settingSliderStyles = (valuePercents) => {
    this.stepActive.forEach((span) => {
      span.classList.remove("slider__step-active");
    });
    this.stepActive[[Number(this._value)]].classList.add("slider__step-active")
    this._sliderThumb.style.left = `${valuePercents}%`;
    this._sliderProgress.style.width = `${valuePercents}%`;
    this._sliderValue.innerHTML = this._value;
  }

  _addedCustomEvents = () => {
    const customEvent = new CustomEvent('slider-change', {
      detail: this._value,
      bubbles: true,
    });
    this._container.dispatchEvent(customEvent);
  }

}


