import {useMutation} from  '@tanstack/react-query'
import { login, register } from '../services/api';
import type { User } from '../types/user.types';



export const useRegister = ()=>{
    return useMutation({
        mutationFn:(data:User)=> register(data),
        onError:(error:Error) =>{
            console.error("Registration Error",error)
        }
    });
};


export const useLogin = ()=>{
    return useMutation({
        mutationFn:(data:{email:string,password:string})=>login(data),
    });
};
// export const useLogout = ()=>{
//   return useMutation({
//     mutationFn:logoutUser,
//     onError:(error:Error)=>{
//       console.log("Error on Logout user",error)
//     }
//   })
// }