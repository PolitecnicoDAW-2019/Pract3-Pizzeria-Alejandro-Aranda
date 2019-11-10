class ShoppingCart {
  constructor() {
    this.ShoppingCart = [];
  }
  addNewPricePizza = price => {
    this.ShoppingCart = [...this.ShoppingCart, +price];
    return this.calculateTotalPrice();
  };

  calculateTotalPrice = () => {
    return this.ShoppingCart.reduce((totalPrice, price) => {
      totalPrice += price;
      return totalPrice;
    }, 0);
  };
}
