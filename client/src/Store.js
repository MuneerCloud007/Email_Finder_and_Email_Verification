import { configureStore } from "@reduxjs/toolkit";
import SetupAuditTrailReducer from "feature/SetupAuditTrail/slice/SetupAuditTrail";


const Store=configureStore({
    reducer:{
       setupAuditTrail :SetupAuditTrailReducer
        
    }
})

export default Store;