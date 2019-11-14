class PizzaService {
  constructor() {}
  readJson = json => fetch(json).then(response => response.json());
}
