var request = require('superagent');

var InvoiceModel = function() {
  this.lineItems = [];
  this.total = 0;
  this.onUpdate = function() {};
};

var InvoiceStore = function() {};
InvoiceStore.prototype = {

  find: function(id) {
    var self = this;
    var url = '/api/invoice/' + id;

    request
      .get(url)
      .end(function(err, res) {
        if (err) return console.error(err);

        self.onUpdate(res.body);
      });
  },

};

module.exports = InvoiceStore;
