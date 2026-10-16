"use client";

// One entry in the dropdown: `value` is what gets saved to the database,
// `label` is what the user reads on screen.
type Option = { value: string; label: string }

type SelectFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];          // the list of choices
    placeholder?: string;       // optional "nothing picked yet" row
}

export default function SelectField({
    id,
    label,
    value,
    onChange,
    options,
    placeholder,
} : SelectFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            {/* Controlled exactly like an <input>: React owns the value,
                and onChange is the only way it ever changes. */}
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
                {/* Only renders when a placeholder was passed. Its value is ""
                    so "nothing chosen" is distinguishable from a real choice. */}
                {placeholder && <option value="">{placeholder}</option>}

                {/* Turn each option in the array into one <option> element. */}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}