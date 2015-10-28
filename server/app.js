var express = require('express');
var app = express.Router();
var Invoice = require('./models').Invoice;
var config = require('./config');

app.get('/api/invoice/:id', function(req, res) {
  var id = req.params.id;

  Invoice.find({ invoiceId: id }, function(err, invoices) {
    if (err) return res.status(500).send('Error finding invoice');

    var invoice = invoices[0]
    if (invoice) return res.send(invoice);

    Invoice.createRandom(id, function(err, invoice) {
      return res.send(invoice);
    })

  });
});

app.post('/api/invoice/:id/payment', function(req, res) {
  var invoiceId = req.params.id;
  if (!config.STRIPE_SECRET_KEY) {
    return res.status(500).send('STRIPE_SECRET_KEY environment variable is not set');
  }

  var response = {
    invoiceId: invoiceId
  }

  Invoice.find({ invoiceId: invoiceId }, function(err, invoices) {
    if (err) return res.status(500).send('Error finding invoice');
    var invoice = invoices && invoices[0];
    if (!invoice) return res.status(404).send('Invoice not found');

    // Pay the invoice...
    // See: https://stripe.com/docs/tutorials/charges
    var stripe = require('stripe')(config.STRIPE_SECRET_KEY);
    var token = req.body.token;
    var description = 'Invoice #' + invoiceId;

    var charge = stripe.charges.create({
      amount: invoice.total, // amount in cents, again
      currency: 'usd',
      source: token.id,
      description: description
    }, function(err, charge) {
      if (err) {
        response.err = err
        return res.send(response);
      }

      // Update our invoice
      invoice.stripeChargeId = charge.id;
      invoice.status = 'paid';
      invoice.paidDate = Date.now();
      invoice.save();

      response.charge = charge;
      response.status = 'success';
      return res.send(response);
    });

  });


});

module.exports = app;
