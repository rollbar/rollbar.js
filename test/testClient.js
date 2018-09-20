// Test Helpers
function TestClientGen() {
  var TestClient = function() {
    this.transforms = [];
    this.predicates = [];
    this.notifier = {
      addTransform: function(t) {
        this.transforms.push(t);
        return this.notifier;
      }.bind(this)
    };
    this.queue = {
      addPredicate: function(p) {
        this.predicates.push(p);
        return this.queue;
      }.bind(this)
    };
    this.logCalls = [];
    var logs = 'log,debug,info,warn,warning,error,critical'.split(',');
    for (var i=0, len=logs.length; i < len; i++) {
      var fn = logs[i].slice(0);
      this[fn] = function(fn, item) {
        this.logCalls.push({func: fn, item: item})
      }.bind(this, fn)
    }
    this.options = {};
    this.payloadData = {};
    this.configure = function(o, payloadData) {
      this.options = o;
      this.payloadData = payloadData;
    };
  };

  return TestClient;
}

module.exports = TestClientGen;