class PizzaService {
  constructor() {}
  readJson = json => {
    return fetch(json).then(response => {
      return response.json();
    });
  };
}
