"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation';
import {useEffect} from "react"




  type UseSearchParamsFn = (args: {
  setdate1: React.Dispatch<React.SetStateAction<string | null>>;
  setdate2: React.Dispatch<React.SetStateAction<string | null>>;

  setassigneefilter: React.Dispatch<React.SetStateAction<string[]>>;
  setpriorityfilter: React.Dispatch<React.SetStateAction<string[]>>;
  setstatusfilter: React.Dispatch<React.SetStateAction<string[]>>;

  setbetweenDates: React.Dispatch<React.SetStateAction<string[]>>;

  getbetweentwodates: (start: Date, end: Date) => Date[];
}) => null;



const useSearchparam:UseSearchParamsFn = ({setdate1,setdate2, getbetweentwodates,setbetweenDates,setstatusfilter,setpriorityfilter, setassigneefilter}) => {


      const searchParams = useSearchParams();


  useEffect(() => {
    //sharabler filter url logic

    const assignF = searchParams.get("a");
    const priorityF = searchParams.get("p");
    const statusF = searchParams.get("s");
    const strandend: (string | null)[] =
      JSON.parse(searchParams.get("b") ?? "null") ?? [];

    function setter() {
      if (strandend[1]) {
        const str = new Date(strandend[0] ?? "");
        const end = new Date(strandend[1] ?? "");

        setdate1(str.toLocaleDateString("en-CA"));
        setdate2(end.toLocaleDateString("en-CA"));

        const betweendates = getbetweentwodates(str, end).map((i) =>
          i.toLocaleDateString("en-CA"),
        );

        setbetweenDates(betweendates ?? []);
      }

      setassigneefilter(JSON.parse(assignF!) ?? []);
      setpriorityfilter(JSON.parse(priorityF!) ?? []);
      setstatusfilter(JSON.parse(statusF!) ?? []);
    }

    setter();
  }, []);




return null
}

export default useSearchparam