/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

// Define the type for the slice state
type TModuleState = {
  selectedModule: any | null;
};

const initialState: TModuleState = {
  selectedModule: null,
};

// Create the slice
const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    setSelectedModule: (state, action: PayloadAction<any>) => {
      state.selectedModule = action.payload;
    },
    clearSelectedModule: (state) => {
      state.selectedModule = null;
    },
  },
});

export const { setSelectedModule, clearSelectedModule } = moduleSlice.actions;

export default moduleSlice.reducer;

// Selectors
export const selectSelectedModule = (state: RootState) =>
  state.module.selectedModule;
