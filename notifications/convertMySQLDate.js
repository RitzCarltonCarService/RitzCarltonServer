// This assumes that your MySQL server is outputting UTC dates 
// (which is the default, and recommended if there is no timezone component of the string

const convertMySQLDate = (date) => {
    // Replace all dashes with '/', then use Date.parse to create new parsed date, then convert it into a new UTC date
    return new Date(Date.parse(date.toString().replace(/[-]/g,'/')));
}

module.exports = { convertMySQLDate };