import { splitFormProps, useField } from 'react-form';

export default function NumberInput(props) {
  const [field, fieldOptions, rest] = splitFormProps(props);

  const {
    meta: { error, isTouched },
    getInputProps
  } = useField(field, fieldOptions);

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500">{props.label}</label>
      <input
        type="number"
        step={props?.step || '1'}
        className="w-full h-[40px] text-sm bg-gray-100e border border-gray-300 hover:border-gray-800 rounded-md px-3"
        {...getInputProps({ ...rest })}
      />
      {isTouched && error ? (
        <em className="text-xs 3xl:text-sm text-red-500">{error}</em>
      ) : null}
    </div>
  );
}
