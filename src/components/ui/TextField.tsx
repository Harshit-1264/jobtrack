"use client";

type TextFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
}

export default function TextField({
    id,
    label,
    value,
    onChange,
    type = "text",
    placeholder,
}: TextFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="mt-1 h-11 w-full rounded-lg border border-gray-300 px-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
        </div>
    )
}