let fullData = {};
let funcData = [];
let functionArray = [addClass, addPayment, dailyReport, curResult, monthResult, log, end];

function addClass() {
 
  let curDate = prompt(`Какого числа было проведено занятие?`, `${today()}`);
  let bandNames = fullData.bands.map(band => band.name);
 let bandIndex = +bandNames.itemSelect('Какой бэнд?');

  let curBand = bandNames[bandIndex];
  let studentsList = fullData.bands[bandIndex].students.map(student => student.name);
  studentsList.push('были все');
  let curStudentsIndexes = studentsList.itemSelect('Кто присутствовал?').split(',').map(elem => +elem);
  let curStudents = [];
  if (curStudentsIndexes[0] == studentsList.length-1) {
    studentsList.pop();
    curStudents = [...studentsList];
  } else {
    curStudents = curStudentsIndexes.map((item) => studentsList[+item] );
  }
  let newClass = {date: [curDate], band: [curBand], students: [curStudents], cost: 40};
  if (curStudents.length == 3) {newClass.cost -= 5};
  if (curStudents.length > 4) {newClass.cost += 5};
  let dataCheck = confirm(`Проверьте данные:
  Дата: ${curDate}
  Бэнд: ${curBand}
  Участники: ${curStudents}
  Стоимость: ${newClass.cost}`);
  if (dataCheck) {
    fullData.classes.push(newClass);
    fullData.bands[bandIndex].classes.push({date: curDate, students: curStudents});
    for (let student of fullData.bands[bandIndex].students) {
      let index = fullData.bands[bandIndex].students.indexOf(student);
      if (curStudentsIndexes.includes(index)) {
        student.classes.push(curDate);
      }
    }
    fullData.salary +=newClass.cost;
    funcData.push(curDate,curBand,curStudents,newClass.cost);
  }
  else addClass();
};
function addPayment() {
  
  let curDate = prompt(`Когда оплатили?`, `${today()}`);
  let bandNames = fullData.bands.map(band => band.name);
  let bandIndex = +bandNames.itemSelect('Какой бэнд?');
  let curBand = bandNames[bandIndex];
  let studentNames = fullData.bands[bandIndex].students.map(student => student.name);
  let curStudentIndex = +studentNames.itemSelect('Кто оплатил?');
  let curStudent = studentNames[+curStudentIndex];
  let payment = +prompt('Сумма оплаты?', '100');
  let dataCheck = confirm(`Проверьте данные:
  Дата: ${curDate}
  Бэнд: ${curBand}
  Кто оплатил: ${curStudent}
  Сумма: ${payment}`);
  if (dataCheck) {
    let newPayment = {date: [curDate], band: [curBand], student: [curStudent], value: [payment]};
    fullData.payments.push(newPayment);
    fullData.bands[bandIndex].students[curStudentIndex].payments.push({date: [curDate], value: [payment] });
    funcData.push(curDate,curBand,curStudent,payment);
  }
  else addPayment();
};
function dailyReport() {
  let curDate = prompt(`За какое число нужен отчёт?`, `${today()}`);
  let dailyClasses = fullData.classes.filter(function(item) {return item.date == curDate});
  let classesList = dailyClasses.map(function(item) { return ` 
${item.band}
* ${item.students};
* ${item.cost}р
 `});
  let dailyPayments = fullData.payments.filter(function(item) {return item.date == curDate});
  let paymentsList = dailyPayments.map(item => `${item.student} ${item.value}`);
  let result = `${curDate}
${classesList}

* Оплаты: ${paymentsList}`
  alert(result);
   funcData.push(result);
  
};
function curResult() {
// текущий итог
  let classes = [];
  let totalClasses = 0;
  for (let band of fullData.bands) {
classes.push(`
  ${band.name} - ${band.classes.length}`);
totalClasses += band.classes.length;
  }
  classes.unshift(`
Всего занятий: ${totalClasses}`);
  let result = `
Промежуточный итог:
${classes}

Заработано: ${fullData.salary}`;
  alert(result);
  funcData.push(result);

};
function monthResult() {
  let months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  let curMonth = months[new Date().getMonth()];
  let year = new Date().getFullYear();
  let prices = [{price: '35р', num: 0}, {price: '40р', num: 0}, {price: '45р', num: 0}];
  let costs = fullData.classes.map(function(item){
    return item.cost;
  });
  for (let cost of costs) {
    for (let i = 0; i < prices.length; i++) {
      if (cost == prices[i]) {
        ++prices[i].num;
      }
    }
  }
  let totalClasses = costs.length;
  let result = [`${curMonth} итог:`, `Всего занятий: ${totalClasses}`, `Зарплата: ${fullData.salary}`].join('\r\n');
  let finalClasses = fullData.classes.map(function(item){
    return JSON.stringify(item);
  }).join('\r\n');

  const blob = new Blob([result, '\r\n', finalClasses], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${curMonth}_${year}_бэнды.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
  
  funcData.push(result);
  alert(result);  
};
function log() {
  let requests = fullData.requests.map(function(request){
    return JSON.stringify(request);
  }).join('\r\n');
  const blob = new Blob([requests], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Function log, ${time()}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
  main();
};
function end() {
    
  let jsonData = JSON.stringify(fullData);
  const blob = new Blob([jsonData], { type: "application/json" });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Journal ${time()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

function request(func) {
    if (func.name === 'end') func();
    else if (func.name === 'log') func();
    else {
      let date = new Date();
      let day = date.getDate();
        if (day < 10) {day = '0' + day};
      let month = date.getMonth()+1;
        if (month < 10) {month = '0' + month};
      let hours = date.getHours();
        if (hours < 10) {hours = '0' + hours};
      let min = date.getMinutes();
        if (min < 10) {min = '0' + min};
      let fullDate = `${day}.${month}, ${hours}:${min}`;
      func();
      let length = funcData.length;
      fullData.requests.push({date: [fullDate], func: [func.name], data: [funcData.splice(0, length)]});
      main();
    }
  };
function main() {
    let curFunc = prompt(`Какую функцию выполнить?
    0 - добавить занятие
    1 - добавить оплату
    2 - отчёт за день
    3 - текущий итог
    4 - итог за месяц
    5 - просмотр всех запросов
    6 - выйти`, '');
    if (curFunc === '') return;
    if (curFunc === null) return;
    request(functionArray[+curFunc]);
  };

document.getElementById('fileInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const contents = e.target.result;
    fullData = JSON.parse(contents.replaceAll('\n', ' ').replaceAll('\r', ' '));
    main();
    //document.getElementById('fileContent').textContent = JSON.stringify(fullData, null, 2);
  };
  reader.readAsText(file);
});