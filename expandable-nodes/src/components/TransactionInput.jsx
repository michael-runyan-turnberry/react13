import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

export default function TransactionInput({ setTransactionId }) {

    const [textValue, setTextValue] = useState('');

    const handleTextChange = (event) => {
        setTextValue(event.target.value);

    };
    const handleSubmit = (event) => {
        setTextValue(event.target.value);
        setTransactionId(textValue)
      };

    return (
        <div style={{ display: 'flex', gap: '16px' }} >
          <TextField
          id="text-input"
          label="Enter Transaction Id"
          value={textValue}
          onChange={handleTextChange}
          variant="outlined"
          />
          <button onClick={handleSubmit}>
            Submit
          </button>
        </div>
    );

}