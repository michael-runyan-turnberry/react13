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
    <Box sx={{ minWidth: 250 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Service</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={"SubmitOrder_V2"}>SubmitOrder_V2</MenuItem>
          <MenuItem value={"cancelOrderCOS_V2"}>cancelOrderCOS_V2</MenuItem>
          <MenuItem value={"cancelTransferOrder"}>cancelTransferOrder</MenuItem>
          <MenuItem value={"disconnectAccount_V2"}>disconnectAccount_V2</MenuItem>
          <MenuItem value={"submitTCSROOrder_V2"}>submitTCSROOrder_V2</MenuItem>
          <MenuItem value={"updateScheduleWindow_V2"}>updateScheduleWindow_V2</MenuItem>
          <MenuItem value={"verifyOrder_V1"}>verifyOrder_V1</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}