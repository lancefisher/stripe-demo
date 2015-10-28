var React = require('react');

var Invoice = require('./Invoice');

exports.App = React.createClass({
  displayName: 'App',

  handleUpdate: function(invoice) {
    this.setState({ invoiceModel: invoice });
  },

  componentWillMount: function() {
    var store = this.props.invoiceStore;
    if (!store) return;

    this.setState({ invoiceModel: null });

    var invoiceId = window.location.pathname.replace('/', '');
    store.find(invoiceId);
    store.onUpdate = this.handleUpdate;
  },

  render: function() {
    var model = this.state && this.state.invoiceModel;
    var store = this.props.invoiceStore;

    if (!model) return (
      <div>
        Loading...
      </div>
    );

    return (
      <div>
        <Invoice model={model} store={store} />
      </div>
    );
  }
});
