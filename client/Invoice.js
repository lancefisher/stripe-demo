var React = require('react');
var PayButton = require('./PayButton');

var LineItem = React.createClass({
  render: function() {
    var lineItemModel = this.props.model;
    var price = (lineItemModel.priceInCents / 100).toFixed(2);

    return (
      <tr>
        <td>{lineItemModel.description}</td>
        <td className="price">{price}</td>
      </tr>
    );
  }
});

module.exports = React.createClass({
  handlePaid: function(res) {
    this.props.store.refresh(res.body.invoiceId);
  },

  render: function() {
    var invoice = this.props.model;
    var invoiceId = invoice.invoiceId;
    var lineItemModels = invoice.lineItems;
    var lineItems = lineItemModels.map(function(lineItem) {
      return (
        <LineItem model={lineItem} key={lineItem.orderIndex} />
      )
    });
    var displayTotal = (invoice.total / 100).toFixed(2);

    var user = invoice.user;
    var name = user.name
    var displayName = sentenceCase(name.title + ' ' + name.first + ' ' + name.last);

    var location = user.location;
    var street = sentenceCase(location.street);
    var city = sentenceCase(location.city);
    var state = sentenceCase(location.state);
    var zip = location.zip;
    var phone = user.phone;

    var description = 'Invoice #' + invoiceId

    var payment;
    if (invoice.status === 'paid') {
      payment = <div>Payment received. Thanks!</div>
    } else {
      payment = (
        <PayButton
          amount={invoice.total}
          name="Lance Fisher"
          description={description}
          invoiceId={invoiceId}
          onPaid={this.handlePaid}
        ></PayButton>
      )
    }

    return (
      <div>
        <h1>Invoice #{invoiceId}</h1>

        <h2>Bill To</h2>
        <p>
          {displayName}<br/>
          {street}<br/>
          {city}, {state} {zip}<br/>
          {phone}
        </p>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th className="price">Price</th>
            </tr>
          </thead>

          <tbody>
            {lineItems}
          </tbody>

          <tfoot>
            <tr>
              <th className="total">Total:</th>
              <td className="price">${displayTotal}</td>
            </tr>
          </tfoot>
        </table>

        <div>
          {payment}
        </div>
      </div>
    );
  }

});

function sentenceCase(s) {
    return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
