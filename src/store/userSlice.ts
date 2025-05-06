import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Address {
  line1: string;
  line2: string;
  state: string;
  city: string;
  pin: string;
}

export interface Address {
  line1: string;
  line2: string;
  state: string;
  city: string;
  pin: string;
}

export interface UserFormDetail {
  name: string;
  email: string;
  linkedin: string;
  gender: string;
  address: Address;
}

export interface UserFormErrors {
  name: string;
  email: string;
  linkedin: string;
  gender: string;
  address: {
    city: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  linkedin: string;
  gender: string;
  address: Address;
}

interface UserState {
  users: User[];
  editUser: User | null;
}

const initialUserState: UserState = {
  users: [],
  editUser: null
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
    },
    setEditUser: (state, action: PayloadAction<User | null>) => {
      state.editUser = action.payload;
    }
  }
});

export const { addUser, updateUser, setEditUser } = userSlice.actions;
export default userSlice.reducer;

