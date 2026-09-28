import type { PredictInput } from "../../../api/estimate";
import { CardForm } from "./Form/CardForm";

interface CardProps{
  onEstimate:(input:PredictInput) => void,
  isPending:boolean
}

export function Card({onEstimate,isPending}:CardProps) {
  return (
    <div className="flex flex-col gap-6 bg-slate-100 py-8 px-10 rounded-xl min-w-sm">
      <div className="flex flex-col gap-1.5">
        <span className="text-4xl font-light">
          Melbourne <br /> price estimate
        </span>
        <p>
          A model trained on Melbourne sales. The band <br /> shows its estimate
          and how sure it is.
        </p>
      </div>
      <CardForm onEstimate={onEstimate} isPending={isPending} />
    </div>
  );
}
