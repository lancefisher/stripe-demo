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
    });

  });
});



module.exports = app;
