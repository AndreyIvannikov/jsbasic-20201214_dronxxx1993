import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this._initialTopCoord = null;
    this.elem = null;
    this._render();
    this.addEventListeners();
  }
 
  _render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {

    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    if (!this._initialTopCoord) {
      this._initialTopCoord = this.elem.getBoundingClientRect().top + window.pageYOffset;
      this.leftIndent = Math.min(
        document.querySelector('.container').getBoundingClientRect().right + 20,
        document.documentElement.clientWidth - this.elem.offsetWidth - 10
      ) + 'px';
    }

    if (window.pageYOffset > this._initialTopCoord) {
      this._fixedPosition();
    } else {
      this._resetPosition();
    }

    if (document.documentElement.clientWidth <= 768) {
      this._resetPosition();
    }
  }

  _fixedPosition() {
    Object.assign(this.elem.style, {
      position: 'fixed',
      top: `50px`,
      left: this.leftIndent });
  }

  _resetPosition() {
    Object.assign(this.elem.style, {
      position: '',
      top: '',
      left: ''
    });
  }
}
