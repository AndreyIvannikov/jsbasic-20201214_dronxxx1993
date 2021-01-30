import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

const _createElementCard = () => {
  return `
  <div class="products-grid">
      <div class="products-grid__inner">

      </div>
  </div>
  `;
};

export default class ProductGrid {
  constructor(products) {
    this._products = products;
    this._container = null;
    this._filters = {};
    this._elemCard = createElement(_createElementCard());
    this.newArr = this._products;
    this._card = null;
    this._render();
  }

  get elem() {
    return this._container;
  }

  _select = (selector) => {
    return this._elemCard.querySelector(selector);
  }

  _render() {
    this._products.map((item) => {
      this._card = new ProductCard(item);
      this._select('.products-grid__inner').append(this._card.elem);
    }).join('');
    this._container = this._elemCard;
  }

  updateFilter(product) {

    this.newArr = this._products;

    for (let key in product) {
      if (!product[key]) {
        delete this._filters[key];
        break;
      } else {
        this._filters[key] = product[key];
      }
    }

    if (this._filters.category) {
      this._filterElement('category', 'category');
    }

    if (this._filters.maxSpiciness) {
      this._filterElement('spiciness', 'maxSpiciness');
    }

    if (this._filters.noNuts) {
      this._filterElement("nuts");
    }

    if (this._filters.vegeterianOnly) {
      this._filterElement('vegeterian');
    }

    this._select('.products-grid__inner').innerHTML = '';
    this.newArr.forEach(element => {
      this._card = new ProductCard(element);
      this._select('.products-grid__inner').append(this._card.elem);
    });
  }

  _filterElement = (category, filterCategory) => {
    this.newArr = this.newArr.filter(item => {
      if (category === 'spiciness') { return item[category] <= this._filters[filterCategory]; }
      if (category === 'nuts') { return !item.hasOwnProperty("nuts") || !item.nuts; }
      return filterCategory ? item[category] === this._filters[filterCategory] : !!item[category];
    });
  }

}
