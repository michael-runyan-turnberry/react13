import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({ updateTime }) {
  const [age, setAge] = React.useState('');


  const handleChange = (event) => {
    setAge(event.target.value);
    updateTime(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 250 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Time</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={"15"}>15 Minutes</MenuItem>
          <MenuItem value={"60"}>1 Hour</MenuItem>
          <MenuItem value={"1440"}>24 Hour</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}