import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useDebounce } from "../../../../hooks/useDebounce";
import { useSuburbs } from "../../../../hooks/useSuburbs";
import type { PredictInput, PredictionResponse } from "../../../../api/estimate";

interface CardFormProps {
  onEstimate: (input:PredictInput) => void,
  isPending: boolean;
}

export function CardForm({onEstimate,isPending}:CardFormProps) {
  const [subburb, setSuburb] = useState<string>("");
  const debounce = useDebounce(subburb, 500);
  const [bedroom, setBedroom] = useState(3);
  const [bathroom, setBathroom] = useState(2);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<string[]>([]);
  const [error, setError] = useState("");
  const { data, isLoading } = useSuburbs();
  const suburbs = data?.suburbs;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSuburb(val);
    if (val.trim().length > 0) {
      const filtered = suburbs?.filter((item) => {
        return item.toLowerCase().includes(val.toLowerCase());
      });
      if (filtered) {
        if (filtered.length > 5) {
          const shortFiltered = filtered.slice(0, 4);
          setSuggestion(shortFiltered);
        } else {
          setSuggestion(filtered);
        }
      }
    } else {
      setShowSuggestion(false);
    }
    if (!showSuggestion) setShowSuggestion(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!subburb || subburb == "") {
      setError("Please input suburb");
      return;
    } else if (bedroom <= 0 || bathroom <= 0) {
      setError("Invalid from submission");
      return;
    }
    onEstimate({suburb:subburb, bathrooms:bathroom, bedrooms:bedroom})
    setError("");
  };

  const handleClick = (item: string) => {
    setSuburb(item);
    setShowSuggestion(false);
  };

  useEffect(() => {
    if (debounce) {
      console.log(debounce);
      console.log("Suggestion:", suggestion);
    }
  }, [debounce, suggestion]);
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1 relative">
        <label htmlFor="suburb" className="font-bold">
          Suburb
        </label>
        <input
          type="text"
          name="suburb"
          id="suburb"
          onChange={handleChange}
          value={subburb}
          className="bg-cloud rounded-ctl px-3 py-3 border border-mist-200"
          autoComplete="off"
        />
        {showSuggestion && (
          <ul className="absolute top-full left-0 w-full z-50">
            {suggestion.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleClick(item)}
                className="bg-cloud px-3 py-2 hover:bg-gray-200 hover:cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="bedrooms" className="font-bold">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            defaultValue={3}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setBedroom(parseInt(e.target.value))
            }
            className="bg-cloud rounded-ctl px-3 py-3 border border-mist-200 focus:outline-2 focus:outline-violet focus:outline-offset-4"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="bathrooms" className="font-bold">
            Bathrooms
          </label>
          <select
            id="bathrooms"
            defaultValue={2}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setBathroom(parseInt(e.target.value))
            }
            className="bg-cloud rounded-ctl px-3 py-3 border border-mist-200 focus:outline-2 focus:outline-violet focus:outline-offset-4"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="bg-cloud rounded-ctl px-3 py-3 border border-mist-200 transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:border-t-[--spectrum] hover:border-b-5"
      >
        Estimate price
      </button>
      {error && <span className="text-red-400">{error}</span>}
    </form>
  );
}
