/** Sorts an array of objects based on a property in those objects and returns them in ascending order.
 * Use array.reverse() to get descending order
 */
export const sortByProperty = (arrArg, prop) => arrArg.slice().sort((a, b) => {
  const propA = typeof a[prop] === 'string' ? a[prop].toLowerCase() : a[prop];
  const propB = typeof b[prop] === 'string' ? b[prop].toLowerCase() : b[prop];

  if (propA < propB) {
      return -1;
  }
  if (propA > propB) {
      return 1;
  }

  return 0;
});

export default {
  sortByProperty,
};
