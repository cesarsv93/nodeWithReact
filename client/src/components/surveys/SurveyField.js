// SurveyField contains logic to render a single label and text input

import React from 'react';

export default ({ input, label, meta: {error, touched} }) => {
  //{...input} same as onBlur={input.onBlur} onChange = {input.onChange} ...
  //{touched && error} if first evaluates true and second exists and it's a string, it will return the string.
  //If it is false it will just stop and do nothing
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBtoom: '5px' }}/> 
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  )
}