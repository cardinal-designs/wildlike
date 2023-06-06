
export const money = value => {
  let str = String(parseFloat(value) / 100);
  const strArray = str.split('.');
  str = new Intl.NumberFormat('en-US').format(parseInt(strArray[0]));
  if (strArray.length > 1) {
    str += `.${strArray[1]}`;
  }
  str += (str.indexOf('.') < 0) ? '.00' : '00';
  return `$${str.substring(0, str.indexOf('.') + 3)}`;
}

export const moneyWithoutDecimals = value => {
  const dollars = Math.ceil(parseFloat(value) / 100);
  const str = String(new Intl.NumberFormat('en-US').format(dollars));
  return '$' + str;
}