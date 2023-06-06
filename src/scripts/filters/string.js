
export const ucfirst = value => 
  `${value.charAt(0).toUpperCase()}${value.substring(1)}`


export const upcase = value =>
  value.split(' ').map(word => ucfirst(word)).join(' ')

export const unhandleize = value =>
  upcase(value.replace(/-/g, ' '))

export const handleize = (value, showSymbols = true) => {
  const regexStr = `([A-Z]|[a-z]|[0-9]${showSymbols ? '|®|™' : ''})+`;
  return (
    value &&
    value
      .match(new RegExp(regexStr, 'g'))
      .map((word) => word.toLowerCase())
      .join('-')
  );
};

// handlize w/o lowercase step
export const normalize = value => 
  value &&
  value
    .match(/([A-Z]|[a-z]|[0-9]|®|™)+/g)
    .join('-');

/**
 * Converts Number to pixel value
 * @param {Number} value numerical value representing pixels
 */
export const px = value => `${value}px`;