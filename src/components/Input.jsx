import React from 'react';

export default function Input(props) {
  // Extracting props for better readability
  const { type, name, class: className, placeholder, changeevent, value } = props;

  // Adding additional classes to the existing className
  const inputClassName = `${className} px-4 py-2 rounded-full shadow-xl `;

  return (
    <div>
      <input
        required
        type={type}
        className={inputClassName}
        placeholder={placeholder}
        name={name}
        onChange={changeevent}
        value={value}
      />
    </div>
  );
}
