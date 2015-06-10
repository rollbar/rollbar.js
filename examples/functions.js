function functionA() {
  var a = b;

  try {
    var a = b;
  } catch(e) {
    Rollbar.error(e);
  }

  return a;
}

function functionB() {
  return functionA();
}

function functionC() {
  return functionB();
}
