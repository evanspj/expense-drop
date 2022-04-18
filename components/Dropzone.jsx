import { useCallback, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';
import { state } from '@store';
import { useSnapshot } from 'valtio';

export default function Dropzone({ addTransactions = false, callback }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);
  const { transactions } = useSnapshot(state);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const XLSX = (await import('@utils/sheetjs')).default;
      setIsLoading(true);
      const f = acceptedFiles[0];
      const errs = [];
      let reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          blankRows: true,
          defval: ''
        });

        // Format transaction rows
        rows.forEach((row) => {
          if (!row.Amount || !row.Date) {
            if (!row.Amount && !row.Date) {
              errs.push({
                msg: `Transaction on row ${
                  row.__rowNum__ + 1
                } is missing both amount and date values.`
              });
            } else if (!row.Amount) {
              errs.push({
                msg: `Transaction on row ${
                  row.__rowNum__ + 1
                } is missing an amount value.`
              });
            } else if (!row.Date) {
              errs.push({
                msg: `Transaction on row ${
                  row.__rowNum__ + 1
                } is missing a date value.`
              });
            }
          }
          if (!row.Category) {
            row.Category = 'Uncategorized';
          }
          if (!row.Description) {
            row.Description = '';
          }
          if (!row.Account) {
            row.Account = 'No Account';
          }

          row.Date = dayjs(row.Date).format('YYYY-MM-DD');
        });

        if (errs.length) {
          setErrors(errs);
          openModal();
          setIsLoading(false);
          return;
        }

        if (addTransactions) {
          state.transactions = [
            ...transactions.map((t) => ({ ...t })),
            ...rows
          ];
        } else {
          state.transactions = rows;
        }

        setIsLoading(false);
        if (callback) {
          callback();
        }
      };
      reader.readAsArrayBuffer(f);
    },
    [addTransactions, transactions, callback]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  });

  const uploadLabel = isDragActive
    ? 'Drop your file here ...'
    : 'Drag and drop a properly formatted excel file here, or click to select a file.';

  return (
    <div className="w-full h-full flex justify-center">
      <div
        className="w-full h-full flex justify-center items-center text-sm 3xl:text-base text-center bg-gray-50 border-2 border-dashed border-gray-400 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-700 p-4 cursor-pointer"
        {...getRootProps()}
      >
        <input
          className="focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          {...getInputProps()}
        />
        {isLoading ? (
          <p>Processing transactions...</p>
        ) : (
          <div className="space-y-4">
            <svg
              className="w-8 h-8 mx-auto"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5 9H3V8h10v1H6v2h7v1H6v2H5v-2H3v-1h2V9z"
              />
              <path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
              <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z" />
            </svg>
            <p className="w-full lg:w-3/5 mx-auto text-xs 3xl:text-sm font-medium">
              {uploadLabel}
            </p>
          </div>
        )}
      </div>
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={closeModal}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex justify-center items-center min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-10" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative inline-block w-full max-w-lg p-6 overflow-hidden text-left align-middle transition-all transform bg-white border-2 border-red-500 shadow-xl rounded-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-red-500"
                >
                  Error Processing the XLSX File
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    There were {errors?.length || 0} errors with the file.
                    Please fix the below errors before being able to upload it.
                  </p>
                  {errors && (
                    <ul className="max-h-[400px] list-disc list-inside text-sm text-gray-600 space-y-1 mt-4 overflow-y-scroll">
                      {errors.map((error) => (
                        <li key={error.msg}>{error.msg}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="absolute top-4 right-4 ">
                  <button
                    type="button"
                    className="inline-flex justify-center p-2 text-sm font-medium text-black bg-gray-200 rounded-full hover:bg-gray-300"
                    onClick={closeModal}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
