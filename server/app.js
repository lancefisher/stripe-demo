var express = require('express');
var app = express.Router();
var Invoice = require('./models').Invoice;
var config = require('./config');
var stripe = require('stripe')(config.STRIPE_SECRET_KEY);

app.get('/api/invoice/:id', function(req, res) {
  var id = req.params.id;

  Invoice.find({ invoiceId: id }, function(err, invoices) {
    if (err) return res.status(500).send('Error finding invoice');

    var invoice = invoices[0]
    if (invoice) return res.send(invoice);

    Invoice.createRandom(id, function(err, invoice) {
      return res.send(invoice);
    });

  });
});

app.post('/api/invoice/:id/payment', function(req, res) {
  var id = req.params.id;

  // Look up the invoice
  Invoice.find({ invoiceId: id }, function(err, invoices) {
    if (err) return res.status(500).send('Error finding invoice');

    var invoice = invoices[0]
    if (!invoice) return res.status(404).send('Could not find invoice');

    // Make a payment with stripe
    console.log('token', req.body);
    var stripeToken = req.body.id;
    var descripton = 'Invoice #' + invoice.invoiceId;
    var amount = invoice.total;

    console.log('token', stripeToken);
    var charge = stripe.charges.create({
      amount: amount, // amount in cents
      currency: "usd",
      source: stripeToken,
      description: descripton
    }, function(err, charge) {
      if (err && err.type === 'StripeCardError') {
        // The card has been declined
        return res.send(err);
      }
      res.send(charge);
    });

  });

  // todo: mark the invoice as paid

});

module.exports = app;
