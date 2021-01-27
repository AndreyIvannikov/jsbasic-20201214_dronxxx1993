import createElement from '../../assets/lib/create-element.js';
import _createModal from './create-modal.js';

export default class Modal {
  constructor() {
    this._container = null;
    this._render();
  }

  _render() {
    this._container = createElement(_createModal());
    this.listener();
  }

  listener = () => {
    const modalBtnClose = this._container.querySelector('.modal__close');
    modalBtnClose.addEventListener('click', this.close);
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.close();
      }
    });
  }

  get elem () {
    return this._container;
  }

  setTitle(title) {
    this._container.querySelector('.modal__title').innerHTML = title;
  }

  setBody(node) {
    this._container.querySelector('.modal__body').append(node);
  }

  open() {
    document.body.appendChild(this._container);
    document.body.classList.add('is-modal-open');
  }

  close = () => {
    document.body.classList.remove('is-modal-open');
    this._container.remove();
  }
}
