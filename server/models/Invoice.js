var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var request = require('superagent');

exports.register = function() {
  var invoiceSchema = new Schema({
    invoiceId: String,
    status: String,
    paidDate: Date,
    stripeChargeId: String,
    lineItems: [{
      description: String,
      priceInCents: Number,
      orderIndex: Number
    }],
    total: Number,
    user: {}
  });

  var Invoice = mongoose.model('Invoice', invoiceSchema);

  Invoice.createRandom = function(invoiceId, cb) {
    randomInvoice(function(err, invoice) {
      if (err) return cb(err);
      invoice.invoiceId = invoiceId;
      var newInvoice = new Invoice(invoice);
      newInvoice.save(function(err, saved) {
        if (err) return cb(err);
        return cb(null, saved);
      });
    });
  }
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pluckRandom(arr) {
  var index = getRandomIntInclusive(0, arr.length - 1);
  return arr[index];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function randomFood() {
  var foods = [
    'bacon', 'PBR', 'doughnut', 'burger with egg', 'chocolate', 'foie gras poutine', 'double IPA',
    'lamb cheeks', 'pork belly', 'bath chaps', 'deviled eggs', 'toast', 'bourbon', 'ramen',
    'burrito', 'mac-n-cheese', 'sushi', 'coffee', 'ice cream', 'gin', 'zucchini blossoms', 'pizza',
    'kombucha', 'meatloaf', 'pâté', 'flan', 'pickles', 'chicken and waffles', 'frisee', 'bone marrow',
    'ceviche', 'soda', 'cold brew coffee', 'Brussels sprouts', 'Kale', 'cocktail in a mason jar',
    'kimchi', 'tacos', 'ramps', 'arugala', 'green juice', 'cauliflower', 'lamb', 'cous cous',
    'quinoa', 'cave cheese', 'espresso'
  ];

  var adjectives = [
    'bacon-wrapped', 'pickled', 'upscaled', 'artisanal', 'food truck', 'small batch', 'homemade',
    'chicharrones', 'deep-fried', 'maple bacon', 'truffle oil', 'trout', 'Sriracha', 'broiled',
    'vegan', 'gluten-free', 'foraged', 'kimchi', 'home-brewed', 'craft', 'fancy', 'kale', 'local',
    'buckwheat', 'avacodo', 'aged', 'foie gras', 'fresh', ''
  ];

  var food = pluckRandom(foods);
  var adjective = pluckRandom(adjectives);

  return capitalizeFirstLetter((adjective + ' ' + food).trim());
}

function randomPriceInCents() {
  return getRandomIntInclusive(99, 2999);
}

function randomLineItem() {
  return {
    description: randomFood(),
    priceInCents: randomPriceInCents()
  }
}

function randomLineItems() {
  var count = getRandomIntInclusive(2, 6);
  var items = [];
  var lineItem;

  for (var i = 0; i < count; i++) {
    lineItem = randomLineItem();
    lineItem.orderIndex = i;
    items.push(lineItem);
  };

  return items;
}

function randomInvoice(cb) {
  request
  .get('https://randomuser.me/api/')
  .end(function(err, res) {
    if (err) return cb(error);

    var user = res.body.results[0].user;
    var lineItems = randomLineItems();
    var total = lineItems.reduce(function(previous, current) {
      return previous + current.priceInCents;
    }, 0);

    var invoice = {
      status: 'unpaid',
      paidDate: null,
      lineItems: lineItems,
      total: total,
      user: user,
      createdDate: new Date().toJSON()
    };

    return cb(null, invoice);
  });
}

// instead of require(./models/Invoice), use:
//   var Invoice = mongoose.model('Invoice');
// or
//   var Invoice = require('./models').Invoice
