class PizzaController {
  constructor(view, pizzaService, shoppingCartService) {
    this.pizzaService = pizzaService;
    this.shoppingCartService = shoppingCartService;
    this.view = view;
    this.view.bindAddPizzaToShoppingCart(this.handlerAddNewPizza);
    this.view.bindPizzaPre(this.handlerPizzaPreConfigured);
    this.view.createIngredients(this.handlerIngredientsJson);
    this.view.bindChangeSize();
    this.view.bindAddPizzaCustom(this.handlerAddNewPizza);
    this.view.bindDeletePizzaFromShoppingCart(this.handlerDeletePizzaFromShoppingCart);
  }
  handlerPizzaPreConfigured = jsonPizza => {
    return this.pizzaService.readJson(jsonPizza);
  };

  handlerAddNewPizza = pizza => {
    return this.shoppingCartService.addNewPricePizza(pizza).toFixed(2);
  };

  handlerIngredientsJson = jsonIngredients => {
    return this.pizzaService.readJson(jsonIngredients);
  };

  handlerDeletePizzaFromShoppingCart = pizza => this.shoppingCartService.deletePizzaFromShoppingCart(pizza);
}
