import { useMutation } from "@tanstack/react-query";
import { predictPrice } from "../api/estimate";

export function usePredict(){
    return useMutation({mutationFn:predictPrice})
}