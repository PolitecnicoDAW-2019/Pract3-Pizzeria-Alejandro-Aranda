class ShoppingCart {
  constructor() {
    this.ShoppingCart = [];
  }
  addNewPricePizza = pizza => {
    this.ShoppingCart = [...this.ShoppingCart, pizza];
    return this.calculateTotalPrice();
  };

  calculateTotalPrice = () => {
    return this.ShoppingCart.reduce((totalPrice, { price }) => {
      totalPrice += +price;
      return totalPrice;
    }, 0);
  };
  deletePizzaFromShoppingCart = pizza => {
    const found = this.findPizzaInShoppingCart(pizza);
    this.ShoppingCart.splice(this.ShoppingCart.indexOf(found), 1);
    return this.calculateTotalPrice();
  };
  findPizzaInShoppingCart = pizza => {
    return this.ShoppingCart.find(pizzasOfCart => JSON.stringify(pizza) === JSON.stringify(pizzasOfCart));
  };
}
