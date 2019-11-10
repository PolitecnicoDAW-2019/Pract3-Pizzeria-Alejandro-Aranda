class PizzaController {
  constructor(view, pizzaService, shoppingCartService) {
    this.pizzaService = pizzaService;
    this.shoppingCartService = shoppingCartService;
    this.view = view;
    this.view.bindPizzaPre(this.handlePizzaPre).then(() => this.view.bindButtonPrice(this.handleAddNewPizzaPre));
  }
  handlePizzaPre = jsonPizza => {
    return this.pizzaService.readPizzaJson(jsonPizza);
  };

  handleAddNewPizzaPre = price => {
    return this.shoppingCartService.addNewPricePizza(price);
  };
}
