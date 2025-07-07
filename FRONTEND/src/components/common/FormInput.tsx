
import type { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form';

interface FormInputProps {
    label: string;
    name: string;
    type: string;
    register: UseFormRegister<any>;
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ label, name, type, register, error, required }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
        type={type}
        {...register(name, { required: required ? `${label} is required` : false })}
        className={`mt-1 block w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
        />
        {error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message && (
            <p className="text-red-500 text-sm">{error.message}</p>
        )}
    </div>
);