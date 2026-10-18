"use client";

type TextAreaFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number; // optional, default to 3
}

export default function TextAreaField({
    id, label, value, onChange, placeholder, rows = 3,
}: TextAreaFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <textarea 
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
        </div>
    )
}