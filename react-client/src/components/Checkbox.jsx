// Checkbox.js
import React from 'react';

export const Checkbox = ({ id, name, value, label, checked, onChange }) => {
  return (
    <div className="flex gap-2">
      <input onChange={onChange} type="checkbox" id={id} name={name} value={value} checked={checked} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

