import { Field } from "formik";
import { useState } from "react";
import FieldContainer from "./FieldContainer";

export default function FormField({ id, label, name, as = null }) {
    const [state, set_state] = useState({ focusing: false });
    return (
        <FieldContainer>
            <label
                className={`text-md text-gray-600 py-1 ${
                    state.focusing ? "font-bold" : ""
                }`}
                htmlFor={id}
            >
                {label}
            </label>
            <Field
                className={`${
                    state.focusing
                        ? "border-blue-500 outline-blue-500"
                        : "border-gray-200"
                } border py-1 px-2 rounded-md text-gray-700 bg-blue-50`}
                onFocus={() => set_state({ focusing: true })}
                onBlur={() => set_state({ focusing: false })}
                id={id}
                name={name}
                as={as}
            ></Field>
        </FieldContainer>
    );
}
