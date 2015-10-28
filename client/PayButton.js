var React = require('react');
var request = require('superagent');

var PayButton = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    this._stripeCheckout.open({
      name: this.props.name,
      description: this.props.description,
      amount: this.props.amount
    });
  },

  render: function() {
    var self = this;
    var invoiceId = this.props.invoiceId;

    this._stripeCheckout = StripeCheckout.configure({
      key: 'pk_test_F9yW3lJUdPOAW04nv60vEeQM', //todo: envify
      image: '/img/mcs-logo-128x128.png',
      locale: 'auto',
      token: function(token) {
        // todo: call the server, and pay the invoice
        // POST /api/invoice/:id/payment
        request
          .post('/api/invoice/' + invoiceId + '/payment')
          .send({token: token})
          .end(function(err, res) {
            if (self.props.onPaid) {
              self.props.onPaid(res);
            }
          });
      }
    });

    return (
      <div>
        <button onClick={this.handleClick}>Pay</button>
      </div>
    );
  }
});

module.exports = PayButton;
