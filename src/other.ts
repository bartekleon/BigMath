import { add, divide, exp, ln, multiply, power, sqrt, subtract } from './basic';
import { gt, lt } from './comparison';
import { ErrorConst, LOG2, PI2 } from './constants';
import { BigNumber, T } from './interfaces';
import { abs, DomainError, normalize, stringify } from './util';

/**
 * @returns Arithmetic–geometric mean of parameters
 */
export const AGM = (a: T, b: T): BigNumber => {
  a = normalize(a);
  b = normalize(b);
  if (a.sign || b.sign) {
    throw new DomainError(`AGM(${stringify(a)}, ${stringify(b)})`, 'arguments have to be positive');
  }
  while (true) {
    const c = normalize(a);
    const a1 = multiply(add(c, b), 0.5);
    if (lt(abs(subtract(a1, a)), ErrorConst)) {
      return a1;
    }
    a = a1;
    b = sqrt(multiply(c, b));
  }
};

/**
 * @returns Complete elliptic integral of the first kind
 */
export const K = (a: T): BigNumber => {
  a = normalize(a);
  if (`${a.number}`.length > Math.abs(a.comma)) {
    throw new DomainError(stringify(a), 'number from range [-1, 1]');
  }

  return divide(PI2, AGM(1, sqrt(subtract(1n, power(a, 2n)))));
};

/**
 * @returns Omega function (product logarithm)
 */
export const W = (a: T): BigNumber => {
  a = normalize(a);
  if (a.number === 0n) {
    return a;
  }
  let w = normalize('0.56714329040978387299996866221035554975381578');
  if (a.number === 1n && a.comma === 0 && !a.sign) {
    return w;
  }
  if (lt(a, divide(LOG2, -2n))) {
    throw new DomainError(stringify(a), 'number bigger than -log(2) / 2');
  }

  while (true) {
    const ex = exp(w);
    const wjewj = multiply(w, ex);
    const w1 = subtract(w, divide(subtract(wjewj, a), subtract(add(wjewj, ex), divide(multiply(add(w, 2n), subtract(wjewj, a)), multiply(add(w, 1n), 2n)))));
    if (lt(abs(subtract(w, w1)), ErrorConst)) {
      return w1;
    }
    w = w1;
  }
};

/**
 * @returns y for the equation: y = x ** y [y = x ** x ** x ** ...]
 */
export const XY = (a: T): BigNumber => {
  a = normalize(a);
  if (a.sign || a.number === 0n || gt(a, sqrt(2n))) {
    throw new DomainError(stringify(a), 'number bigger than 0 and less than sqrt(2)');
  }
  if (!a.sign && a.number === 1n && a.comma === 0) {
    return a;
  }
  a = ln(a);
  const b = normalize(a);
  b.sign = !b.sign;
  a = divide(W(b), a);
  a.sign = !a.sign;

  return a;
};
