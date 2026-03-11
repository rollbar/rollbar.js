import { expect } from 'chai';

import * as d from '../src/browser/domUtility.js';

interface Node {
  tagName: string;
  id?: string;
  className?: string;
  getAttribute: (t: string) => string;
  parentNode?: Node;
}

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

function genElement(
  tag,
  id = null,
  classes = null,
  type = null,
  name = null,
): Node {
  return {
    tagName: tag,
    id,
    className: classes,
    getAttribute: (t) =>
      ({
        type: type,
        name: name,
        other: 'otherAttr',
      })[t],
  };
}

describe('isDescribedElement', function () {
  it('should match the type without subtypes', function () {
    const e = genElement('div', null, null, 'text');
    expect(d.isDescribedElement(e, 'div')).to.be.ok;
    expect(d.isDescribedElement(e, 'DIV')).to.be.ok;
    expect(d.isDescribedElement(e, 'span')).to.not.be.ok;
  });
  it('should work with subtypes', function () {
    const e = genElement('div', null, null, 'text');
    expect(d.isDescribedElement(e, 'div', ['input', 'text'])).to.be.ok;
    expect(d.isDescribedElement(e, 'div', ['input', 'nottext'])).to.not.be.ok;
    expect(d.isDescribedElement(e, 'div', [])).to.not.be.ok;
  });
  it('should work if element has no type', function () {
    const e = genElement('div');
    expect(d.isDescribedElement(e, 'div', ['input', 'text'])).to.not.be.ok;
    expect(d.isDescribedElement(e, 'div')).to.be.ok;
  });
});

describe('describeElement', function () {
  it('should include the id', function () {
    const elem = fullElement();
    const description = d.describeElement(elem);
    expect(description.id).to.eql('myId');
  });
  it('should have the right tag name', function () {
    const elem = fullElement();
    const description = d.describeElement(elem);
    expect(description.tagName).to.eql('div');
  });
});

describe('descriptionToString', function () {
  it('should be right', function () {
    const elem = fullElement();
    const desc = d.describeElement(elem);
    const str = d.descriptionToString(desc);
    expect(str).to.eql('div#myId.a.b.c[type="theType"][name="someName"]');
  });
});

describe('treeToArray', function () {
  it('should follow parent pointers', function () {
    const base = genElement('span', 'cool');
    base.parentNode = genElement('div', 'parent');
    const arr = d.treeToArray(base);
    expect(arr.length).to.eql(2);
  });
  it('should not stop before html tag', function () {
    const e1 = genElement('div', 'cool');
    const e2 = genElement('div', null, 'a b');
    const h = genElement('html');
    e1.parentNode = e2;
    e2.parentNode = h;
    const arr = d.treeToArray(e1);
    expect(arr.length).to.eql(2);
  });
  it('should cap out at 5 elements', function () {
    const e1 = genElement('div', 'cool');
    const e2 = genElement('div', null, 'a b');
    const e3 = genElement('div', null, 'a b');
    const e4 = genElement('div', null, 'a b');
    const e5 = genElement('div', null, 'a b');
    const e6 = genElement('div', null, 'a b');
    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;
    const arr = d.treeToArray(e1);
    expect(arr.length).to.eql(5);
  });
  it('should handle elements without tag names', function () {
    const e1 = genElement(null);
    const arr = d.treeToArray(e1);
    expect(arr).to.eql([]);
  });
  it('should put the innermost element last', function () {
    const e1 = genElement('div', 'id1');
    const e2 = genElement('div', 'id2', 'a b');
    const e3 = genElement('div', 'id3', 'a b');
    const e4 = genElement('div', 'id4', 'a b');
    const e5 = genElement('div', 'id5', 'a b');
    const e6 = genElement('div', 'id6', 'a b');
    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;
    const arr = d.treeToArray(e1);
    expect(arr[4].id).to.eql('id1');
    expect(arr[0].id).to.eql('id5');
  });
});

describe('elementArrayToString', function () {
  it('should work with one element', function () {
    const e1 = {
      tagName: 'div',
      id: 'id1',
      classes: ['a', 'b'],
      attributes: [],
    };
    const arr = [e1];
    const res = d.elementArrayToString(arr);
    expect(res).to.eql('div#id1.a.b');
  });
  it('should work with two elements', function () {
    const e1 = {
      tagName: 'div',
      id: 'id1',
      classes: ['a', 'b'],
      attributes: [],
    };
    const e2 = {
      tagName: 'div',
      id: 'id2',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing' }],
    };
    const arr = [e1, e2];
    const res = d.elementArrayToString(arr);
    expect(res).to.eql('div#id1.a.b > div#id2.a.b.c[name="thing"]');
  });
  it('should truncate at 80 characters max without breaking within a element', function () {
    const e1 = {
      tagName: 'div',
      id: 'id1',
      classes: ['a', 'b'],
      attributes: [],
    };
    const e2 = {
      tagName: 'div',
      id: 'id2',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing2' }],
    };
    const e3 = {
      tagName: 'div',
      id: 'id3',
      classes: ['a', 'b'],
      attributes: [],
    };
    const e4 = {
      tagName: 'div',
      id: 'id4',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing4' }],
    };
    const arr = [e1, e2, e3, e4];
    const res = d.elementArrayToString(arr);
    expect(res).to.eql(
      '... > div#id2.a.b.c[name="thing2"] > div#id3.a.b > div#id4.a.b.c[name="thing4"]',
    );
  });
});

describe('everything', function () {
  it('should work with one element', function () {
    const e = genElement('div', 'id1');
    const description = d.descriptionToString(d.describeElement(e));
    const result = d.elementArrayToString(d.treeToArray(e));
    expect(description).to.eql(result);
  });
  it('should work with many elements', function () {
    const e1 = genElement('div', 'id1');
    const e2 = genElement('div', 'id2', 'a b', 'input');
    const e3 = genElement('div', 'id3', 'a b', null, 'thing');
    const e4 = genElement('div', 'id4', 'a b');
    const e5 = genElement('div', 'id5', 'a b');
    const e6 = genElement('div', 'id6', 'a b');

    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;

    const d1 = d.descriptionToString(d.describeElement(e1));
    const d2 = d.descriptionToString(d.describeElement(e2));
    const d3 = d.descriptionToString(d.describeElement(e3));
    const d4 = d.descriptionToString(d.describeElement(e4));
    const _d5 = d.descriptionToString(d.describeElement(e5));
    const _d6 = d.descriptionToString(d.describeElement(e6));

    const description = ['...', d4, d3, d2, d1].join(' > ');
    const result = d.elementArrayToString(d.treeToArray(e1));

    expect(description).to.eql(result);
  });
});
