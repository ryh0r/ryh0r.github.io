
function today() {
    let day = new Date().getDate();
    if (day < 10) {day = '0' + day};
    let month = new Date().getMonth()+1;
    if (month < 10) {month = '0' + month};
  return `${day}.${month}`;
}

function time(){
    let date = new Date();
      let day = date.getDate();
        if (day < 10) {day = '0' + day};
      let month = date.getMonth()+1;
        if (month < 10) {month = '0' + month};
      let hours = date.getHours();
        if (hours < 10) {hours = '0' + hours};
      let min = date.getMinutes();
        if (min < 10) {min = '0' + min};
      let fullDate = `${day}.${month}_${hours}.${min}`;
    return fullDate;
  }

  Array.prototype.itemSelect = function (question) {
    let mappedArray = this.map((item, index) => `
    ${index} - ${item}`);

    let result = prompt(question + mappedArray);
    return result;
  }

