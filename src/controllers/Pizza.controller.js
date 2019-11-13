class PizzaController {
  constructor(view, pizzaService, shoppingCartService) {
    this.pizzaService = pizzaService;
    this.shoppingCartService = shoppingCartService;
    this.view = view;
    this.view.bindAddPizzaToShoppingCart(this.handleAddNewPizza);
    this.view.bindPizzaPre(this.handlePizzaPre);
    this.view.createIngredients(this.handleIngredientsJson).then(() => this.view.bindIngredients());
    this.view.bindChangeSize();
    this.view.bindAddPizzaCustom(this.handleAddNewPizza);
    this.view.bindDeletePizzaFromShoppingCart(this.handlerDeletePizzaFromShoppingCart);
  }
  handlePizzaPre = jsonPizza => {
    return this.pizzaService.readJson(jsonPizza);
  };

  handleAddNewPizza = pizza => {
    return this.shoppingCartService.addNewPricePizza(pizza);
  };

  handleIngredientsJson = jsonIngredients => {
    return this.pizzaService.readJson(jsonIngredients);
  };

  handlerDeletePizzaFromShoppingCart = (pizza, shoppingCart) => this.shoppingCartService.deletePizzaFromShoppingCart(pizza);
}
