import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/slice/userSlice";
import EmailVerifierReducer from "./features/slice/emailVerifier";
import emailVerifier from "./features/slice/emailVerifier";


const Store=configureStore({
    reducer:{
       auth :AuthReducer,
       emailVerifier:EmailVerifierReducer
        
    }
})

export default Store;