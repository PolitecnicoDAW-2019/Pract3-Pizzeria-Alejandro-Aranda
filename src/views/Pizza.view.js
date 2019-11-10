class PizzaView {
  constructor() {}
  DOMPreConfigure = {
    pizzaPreConfigure: document.getElementById('PizzaPreConfigure')
  };
  DOMShoppingCart = {
    shoppingCart: document.getElementById('productList'),
    totalPriceShopping: document.getElementById('totalPrice')
  };

  bindPizzaPre = handle => {
    return handle('data/PizzaPreConfigure.json').then(Json => {
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

  createButtonsPrice = (priceList, name) => {
    return priceList.reduce((buttonWithPrice, { size, price }) => {
      const button = document.createElement('button');
      button.textContent = `${size}:${price}€`;
      button.className = 'buttonPrice';
      buttonWithPrice.append(button);
      button.setAttribute('data-name', name);
      return buttonWithPrice;
    }, document.createElement('div'));
  };

  bindButtonPrice = handle => {
    const buttonsPizzaPrice = document.getElementsByClassName('buttonPrice');
    for (let item of buttonsPizzaPrice) {
      item.addEventListener('click', event => {
        const [size, price] = event.target.innerText.split(':');
        const priceWithOutEuros = price.slice(0, price.length - 1);
        const pizzaName = event.target.getAttribute('data-name');
        this.DOMShoppingCart.totalPriceShopping.textContent = handle(priceWithOutEuros);
        const countPizza = this.existPizzaInShoppingCart(`${pizzaName}${size}`);
        countPizza ? (countPizza.innerText = +countPizza.textContent + 1) : this.addPizzaToShoppingCart(pizzaName, size, priceWithOutEuros);
      });
    }
  };

  existPizzaInShoppingCart = dataName => {
    const pizzaList = document.getElementsByClassName('pizzaRow');
    const pizza = [...pizzaList].find(pizza => pizza.id === dataName);
    return pizza ? pizza.lastChild : pizza;
  };

  addPizzaToShoppingCart = (name, size, price) => {
    const pizzaRow = document.createElement('div');
    pizzaRow.id = `${name}${size}`;
    pizzaRow.className = 'pizzaRow';
    const pizzaCount = document.createElement('p');
    pizzaCount.textContent = '1';
    pizzaCount.id = 'pizzaCount';
    const pizzaPrice = document.createElement('p');
    pizzaPrice.textContent = `${price}€`;
    pizzaPrice.className = 'pizzaPrice';
    const pizzaName = document.createElement('p');
    pizzaName.textContent = name;
    pizzaName.className = 'pizzaName';
    const pizzaSize = document.createElement('p');
    pizzaSize.textContent = size;
    pizzaSize.className = 'pizzaSize';

    pizzaRow.append(pizzaName);
    pizzaRow.append(pizzaSize);
    pizzaRow.append(pizzaPrice);
    pizzaRow.append(pizzaCount);
    this.DOMShoppingCart.shoppingCart.append(pizzaRow);
  };
}
