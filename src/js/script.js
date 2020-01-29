/* eslint-disable indent */
/* global Handlebars, utils, dataSource */

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    }
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();

      thisProduct.getElements();

      thisProduct.initAccordion();

      thisProduct.initOrderFrom();

      thisProduct.initAmountWidget();

      thisProduct.processOrder();

      console.log('new Product:', thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      // console.log('generated HTML:', generatedHTML);

      /* create element using utils.createElementFormHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);

    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;
      // console.log(thisProduct.element);
      /* find the clickable trigger (the element that should react to clicking) */
      // const clickableTrigger = thisProduct.element.querySelector('.product__header');
      // console.log(clickableTrigger);
      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function () {
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */

        /* find all active products */
        const activeProducts = document.querySelectorAll('.product.active');
        thisProduct.element.classList.toggle('active');
        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts) {
          /* START: if the active product isn't the element of thisProduct */
          activeProduct.classList.remove('active');
          /* remove class active for the active product */
        }

        /* END: click event listener to trigger */
      });
    }

    initOrderFrom() {
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      // console.log('initOrderFrom');
    }

    processOrder() {
      const thisProduct = this;
      // console.log('processOrder');

      /* [DONE] read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      // console.log('formData', formData);

      /* [DONE] set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;
      // console.log('price', price);

      /* [DONE] START LOOP: for each paramId in thisProduct.data.params */
      for (let paramId in thisProduct.data.params) {

        /* [DONE] save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
        // console.log('param', param);

        /* [DONE] START LOOP: for each optionId in param.options */
        for (let optionId in param.options) {

          /* [DONE] save the element in param.options with key optionId as const option */
          const option = param.options[optionId];
          // console.log('option', option);
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

          /* [DONE] START IF: if option is selected and option is not default */
          if (optionSelected && !option.default) {

            /* [DONE] add price of option to variable price */
            price += option.price;

            /* [DONE] END IF: if option is selected and option is not default */
          }
          /* [DONE] START ELSE IF: if option is not selected and option is default */
          else if (!optionSelected && option.default) {

            /* deduct price of option from price */
            price -= option.price;

            /* [DONE] END ELSE IF: if option is not selected and option is default */
          }

          const images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          // console.log('image', images);

          if (optionSelected) {
            for (let image of images) {
              image.classList.add(classNames.menuProduct.imageVisible);
            }
          } else {
            for (let image of images) {
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }

          /* [DONE] END LOOP: for each optionId in param.options */
        }

        /* [DONE] END LOOP: for each paramId in thisProduct.data.params */
      }

      /* [DONE] set the contents of thisProduct.priceElem to be the value of variable price */
      price *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
      //console.log('price', price);

    }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        thisProduct.processOrder();
      });
    }

  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);

      thisWidget.value = settings.amountWidget.defaultValue;
      console.log(thisWidget.input);
      thisWidget.setValue(thisWidget.input.value);

      thisWidget.initActions();

      //console.log('AmountWidget', thisWidget);
      //console.log('constructor arguments', element);
    }

    getElements(element) {
      const thisWidget = this;
      console.log(element);
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;

      const newValue = parseInt(value);

      /* TODO: Add validation */

      if (newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.announce();
      }

      thisWidget.input.value = thisWidget.value;
    }

    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function () {
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener('click', function () {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });

      thisWidget.linkIncrease.addEventListener('click', function () {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    announce() {
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }

  }

  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);

      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element) {
      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      console.log('1', thisCart.dom.toggleTrigger);
    }

    initActions() {
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        console.log('clicked');
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }
  }



  const app = {
    initMenu: function () {
      const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function () {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function () {
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };


  app.init();
}
