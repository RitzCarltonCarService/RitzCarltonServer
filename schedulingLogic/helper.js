async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

function convertDateForMYSQL(date) {
    return date.getFullYear() + "-" + zeroPadded((date.getMonth() + 1)) + "-" + zeroPadded(date.getDate()) + " "
        + zeroPadded(date.getHours()) + ":" + zeroPadded(date.getMinutes()) + ":" + zeroPadded(date.getSeconds());
}

function zeroPadded(num) {
    num = num.toString();
    if (num.length < 2) {
        num = "0" + num;
    }
    return num;
}

module.exports = { asyncForEach, convertDateForMYSQL };