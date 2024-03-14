/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var d = require('../src/browser/domUtility');

function fullElement() {
  return {
    tagName: 'DIV',
    id: 'myId',
    className: 'a b c',
    getAttribute: function (t) {
      return {
        type: 'theType',
        name: 'someName',
        other: 'otherAttr',
      }[t];
    },
  };
}

function genElement(tag, id, classes, type, name) {
  var elem = {
    tagName: tag,
    getAttribute: function (t) {
      return {
        type: type,
        name: name,
        other: 'otherAttr',
      }[t];
    },
  };
  if (id) {
    elem.id = id;
  }
  if (classes) {
    elem.className = classes;
  }
  return elem;
}

describe('isDescribedElement', function () {
  it('should match the type without subtypes', function () {
    var e = genElement('div', null, null, 'text');
    expect(d.isDescribedElement(e, 'div')).to.be.ok();
    expect(d.isDescribedElement(e, 'DIV')).to.be.ok();
    expect(d.isDescribedElement(e, 'span')).to.not.be.ok();
  });
  it('should work with subtypes', function () {
    var e = genElement('div', null, null, 'text');
    expect(d.isDescribedElement(e, 'div', ['input', 'text'])).to.be.ok();
    expect(d.isDescribedElement(e, 'div', ['input', 'nottext'])).to.not.be.ok();
    expect(d.isDescribedElement(e, 'div', [])).to.not.be.ok();
  });
  it('should work if element has no type', function () {
    var e = genElement('div');
    expect(d.isDescribedElement(e, 'div', ['input', 'text'])).to.not.be.ok();
    expect(d.isDescribedElement(e, 'div')).to.be.ok();
  });
});

describe('describeElement', function () {
  it('should include the id', function () {
    var elem = fullElement();
    var description = d.describeElement(elem);
    expect(description.id).to.eql('myId');
  });
  it('should have the right tag name', function () {
    var elem = fullElement();
    var description = d.describeElement(elem);
    expect(description.tagName).to.eql('div');
  });
});

describe('descriptionToString', function () {
  it('should be right', function () {
    var elem = fullElement();
    var desc = d.describeElement(elem);
    var str = d.descriptionToString(desc);
    expect(str).to.eql('div#myId.a.b.c[type="theType"][name="someName"]');
  });
});

describe('treeToArray', function () {
  it('should follow parent pointers', function () {
    var base = genElement('span', 'cool');
    base.parentNode = genElement('div', 'parent');
    var arr = d.treeToArray(base);
    expect(arr.length).to.eql(2);
  });
  it('should not stop before html tag', function () {
    var e1 = genElement('div', 'cool');
    var e2 = genElement('div', null, 'a b');
    var h = genElement('html');
    e1.parentNode = e2;
    e2.parentNode = h;
    var arr = d.treeToArray(e1);
    expect(arr.length).to.eql(2);
  });
  it('should cap out at 5 elements', function () {
    var e1 = genElement('div', 'cool');
    var e2 = genElement('div', null, 'a b');
    var e3 = genElement('div', null, 'a b');
    var e4 = genElement('div', null, 'a b');
    var e5 = genElement('div', null, 'a b');
    var e6 = genElement('div', null, 'a b');
    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;
    var arr = d.treeToArray(e1);
    expect(arr.length).to.eql(5);
  });
  it('should put the innermost element last', function () {
    var e1 = genElement('div', 'id1');
    var e2 = genElement('div', 'id2', 'a b');
    var e3 = genElement('div', 'id3', 'a b');
    var e4 = genElement('div', 'id4', 'a b');
    var e5 = genElement('div', 'id5', 'a b');
    var e6 = genElement('div', 'id6', 'a b');
    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;
    var arr = d.treeToArray(e1);
    expect(arr[4].id).to.eql('id1');
    expect(arr[0].id).to.eql('id5');
  });
});

describe('elementArrayToString', function () {
  it('should work with one element', function () {
    var e1 = { tagName: 'div', id: 'id1', classes: ['a', 'b'], attributes: [] };
    var arr = [e1];
    var res = d.elementArrayToString(arr);
    expect(res).to.eql('div#id1.a.b');
  });
  it('should work with two elements', function () {
    var e1 = { tagName: 'div', id: 'id1', classes: ['a', 'b'], attributes: [] };
    var e2 = {
      tagName: 'div',
      id: 'id2',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing' }],
    };
    var arr = [e1, e2];
    var res = d.elementArrayToString(arr);
    expect(res).to.eql('div#id1.a.b > div#id2.a.b.c[name="thing"]');
  });
  it('should truncate at 80 characters max without breaking within a element', function () {
    var e1 = { tagName: 'div', id: 'id1', classes: ['a', 'b'], attributes: [] };
    var e2 = {
      tagName: 'div',
      id: 'id2',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing2' }],
    };
    var e3 = { tagName: 'div', id: 'id3', classes: ['a', 'b'], attributes: [] };
    var e4 = {
      tagName: 'div',
      id: 'id4',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing4' }],
    };
    var arr = [e1, e2, e3, e4];
    var res = d.elementArrayToString(arr);
    expect(res).to.eql(
      '... > div#id2.a.b.c[name="thing2"] > div#id3.a.b > div#id4.a.b.c[name="thing4"]',
    );
  });
});

describe('everything', function () {
  it('should work with one element', function () {
    var e = genElement('div', 'id1');
    var description = d.descriptionToString(d.describeElement(e));
    var result = d.elementArrayToString(d.treeToArray(e));
    expect(description).to.eql(result);
  });
  it('should work with many elements', function () {
    var e1 = genElement('div', 'id1');
    var e2 = genElement('div', 'id2', 'a b', 'input');
    var e3 = genElement('div', 'id3', 'a b', null, 'thing');
    var e4 = genElement('div', 'id4', 'a b');
    var e5 = genElement('div', 'id5', 'a b');
    var e6 = genElement('div', 'id6', 'a b');

    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;

    var d1 = d.descriptionToString(d.describeElement(e1));
    var d2 = d.descriptionToString(d.describeElement(e2));
    var d3 = d.descriptionToString(d.describeElement(e3));
    var d4 = d.descriptionToString(d.describeElement(e4));
    var d5 = d.descriptionToString(d.describeElement(e5));
    var d6 = d.descriptionToString(d.describeElement(e6));

    var description = ['...', d4, d3, d2, d1].join(' > ');
    var result = d.elementArrayToString(d.treeToArray(e1));

    expect(description).to.eql(result);
  });
});
