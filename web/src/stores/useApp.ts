import axios from 'axios';
import { toast } from 'sonner';
import {create} from 'zustand';

export const useApp = create<any>((set)=>({
    user: null,
    signup: async (data: any, router: any) => {
        try {
            const res = await axios.post("http://localhost:4000/api/user/signup", data, {
                withCredentials: true
            });

            if(res.status === 200){
                set({user: res.data})
                toast.success("Signed Up")
                router.push("/battle")
            }
        } catch (error) {
            toast.error("Failed to signup")
            set({user: null})
        }
    },
    login: async (data: any, router: any) => {
        try {
            const res = await axios.post("http://localhost:4000/api/user/login", data, {
                withCredentials: true
            });

            if(res.status === 200){
                set({user: res.data})
                toast.success("Logged In")
                router.push("/battle")
            }
        } catch (error) {
            toast.error("Failed to login")
            set({user: null})
        }
    }
}))