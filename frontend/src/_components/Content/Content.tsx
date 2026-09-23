import { Card } from "./Card/Card";
import { Result } from "./Result/Result";

export function Content() {
    return (
        <div className="flex gap-5">
            <Card />
            <Result/>
        </div>
    )
}