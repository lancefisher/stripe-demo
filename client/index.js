var React = require('react');

var App = require('./App').App;
var InvoiceStore = require('./InvoiceStore');
var invoiceStore = new InvoiceStore();

window.invoiceStore = invoiceStore;

React.render(
  <App invoiceStore={invoiceStore} />,
  document.getElementById('root')
);
