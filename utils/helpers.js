export const amountReducer = (accumulator, currentValue) => accumulator + currentValue.Amount;

export const setMonth = (monthNumber) => {
  switch (monthNumber) {
    case '0':
      return 'Janurary';
    case '1':
      return 'February';
    case '2':
      return 'March';
    case '3':
      return 'April';
    case '4':
      return 'May';
    case '5':
      return 'June';
    case '6':
      return 'July';
    case '7':
      return 'August';
    case '8':
      return 'September';
    case '9':
      return 'October';
    case '10':
      return 'November';
    case '11':
      return 'December';
    default:
      break;
  }
};

export const sortDateDesc = (a, b) => new Date(b.Date) - new Date(a.Date);
export const sortDateAsc = (a, b) => new Date(a.Date) - new Date(b.Date);

export const getTransactions = (transactions, type) => {
  if (!transactions) return [];
  const itemsObject = {};
  transactions.forEach(expense => {
    const identifier = type === 'Month' ? new Date(expense.Date).getMonth() : expense[type];
    if (itemsObject[identifier]) {
      itemsObject[identifier].push(expense);
    } else {
      itemsObject[identifier] = [expense];
    }
  });

  return Object.entries(itemsObject).map(([key, val], i) => {
    const sum = val.reduce(amountReducer, 0);
    return { index: i, name: key, transactions: val, sum, quantity: val.length };
  });

};

export const formatDefaultTransactions = (transactions) => {
  if (!transactions) return [];
  const errs = [];
  transactions.forEach((row, i) => {
    if (!row.Amount || !row.Date) {
      if (!row.Amount && !row.Date) {
        errs.push({ msg: `Transaction on row ${i + 2} is missing both amount and date values.` });
      } else if (!row.Amount) {
        errs.push({ msg: `Transaction on row ${i + 2} is missing an amount value.` });
      } else if (!row.Date) {
        errs.push({ msg: `Transaction on row ${i + 2} is missing a date value.` });
      }
    }
    if (!row.Category) { row.Category = 'Uncategorized'; }
    if (!row.Description) { row.Description = ''; }
    if (!row.Account) { row.Account = 'No Account'; }
  });
  return { errors: errs, transactions };
};

export const calcMonthlyAverage = (transactions) => {
  let monthlyTotals = 0;
  transactions.forEach((month) => {
    monthlyTotals += month.sum;
  });
  return monthlyTotals / transactions.length || 0;
};

export const nameToSlug = (name) => name.replace(/\s/g, '-').toLowerCase();

export const calcSpendingTrend = (index, data) => {
  if (index === 0) return null;
  return (data[index].sum - data[index - 1].sum) / data[index - 1].sum;
};

export const formatArray = (array) => array.map(item => ({ ...item }));

export const encryptData = async (rawData) => {
  const encryptedResponse = await fetch('/api/encrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: rawData })
  });
  const encryptedData = await encryptedResponse.json();
  return encryptedData.encryptedTransactions;
};

export const decryptData = async (rawData) => {
  const decryptedResponse = await fetch('/api/decrypt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: rawData })
  });
  const decryptedData = await decryptedResponse.json();
  return decryptedData.decryptedTransactions.data;
};
