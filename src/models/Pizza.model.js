class Pizza {
  constructor({ ingredients = [], name = '', price = 0, size = '' }) {
    this.name = name;
    this.ingredients = ingredients;
    this.price = price;
    this.size = size;
  }

  calculateTotalPriceWithIngredients = () => {
    const priceOnBaseSize = {
      small: { priceBase: 3, priceIngredients: 1 },
      medium: { priceBase: 5, priceIngredients: 1.1 },
      big: { priceBase: 7, priceIngredients: 1.2 }
    };
    this.name = this.createCustomName();
    const { priceBase, priceIngredients } = { ...priceOnBaseSize[this.size] };
    return (this.price = priceBase + this.calculatePriceOfIngredients(priceIngredients)).toFixed(2);
  };

  calculatePriceOfIngredients = priceIngredients => {
    return this.ingredients.reduce((total, { price }) => {
      total += price * priceIngredients;
      return total;
    }, 0);
  };

  createCustomName = () => {
    return this.ingredients.reduce((customName, { name }) => {
      customName += name;
      return customName;
    }, 'Custom');
  };
}
