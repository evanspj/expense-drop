import { useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { state, updateSession } from '@store';
import { useSnapshot } from 'valtio';
import { useForm } from 'react-form';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariants, sideModalVariants } from '@utils/animations';
import { formatArray } from '@utils/helpers';

import TextInput from '@components/TextInput';
import NumberInput from '@components/NumberInput';

export default function BulkEditModal({ callback }) {
  const { bulkEditModal, selectedTransactions, transactions, session } =
    useSnapshot(state);

  const {
    Form,
    meta: { isSubmitting }
  } = useForm({
    defaultValues: useMemo(
      () => ({
        description: '',
        amount: 0,
        account: '',
        category: '',
        date: ''
      }),
      []
    ),
    onSubmit: async (values) => {
      const filteredTransactions = [];

      transactions.forEach((t) => {
        if (!selectedTransactions.includes(t.__rowNum__)) {
          filteredTransactions.push({ ...t });
        }
      });

      const editedTransactions = selectedTransactions.map((id) => {
        const selectedTransaction = formatArray(transactions).filter(
          (t) => t.__rowNum__ == id
        )[0];
        if (values.description) {
          selectedTransaction.Description = values.description;
        }
        if (values.amount) {
          selectedTransaction.Amount = values.amount;
        }
        if (values.account) {
          selectedTransaction.Account = values.account;
        }
        if (values.category) {
          selectedTransaction.Category = values.category;
        }
        if (values.date) {
          selectedTransaction.Date = values.date;
        }
        return selectedTransaction;
      });

      const updatedTransactions = [
        ...filteredTransactions,
        ...editedTransactions
      ];

      if (session) {
        updateSession({
          transactions: updatedTransactions,
          session,
          sessionName: session.sessionName
        });
      }
      state.transactions = updatedTransactions;
      state.selectedTransactions = null;
      state.bulkEditModal = false;
      toast.success('Expenses have been updated!');
      callback();
    }
  });

  function closeModal(e) {
    if (e) e.preventDefault();
    state.bulkEditModal = false;
  }

  return (
    <AnimatePresence>
      {bulkEditModal && (
        <Dialog
          as={motion.div}
          static
          open
          key="bulk-edit-modal"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 flex justify-end p-4 z-40 overflow-y-auto"
          onClose={closeModal}
        >
          <Dialog.Overlay
            as={motion.div}
            variants={overlayVariants}
            className="fixed inset-0 firefox:bg-black/50 bg-black/20 backdrop-blur-sm"
          />
          <motion.div variants={sideModalVariants}>
            <Form className="inline-block w-full md:min-w-[400px] max-w-md text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="px-6 pt-6 md:px-8 md:pt-8">
                <Dialog.Title className="font-bold text-xl mb-4">
                  Bulk Edit {selectedTransactions.length} Transaction
                </Dialog.Title>
                <div className="space-y-4 my-6 md:my-8">
                  <TextInput field="description" label="Description" />
                  <NumberInput field="amount" label="Amount" step="0.01" />
                  <TextInput field="account" label="Account" />
                  <TextInput field="category" label="Category" />
                  <TextInput field="date" label="Date" />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-full h-14 bg-gray-200 text-xs 3xl:text-sm font-medium hover:bg-gray-300  rounded-bl-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-14 bg-gray-800 text-xs 3xl:text-sm font-medium text-white hover:bg-gray-700 rounded-br-lg"
                  type="submit"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </Form>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
