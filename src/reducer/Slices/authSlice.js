import {createSlice} from"@reduxjs/toolkit"


// now defining the initial states
const initialState={
  signupData: null,
  token:localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")):null
}

const authSlice=createSlice({
  name:"auth",
  initialState:initialState,
  reducers:{
    setToken(state,value){
      state.token=value.payload
      console.log("my sign up data value is ",state)
    },
    setSignupData(state, value) {
      console.log("Signup data payload:", value.payload);
      state.signupData = value.payload;
      console.log("Updated state.signupData:", state.signupData);
    },
    setLoading(state, value) {
      state.loading = value.payload;
    }

  },
})

export const  { setToken,setLoading,setSignupData} =authSlice.actions;
export default authSlice.reducer;