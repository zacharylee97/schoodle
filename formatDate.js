module.exports = function formatDate(date) {
  console.log(typeof date);
  return [date.getMonth() + 1,
  date.getDate(),
  date.getFullYear()].join('-') + ' ' +
    [date.getHours(),
    date.getMinutes(),
    date.getSeconds()].join(':');
}
