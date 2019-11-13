class PizzaView {
  constructor() {
    document.getElementById('sizeChoice1').checked = false;
    document.getElementById('sizeChoice2').checked = false;
    document.getElementById('sizeChoice3').checked = false;
    this.pizza = new Pizza([]);
  }
  DOMPreConfigure = {
    pizzaPreConfigure: document.getElementById('PizzaPreConfigure')
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
  listIngredients = [];
  ingredientsSelected = [];

  bindPizzaPre = handler => {
    return handler('data/PizzaPreConfigure.json').then(Json => {
      const pizzaMenu = Json.reduce((pizzasPre, { name, priceList, image }) => {
        const pizzaContent = document.createElement('div');
        pizzaContent.className = 'pizzaContent';
        this.createPizzaImage(pizzaContent, image);
        const pizzaName = document.createElement('p');
        pizzaName.textContent = name;
        pizzaContent.append(pizzaName);
        pizzaContent.append(this.createButtonsPrice(priceList, name));
        pizzasPre.append(pizzaContent);
        return pizzasPre;
      }, document.createElement('div'));
      this.DOMPreConfigure.pizzaPreConfigure.append(pizzaMenu);
    });
  };

  createPizzaImage = (pizzasPre, image) => {
    const pizzaImage = document.createElement('img');
    pizzaImage.src = image;
    pizzasPre.append(pizzaImage);
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
      +countPizza.textContent === 1 ? countPizza.parentElement.remove() : (countPizza.innerText = +countPizza.textContent - 1);
    };
  };
  createButtonsPrice = (priceList, name) => {
    return priceList.reduce((buttonWithPrice, { size, price }) => {
      const button = document.createElement('button');
      button.textContent = `${size}:${price}€`;
      button.className = 'buttonPrice';
      button.onclick = () => this.addPizzaToShoppingCart({ name: name, size: size, price: price });
      buttonWithPrice.append(button);
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
    buttonDeletePizza.textContent = 'Delete';
    buttonDeletePizza.onclick = () => this.deletePizzaFromShoppingCart(pizza);

    pizzaRow.append(pizzaName);
    pizzaRow.append(pizzaSize);
    pizzaRow.append(pizzaPrice);
    pizzaRow.append(pizzaCount);
    pizzaRow.append(buttonDeletePizza);
    this.DOMShoppingCart.shoppingCart.append(pizzaRow);
  };

  findPizzaCount = pizza => [...pizza.childNodes].find(({ id }) => id === 'pizzaCount');

  createIngredients = handler => {
    return handler('data/Ingredients.json').then(Json => {
      Json.reduce((listIngredients, ingredient) => {
        this.listIngredients = [...this.listIngredients, ingredient];
        const checkBoxIngredient = document.createElement('input');
        checkBoxIngredient.type = 'checkbox';
        checkBoxIngredient.className = 'listIngredients';
        checkBoxIngredient.id = ingredient.name;
        const labelIngredients = document.createElement('label');
        labelIngredients.append(ingredient.name);
        listIngredients.append(checkBoxIngredient);
        listIngredients.append(labelIngredients);
        return listIngredients;
      }, this.DOMCustomPizza.divIngredients);
    });
  };
  bindChangeSize = () => {
    for (const size of this.DOMCustomPizza.sizesCustom) {
      size.addEventListener('click', () => {
        const radio = [...this.DOMCustomPizza.sizesCustom].find(radioButtons => radioButtons.checked);
        this.pizza.ingredients = this.ingredientsSelected;
        this.pizza.size = radio.value;
        this.DOMCustomPizza.priceCustom.textContent = this.pizza.calculateTotalPrice();
      });
    }
  };
  bindIngredients = () => {
    const allIngredients = document.getElementsByClassName('listIngredients');
    for (const ingredient of allIngredients) {
      ingredient.addEventListener('click', () => {
        const selected = [...allIngredients].reduce((checkBoxsId, ingredient) => {
          return ingredient.checked ? [...checkBoxsId, ingredient.id] : checkBoxsId;
        }, []);
        this.ingredientsSelected = this.listIngredients.filter(ingredient => selected.includes(ingredient.name));
        this.pizza.ingredients = this.ingredientsSelected;
        const priceOfCustomPizza = this.checkIfSomeRadioButtonIsChecked() ? this.pizza.calculateTotalPrice() : 0;
        this.DOMCustomPizza.priceCustom.textContent = priceOfCustomPizza;
        this.updatingIngredientsPizzaCustom(selected);
      });
    }
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

  updatingIngredientsPizzaCustom = selected => {
    document.getElementById('list').remove();
    const listIngredients = selected.reduce((ingredientsSelected, ingredients) => {
      const ingredientAdded = document.createElement('h5');
      ingredientAdded.textContent = ingredients;
      ingredientsSelected.append(ingredientAdded);
      return ingredientsSelected;
    }, document.createElement('div'));
    listIngredients.id = 'list';
    this.DOMCustomPizza.panelIngredientsSelected.append(listIngredients);
  };
}
