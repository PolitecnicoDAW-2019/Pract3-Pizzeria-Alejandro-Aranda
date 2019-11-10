class PizzaService {
  constructor() {}
  readPizzaJson = jsonPizza => {
    return fetch(jsonPizza).then(response => {
      return response.json();
    });
  };
}
