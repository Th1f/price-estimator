import { useQuery } from "@tanstack/react-query";
import { getSuburbs } from "../api/estimate";

export function useSuburbs(){
    return useQuery({
        queryKey:["suburbs"],
        queryFn:getSuburbs,
        staleTime:Infinity,
    })
}