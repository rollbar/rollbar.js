/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Rollbar = require('../src/react-native/rollbar');
var t = require('../src/react-native/transforms');

function TestClientGen() {
  var TestClient = function() {
    this.notifier = {
      addTransform: function() {
        return this.notifier;
      }.bind(this)
    };
    this.queue = {
      addPredicate: function() {
        return this.queue;
      }.bind(this)
    };
  };
  return TestClient;
}

function itemFromArgs(args) {
  var client = new (TestClientGen())();
  var rollbar = new Rollbar({autoInstrument: false}, client);
  var item = rollbar._createItem(args);
  item.level = 'debug';
  return item;
}

describe('handleItemWithError', function() {
  it('should create stackInfo', function(done) {
    var err = new Error('test');
    var args = ['a message', err];
    var item = itemFromArgs(args);
    var options = (new Rollbar({})).options;
    t.handleItemWithError(item, options, function(e, i) {
      expect(item.stackInfo.exception).to.eql({class: 'Error', message: 'test'});
      done(e);
    });
  });
});
describe('_matchFilename', function() {
  var filenames = {
    before: [
      '/var/mobile/Containers/Data/Application/1122ABCD-FF02-4942-A0D7-632E691D342F/.app/main.jsbundle',
      '/var/mobile/Containers/Data/Application/1122ABCD-FF02-4942-A0D7-632E691D342F/Library/Application Support/CodePush/2071980d74d1fef682fdab1d1cab345f33f498e3b51f68585c1b0b5469334df7/codepush_ios/main.jsbundle',
      '/data/user/0/com.example/files/CodePush/2071980d74d1fef682fdab1d1cab345f33f498e3b51f68585c1b0b5469334df7/codepush_android/index.android.bundle',
      'index.android.bundle'
    ],
    after: [
      'main.jsbundle',
      'main.jsbundle',
      'index.android.bundle',
      null
    ]
  }

  it('should rewrite filenames', function(done) {
    var options = (new Rollbar({})).options;
    console.log(options);

    var length = filenames.before.length;

    for(var i = 0; i < length; i++){
      var filename = t._matchFilename(filenames.before[i], options);
      expect(filename).to.eql(filenames.after[i]);
    }
    done();
  });
});
