import createElement from '../../assets/lib/create-element.js';

export default class ProductCard {
  constructor(product) {
    this._product = product;
    this._container = null;
    this._cardBtn = null;
    this._render();
  }

  _createCard() {
    return `
        <div class="card">
          <div class="card__top">
            <img src="../../assets/images/products/${this._product.image}" class="card__image" alt="product">
            <span class="card__price">€${this._product.price.toFixed(2)}</span>
          </div>
          <div class="card__body">
            <div class="card__title">${this._product.name}</div>
            <button type="button" class="card__button" data-id = ${this._product.id}>
              <img src="../../assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>
      `;
  }

  get elem() {
    return this._container;
  }

  _render() {
    this._container = createElement(this._createCard(this._product));
    this.listener();
  }

  listener() {
    this._cardBtn = this._container.querySelector('.card__button');
    this._cardBtn.addEventListener('click', this._onCardButtonClick);
  }

  _onCardButtonClick = (event) => {

    const customEvent = new CustomEvent("product-add", {
      detail: event.currentTarget.dataset.id,
      bubbles: true
    });
    this.elem.dispatchEvent(customEvent);
  }

}
