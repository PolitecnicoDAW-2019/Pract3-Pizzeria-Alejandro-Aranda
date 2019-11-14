class PizzaView {
  constructor() {
    document.getElementById('sizeChoice1').checked = false;
    document.getElementById('sizeChoice2').checked = false;
    document.getElementById('sizeChoice3').checked = false;
    this.pizza = new Pizza([]);
  }
  DOMPreConfigure = {
    pizzasPreConfigured: document.getElementById('PizzaPreConfigured')
  };
  DOMShoppingCart = {
    shoppingCart: document.getElementById('productList'),
    totalPriceShopping: document.getElementById('totalPrice')
  };
  DOMCustomPizza = {
    divIngredients: document.getElementById('ingredients'),
    sizesCustom: document.getElementsByClassName('sizeCustom'),
    priceCustom: document.getElementById('priceCustom'),
    buttonAdd: document.getElementById('addPizza'),
    panelIngredientsSelected: document.getElementById('ingredientsSelected'),
    panelCustom: document.getElementById('panelIngredients')
  };

  bindPizzaPre = handler => {
    return handler('data/PizzaPreConfigured.json').then(Json => {
      const pizzaMenu = Json.reduce((pizzas, { name, priceList, image }) => {
        const pizzaContent = document.createElement('div');
        pizzaContent.className = 'pizzaContent';
        this.createPizzaImage(pizzaContent, image);
        const pizzaName = document.createElement('p');
        pizzaName.textContent = name;
        pizzaContent.appendChild(pizzaName);
        pizzaContent.appendChild(this.createButtonsPrice(priceList, name));
        pizzas.appendChild(pizzaContent);
        return pizzas;
      }, document.createElement('div'));
      this.DOMPreConfigure.pizzasPreConfigured.appendChild(pizzaMenu);
    });
  };

  createPizzaImage = (pizzas, image) => {
    const pizzaImage = document.createElement('img');
    pizzaImage.src = image;
    pizzas.appendChild(pizzaImage);
  };

  bindAddPizzaToShoppingCart = handler => {
    this.addPizzaToShoppingCart = pizza => {
      this.DOMShoppingCart.totalPriceShopping.textContent = handler(pizza);
      const countPizza = this.existPizzaInShoppingCart(pizza);
      countPizza ? (countPizza.innerText = +countPizza.textContent + 1) : this.updateShoppingCart(pizza);
    };
  };
  bindDeletePizzaFromShoppingCart = handler => {
    this.deletePizzaFromShoppingCart = pizza => {
      this.DOMShoppingCart.totalPriceShopping.textContent = handler(pizza);
      const countPizza = this.existPizzaInShoppingCart(pizza);
      countPizza.textContent == 1 ? countPizza.parentElement.remove() : (countPizza.innerText = +countPizza.textContent - 1);
    };
  };
  createButtonsPrice = (priceList, name) => {
    return priceList.reduce((buttonWithPrice, { size, price }) => {
      const button = document.createElement('button');
      button.textContent = `${size}:${price}€`;
      button.className = 'buttonPrice';
      button.onclick = () => this.addPizzaToShoppingCart(new Pizza({ name: name, size: size, price: price }));
      buttonWithPrice.appendChild(button);
      return buttonWithPrice;
    }, document.createElement('div'));
  };

  existPizzaInShoppingCart = ({ name, size }) => {
    const pizzaList = document.getElementsByClassName('pizzaRow');
    const pizza = [...pizzaList].find(pizza => pizza.id === name + size);
    return pizza ? this.findPizzaCount(pizza) : pizza;
  };

  updateShoppingCart = pizza => {
    const pizzaRow = document.createElement('div');
    pizzaRow.id = `${pizza.name}${pizza.size}`;
    pizzaRow.className = 'pizzaRow';
    const pizzaCount = document.createElement('p');
    pizzaCount.textContent = '1';
    pizzaCount.id = 'pizzaCount';
    const pizzaPrice = document.createElement('p');
    pizzaPrice.textContent = `${pizza.price}€`;
    pizzaPrice.className = 'pizzaPrice';
    const pizzaName = document.createElement('p');
    pizzaName.textContent = pizza.name;
    pizzaName.className = 'pizzaName';
    const pizzaSize = document.createElement('p');
    pizzaSize.textContent = pizza.size;
    pizzaSize.className = 'pizzaSize';
    const buttonDeletePizza = document.createElement('button');
    buttonDeletePizza.textContent = 'X';
    buttonDeletePizza.onclick = () => this.deletePizzaFromShoppingCart(pizza);

    pizzaRow.appendChild(pizzaName);
    pizzaRow.appendChild(pizzaSize);
    pizzaRow.appendChild(pizzaPrice);
    pizzaRow.appendChild(pizzaCount);
    pizzaRow.appendChild(buttonDeletePizza);
    this.DOMShoppingCart.shoppingCart.appendChild(pizzaRow);
  };

  findPizzaCount = pizza => [...pizza.childNodes].find(({ id }) => id === 'pizzaCount');

  createIngredients = handler => {
    return handler('data/Ingredients.json').then(Json => {
      Json.reduce((listIngredients, ingredient) => {
        const checkBoxIngredient = document.createElement('input');
        checkBoxIngredient.type = 'checkbox';
        checkBoxIngredient.className = 'listIngredients';
        checkBoxIngredient.id = ingredient.name;
        checkBoxIngredient.onclick = () => this.AddOrDeleteIngredientsFromPizza(ingredient);
        const labelIngredients = document.createElement('label');
        labelIngredients.textContent = ingredient.name;
        listIngredients.appendChild(checkBoxIngredient);
        listIngredients.appendChild(labelIngredients);
        return listIngredients;
      }, this.DOMCustomPizza.divIngredients);
    });
  };
  bindChangeSize = () => {
    for (const size of this.DOMCustomPizza.sizesCustom) {
      size.addEventListener('click', () => {
        const sizeOfCustomPizza = [...this.DOMCustomPizza.sizesCustom].find(radioButtonsSize => radioButtonsSize.checked);
        this.pizza.size = sizeOfCustomPizza.value;
        this.DOMCustomPizza.priceCustom.textContent = this.pizza.calculateTotalPriceWithIngredients();
      });
    }
  };
  AddOrDeleteIngredientsFromPizza = ingredient => {
    const found = this.pizza.ingredients.find(({ name }) => name === ingredient.name);
    found
      ? this.pizza.ingredients.splice(this.pizza.ingredients.indexOf(found), 1)
      : (this.pizza.ingredients = [...this.pizza.ingredients, ingredient]);
    const priceOfCustomPizza = this.checkIfSomeRadioButtonIsChecked() ? this.pizza.calculateTotalPriceWithIngredients() : 0;
    this.DOMCustomPizza.priceCustom.textContent = priceOfCustomPizza;
    this.updatingIngredientsPizzaCustom(this.pizza.ingredients);
  };

  bindAddPizzaCustom = handler => {
    this.DOMCustomPizza.buttonAdd.addEventListener('click', () => {
      this.DOMShoppingCart.totalPriceShopping.textContent = handler(this.pizza);
      this.updateShoppingCart(this.pizza);
    });
  };

  checkIfSomeRadioButtonIsChecked = () => {
    return [...this.DOMCustomPizza.sizesCustom].some(size => size.checked);
  };

  updatingIngredientsPizzaCustom = ingredientsSelected => {
    document.getElementById('list').remove();
    const listPizzaIngredients = ingredientsSelected.reduce((_ingredientsSelected, { name }) => {
      const ingredientAdded = document.createElement('h5');
      ingredientAdded.textContent = name;
      _ingredientsSelected.appendChild(ingredientAdded);
      return _ingredientsSelected;
    }, document.createElement('div'));
    listPizzaIngredients.id = 'list';
    this.DOMCustomPizza.panelIngredientsSelected.appendChild(listPizzaIngredients);
  };
}
