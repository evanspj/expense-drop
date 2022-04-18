import Dexie from 'dexie';
import { proxy } from 'valtio';
import { derive } from 'valtio/utils';
import { amountReducer, getTransactions, sortDateDesc, encryptData } from './utils/helpers';

export const state = proxy({
  transactions: [],
  session: null,
  selectedTransaction: null,
  selectedTransactions: null,
  sessionModal: false,
  addTransactionsModal: false,
  newSessionModal: false,
  editModal: false,
  bulkEditModal: false,
  downloadModal: false,
});

derive({
  totalExpenses: (get) => get(state).transactions.reduce(amountReducer, 0),
  accounts: (get) => getTransactions(get(state).transactions, 'Account').sort((a, b) => b.sum - a.sum),
  months: (get) => getTransactions(get(state).transactions, 'Month'),
  monthlyAverage: (get) => {
    let monthlyTotals = 0;
    get(state).months.forEach((month) => {
      monthlyTotals += month.sum;
    });
    return monthlyTotals / get(state).months.length || 0;
  },
  categories: (get) => getTransactions(get(state).transactions, 'Category').sort((a, b) => b.sum - a.sum)
}, { proxy: state });

export const db = new Dexie('ExpenseReportDB');
db.version(1).stores({
  sessions: '++id,sessionName,*transactions,created,modified'
});

export const updateSession = async ({ transactions, session, sessionName, callback }) => {
  const sortedTransactions = transactions.map((t) => ({ ...t })).sort(sortDateDesc);
  const encryptedData = await encryptData(sortedTransactions);
  const updatedSesh = { sessionName, transactions: encryptedData, modified: new Date() };
  db.sessions.update(session.id, updatedSesh).then(() => {
    state.session = { ...session, ...updatedSesh };
    if (callback) callback();
  });
};
