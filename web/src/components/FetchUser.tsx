"use client"
import { useApp } from '@/stores/useApp';
import  { useEffect } from 'react'

function FetchUser() {
    const {fetchUser} = useApp();
    useEffect(()=>{
        fetchUser();
    },[])
  return null;
}

export default FetchUser