async function asyncForEach(array, callback) {
    let hasFoundResult = false;
    for (let index = 0; index < array.length; index++) {
      if (!hasFoundResult) {
        const result = await callback(array[index]);
        console.log(result);
        if (result) hasFoundResult = true;
        console.log("helper hasFound is " + hasFoundResult)
      }
      
    }
    console.log("helper function returning " + hasFoundResult);
    return hasFoundResult;
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