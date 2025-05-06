import { createSlice } from '@reduxjs/toolkit';

interface ConfigState {
  editable: boolean;
  nameMin: number;
  nameMax: number;
}

const initialConfigState: ConfigState = {
  editable: true,
  nameMin: 3,
  nameMax: 50
};

const configSlice = createSlice({
  name: 'config',
  initialState: initialConfigState,
  reducers: {}
});

export default configSlice.reducer;

