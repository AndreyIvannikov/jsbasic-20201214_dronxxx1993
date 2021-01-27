export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    let indexOf = this.cartItems.findIndex((item) => {
      return product.id === item.product.id;
    });

    if (indexOf !== -1) {
      this.cartItems[indexOf].count++;
    } else {
      let obj = new Object();
      obj.count = 1;
      obj.product = product;
      this.cartItems.push(obj);
    }
    this.onProductUpdate(this.cartItems);
  }

  updateProductCount(productId, amount) {
    let indexOf = this.cartItems.findIndex((item) => {
      return productId === item.product.id;
    });

    amount > 0 ? this.cartItems[indexOf].count++ : this.cartItems[indexOf].count--;

    this.cartItems = this.cartItems.filter(item => {
      return item.count > 0;
    });
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
      if(item.count > 1) {
        price = price + (item.product.price * item.count);
      } else {
        price += item.product.price;
      }
    });
    return price;
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
  }
}

