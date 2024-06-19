import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {Api2,Api1} from "../api/SetupAuditTrailApi";



export const getAllSetupAuditSlice = createAsyncThunk("/api/SetupAuditTrail/getAll", async (postData, thunkApi) => {
    try {
        
        const {url,method}=postData;
        const response = await Api1(url,method);

        return response.data;
    }
    catch (e) {
        throw thunkApi.reject(e);

    }
}) 






const setupAudit = createSlice({
    name: "SetupAudit",
    initialState: {
      loading: false,
      setupAuditTrail:null,
      setupAuditById:null,
      
      error:{
        error:false,
        message:null
      }
     
    },
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getAllSetupAuditSlice.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(getAllSetupAuditSlice.fulfilled, (state, { payload }) => {
       state.loading=false;
       state.setupAuditTrail=payload

      });

      builder.addCase(getAllSetupAuditSlice.rejected,(state,{payload})=>{
        state.error.error=true;
        state.loading=false;
        state.error.message=payload;
      })


    
   
 
      
    },
  });
  
  export default setupAudit.reducer;