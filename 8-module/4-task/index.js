import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';
// import '../../assets/styles/button.css';

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this._idElement = null;
    this._modalBody = null;
    this.addEventListeners();
    this._onSubmit = this._onSubmit.bind(this);
  }

  addProduct(product) {
    let indexOf = this.cartItems.findIndex((item) => {
      return product.id === item.product.id;
    });

    if (indexOf !== -1) {
      this.cartItems[indexOf].count++;
    } else {
      let productAndCount = {
        count: 1,
        product: product,
      };
      this.cartItems.push(productAndCount);
    }
    this.onProductUpdate(this.cartItems);
  }

  updateProductCount(productId, amount) {
    let indexOf = this.cartItems.findIndex((item) => {
      return productId === item.product.id;
    });

    if (amount > 0) {
      this.cartItems[indexOf].count++;
    } else {
      this.cartItems[indexOf].count--;
    }
    this.onProductUpdate(this.cartItems[indexOf]);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let count = 0;
    this.cartItems.forEach((item) => count += item.count);
    return count;
  }

  getTotalPrice() {
    let price = 0;
    this.cartItems.forEach((item) => {
      if (item.count > 1) {
        price = price + (item.product.price * item.count);
      } else {
        price += item.product.price;
      }
    });
    return price;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="../../assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="../../assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="../../assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this._modalBody = this.modal.elem.querySelector('.modal .modal__body');
    this.modal.setTitle('Your order');
    this.modal.open();
    this.cartItems.forEach(item => {
      return this.modal.setBody(this.renderProduct(item.product, item.count));
    });
    this.modal.setBody(this.renderOrderForm());

    this.$('.cart-form').onsubmit = this._onSubmit;

    this._modalBody.addEventListener('click', (event) => {
      let button = event.target.closest('button');
      if (!button) {return;}
      if (button.classList.contains('cart-counter__button')) {
        this._idElement = button.closest('.cart-product').dataset.productId;
        if (button.classList.contains('cart-counter__button_plus')) {
          this.updateProductCount(this.idElement, 1);
        } else if (button.classList.contains('cart-counter__button_minus')) {
          this.updateProductCount(this.idElement, -1);
        }
      }
    });
  }

  onProductUpdate(cartItem) {

    if (document.body.classList.contains('is-modal-open')) {

      if (cartItem.count === 0) {
        this.$(`[data-product-id="${this.idElement}"]`).remove();
        this.cartItems = this.cartItems.filter(item => {
          return item.count > 0;
        });
        this.cartIcon.update(this);
        if (this.isEmpty()) {
          this.modal.close();
        }
        return;
      }

      let price = cartItem.product.price * cartItem.count;
      this.$(`[data-product-id="${this.idElement}"] .cart-counter__count`).innerHTML = `${cartItem.count}`;
      this.$(`[data-product-id="${this.idElement}"] .cart-product__price`).innerHTML = `€${price.toFixed(2)}`;
      this.$(`.cart-buttons__info-price`).innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }
    this.cartIcon.update(this);
  }

  async onSubmit(event) {
    event.preventDefault();
    const form = this.$('.cart-form');
    this.$('button[type=submit]').classList.add('is-loading');
    let response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: new FormData(form),
    });
    if (response.ok) {
      await this.modal.setTitle('Success!');
      this.cartItems = [];
      this.cartIcon.update(this);
      this._modalBody.innerHTML = `<div class="modal__body-inner">
                                                <p>
                                                  Order successful! Your order is being cooked :) <br>
                                                  We’ll notify you about delivery time shortly.<br>
                                                  <img src="../../assets/images/delivery.gif">
                                                </p>
                                              </div>`;
    }
  }

  $ = (selector) => {
    return this._modalBody.querySelector(selector);
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

