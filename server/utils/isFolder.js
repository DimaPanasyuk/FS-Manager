module.exports = function(item) {
  return (item.indexOf('.') > -1) ? false : true;
};
