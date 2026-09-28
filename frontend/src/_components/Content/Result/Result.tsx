import NumberFlow from "@number-flow/react";
import type { PredictionResponse } from "../../../api/estimate";

interface ResultProps {
  isPending?: boolean;
  data?: PredictionResponse;
}

const formatPrice = (value: number) =>
  value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });

export function Result({ data, isPending }: ResultProps) {
  const placement = data
    ? ((data.price - data.min) / (data.max - data.min)) * 100
    : 0;

  return (
    <div className="flex flex-1 flex-col gap-5">
      <span
        className={`text-7xl my-5 ${data ? "text-black" : "text-placeholder"}`}
      >
        <NumberFlow
          value={data?.price ?? 0}
          format={{
            style: "currency",
            currency: "AUD",
            trailingZeroDisplay: "stripIfInteger",
          }}
        />
      </span>

      {data && (
        <div className="flex flex-col gap-1 pt-5">
          <div className="relative flex items-center h-5">
            <div className="border h-3"></div>
            <div className="flex-1 h-1 rounded-full bg-(image:--spectrum)"></div>
            <div className="border h-3"></div>
            <div
              className="absolute h-5 border -translate-x-1/2 transition-[left] duration-700 ease-glide"
              style={{ left: `${placement}%` }}
            >
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs whitespace-nowrap">
                Estimate
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span>{formatPrice(data.min)}</span>
            <span>{formatPrice(data.max)}</span>
          </div>
        </div>
      )}

      {/* <div className="flex gap-2 my-5 items-center">
        <div className={`w-2 h-2 rounded-full bg-absent`}></div>
        <span>
          {isPending ? "Estimating…" : "Enter a suburb to form an estimate"}
        </span>
      </div>
       <div>
        <span>Sales the model weighted most</span>
        <p>Each tick shows where the sale sits on the band above</p>
      </div>  */}
    </div>
  );
}
