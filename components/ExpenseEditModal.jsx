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

export default function ExpenseEditModal() {
  const { editModal, selectedTransaction, transactions, session } =
    useSnapshot(state);

  const {
    Form,
    meta: { isSubmitting }
  } = useForm({
    defaultValues: useMemo(
      () => ({
        description: selectedTransaction?.Description,
        amount: selectedTransaction?.Amount,
        account: selectedTransaction?.Account,
        category: selectedTransaction?.Category,
        date: selectedTransaction?.Date
      }),
      [selectedTransaction]
    ),
    onSubmit: async (values) => {
      const filteredTransactions = formatArray(transactions).filter(
        (t) => t.__rowNum__ !== selectedTransaction.__rowNum__
      );

      const updatedTransactions = [
        ...filteredTransactions,
        {
          __rowNum__: selectedTransaction.__rowNum__,
          Description: values.description,
          Account: values.account || 'No Account',
          Category: values.category || 'Uncategorized',
          Date: values.date,
          Amount: +values.amount
        }
      ];

      if (session) {
        updateSession({
          transactions: updatedTransactions,
          session,
          sessionName: session.sessionName
        });
      }
      state.transactions = updatedTransactions;
      state.editModal = false;
      toast.success(`${values.description} expense was updated`);
    }
  });

  function closeModal(e) {
    if (e) e.preventDefault();
    state.editModal = false;
  }

  return (
    <AnimatePresence>
      {editModal && (
        <Dialog
          as={motion.div}
          static
          open
          key="download-modal"
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
            <Form className="inline-block w-full md:min-w-[450px] max-w-md text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="px-6 pt-6 md:px-8 md:pt-8">
                <Dialog.Title className="font-bold text-xl 3xl:text-2xl mb-4">
                  Edit Transaction
                </Dialog.Title>
                <div className="space-y-4 my-6 md:my-8">
                  <TextInput field="description" label="Description" />
                  <NumberInput
                    field="amount"
                    label="Amount (Required)"
                    step="0.01"
                    validate={(value) =>
                      !value ? 'Expense Amount is required.' : null
                    }
                  />
                  <TextInput field="account" label="Account" />
                  <TextInput field="category" label="Category" />
                  <TextInput
                    field="date"
                    label="Date (Required)"
                    validate={(value) => (!value ? 'Date is required.' : null)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-full h-14 bg-gray-200 text-xs 3xl:text-sm font-medium hover:bg-gray-300 rounded-bl-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="w-full h-14 bg-gray-800 text-xs 3xl:text-sm font-medium text-white hover:bg-gray-700 rounded-br-lg"
                  type="submit"
                  disabled={isSubmitting}
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
