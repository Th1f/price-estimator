import { useState } from "react";
import type { PredictInput, PredictionResponse } from "../../api/estimate";
import { usePredict } from "../../hooks/usePredict";
import { Card } from "./Card/Card";
import { Result } from "./Result/Result";

export function Content() {
    const predict = usePredict()
    // Keeps the last successful estimate on screen while the next one loads,
    // so NumberFlow stays mounted and can animate between values.
    const [result, setResult] = useState<PredictionResponse>()

    const handleEstimate = (input: PredictInput) => {
        predict.mutate(input, { onSuccess: setResult })
    }

    return (
        <div className="flex gap-5">
            <Card onEstimate={handleEstimate} isPending={predict.isPending} />
            <Result data={result} isPending={predict.isPending} />
        </div>
    )
}
