class Pizza {
  constructor(ingredients) {
    this.name;
    this.ingredients = ingredients;
    this.price = 0;
    this.size;
  }

  calculateTotalPrice = () => {
    const priceOnBaseSize = {
      noBase: { priceBase: 0, priceIngredients: 1 },
      small: { priceBase: 3, priceIngredients: 1 },
      medium: { priceBase: 5, priceIngredients: 1.1 },
      big: { priceBase: 7, priceIngredients: 1.2 }
    };
    this.setCustomName();
    return this.totalPrice(priceOnBaseSize[this.size]);
  };

  totalPrice = ({ priceBase, priceIngredients }) => {
    this.price = priceBase + this.calculateIngredients(priceIngredients);
    return this.price.toFixed(2);
  };

  calculateIngredients = priceIngredients => {
    return this.ingredients.reduce((total, { price }) => {
      total += price * priceIngredients;
      return total;
    }, 0);
  };

  setCustomName = () => {
    this.name = this.ingredients.reduce((customName, { name }) => {
      customName += name;
      return customName;
    }, 'Custom');
  };
}
