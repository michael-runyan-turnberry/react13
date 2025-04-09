import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({ updateMessage }) {
  const [age, setAge] = React.useState('');


  const handleChange = (event) => {
    setAge(event.target.value);
    updateMessage(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Service</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={"submitOrder"}>submitOrder</MenuItem>
          <MenuItem value={"cancelOrder"}>cancelOrder</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}