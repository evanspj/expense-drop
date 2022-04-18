import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { state } from '@store';
import { sortDateDesc, nameToSlug } from '@utils/helpers';

const ExpenseBulkEditModal = dynamic(() =>
  import('@components/ExpenseBulkEditModal')
);

function AccountLabel({ page, name }) {
  if (page && page === 'accounts')
    return (
      <p className="w-full flex items-center justify-end xl:justify-start xl:col-span-2 text-xs text-right xl:text-left text-gray-400 xl:text-gray-800 truncate xl:pl-4">
        {name}
      </p>
    );
  return (
    <Link href={`/app/accounts/${nameToSlug(name)}`}>
      <a className="w-full flex items-center justify-end xl:justify-start xl:col-span-2 text-xs xl:text-sm text-right xl:text-left text-gray-400 xl:text-gray-800 truncate hover:underline hover:text-indigo-500 outline-indigo-600 xl:pl-4">
        {name}
      </a>
    </Link>
  );
}

function CategoryLabel({ page, name }) {
  if (page && page === 'categories')
    return (
      <span className="bg-gray-200 text-xs rounded-md px-2 py-1 ">{name}</span>
    );
  return (
    <Link href={`/app/categories/${nameToSlug(name)}`}>
      <a className="bg-gray-200 text-xs rounded-md hover:bg-gray-800 hover:text-white  px-2 py-1">
        {name}
      </a>
    </Link>
  );
}

export default function ExpensesList({ label, expenses, page }) {
  const [itemsToEdit, setItemsToEdit] = useState([]);

  function handleCheckbox(e, expense) {
    if (e.target.checked) {
      setItemsToEdit([...itemsToEdit, expense.__rowNum__]);
    } else {
      setItemsToEdit(itemsToEdit.filter((item) => item !== expense.__rowNum__));
    }
  }

  function addAllTransactions(e) {
    const expenseInputs = document.querySelectorAll('.expense-checkbox');
    if (e.target.checked) {
      expenseInputs.forEach((expense) => {
        expense.checked = true;
      });
      setItemsToEdit(expenses.map((e) => e.__rowNum__));
    } else {
      expenseInputs.forEach((expense) => {
        expense.checked = false;
      });
      setItemsToEdit([]);
    }
  }

  function cancelSelection() {
    const expenseInputs = document.querySelectorAll('.expense-checkbox');
    const allCheckbox = document.getElementById('category-all');
    expenseInputs.forEach((expense) => {
      expense.checked = false;
    });
    allCheckbox.checked = false;
    setItemsToEdit([]);
  }

  function selectTransactions() {
    state.selectedTransactions = itemsToEdit;
    state.bulkEditModal = true;
  }

  function selectTransaction(transaction) {
    state.selectedTransaction = transaction;
    state.editModal = true;
  }

  function bulkEditsCallback() {
    cancelSelection();
  }

  return (
    <>
      <div className="sticky top-[63px] flex items-center space-x-6 bg-gray-100 pb-4">
        {label && (
          <h2 className="text-lg -mt-2 font-bold pl-8 lg:pl-2">
            {label} Expenses
          </h2>
        )}
        <AnimatePresence>
          {itemsToEdit.length ? (
            <motion.div
              key="edit-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
              className="flex items-center space-x-4"
            >
              <button
                onClick={cancelSelection}
                className="flex justify-center items-center text-sm font-medium bg-gray-300 hover:bg-gray-200 rounded-md px-3 py-2"
              >
                Clear Selection
              </button>
              <button
                onClick={selectTransactions}
                className="flex justify-center items-center h-[36px] text-sm font-medium bg-black hover:bg-black/80 text-white rounded-md px-3"
              >
                Edit Transactions
              </button>
            </motion.div>
          ) : (
            <div className="h-[36px]" />
          )}
        </AnimatePresence>
      </div>
      <div className="flex-grow  lg:rounded-xl border border-gray-200 shadow-xl shadow-gray-500/10">
        <div className="hidden xl:grid grid-cols-[50px_130px_repeat(10,minmax(0,1fr))] bg-gray-50 text-black border-b border-gray-200 rounded-t-xl text-xs px-4 py-3">
          <div className="flex items-center justify-center w-[24px]">
            <input
              type="checkbox"
              id="category-all"
              name="editTransactions[]"
              onChange={addAllTransactions}
              className="appearance-none h-4 w-4 border border-gray-300 rounded text-black hover:border-black  checked:bg-black checked:ring-2 checked:ring-offset-1 checked:ring-black  cursor-pointer"
            />
          </div>
          <p className="w-full max-w-[130px]">Date</p>
          <p className="col-span-5 pl-4">Description</p>
          <p className="col-span-2 pl-4">Account</p>
          <p className="col-span-2 shrink-0 pl-4">Category</p>
          <p className="text-right">Amount</p>
        </div>
        <div className="divide-y lg:rounded-xl xl:rounded-t-none overflow-hidden border-gray-200">
          {expenses?.sort(sortDateDesc).map((expense, i) => (
            <div
              key={i}
              className="grid grid-cols-[50px_130px_repeat(10,minmax(0,1fr))]  bg-white hover:bg-gray-50 px-4 py-3"
            >
              <div className="flex items-center justify-center w-[24px]">
                <input
                  type="checkbox"
                  id={`category-${expense.__rowNum__}`}
                  name="editTransactions[]"
                  onChange={(e) => handleCheckbox(e, expense)}
                  className="expense-checkbox appearance-none h-4 w-4 border border-gray-300 rounded text-black hover:border-black  checked:bg-black checked:ring-2 checked:ring-offset-1 checked:ring-black  cursor-pointer"
                />
              </div>
              <div className="col-span-6 flex flex-col lg:flex-row">
                <p className="shrink w-full max-w-[130px] flex items-center text-xs text-gray-400 xl:text-black">
                  {new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium'
                  }).format(new Date(expense.Date))}
                </p>
                <button
                  onClick={() => selectTransaction({ ...expense })}
                  className="w-full text-sm text-left font-medium xl:font-normal hover:text-indigo-500 hover:underline truncate  cursor-pointer xl:pl-4"
                >
                  {expense?.Description}
                </button>
              </div>
              <div className="col-span-5 grid xl:grid-cols-5">
                <AccountLabel page={page} name={expense.Account} />
                <div className="hidden xl:block xl:col-span-2 pl-4">
                  <CategoryLabel page={page} name={expense.Category} />
                </div>
                <p className="w-full text-right font-medium xl:font-normal">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(expense.Amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ExpenseBulkEditModal callback={bulkEditsCallback} />
    </>
  );
}
