export function Result() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <span className="text-7xl my-5 text-placeholder">$-</span>
      <div className="border w-full border-mist-200"></div>
      <div className="flex gap-2 my-5 items-center">
        <div className="w-2 h-2 rounded-full bg-absent"></div>
        <span className="font-bold">Absent</span>
        <span>Enter a suburb to form an estimate</span>
      </div>
      <div>
        <span>Sales the model weighted most</span>
        <p>Each tick shows where the sale sits on the band above</p>
      </div>
    </div>
  );
}
