import { useState } from "react";

import "./App.css";
import { Header } from "./_components/Header/Header";
import { Content } from "./_components/Content/Content";
import { Footer } from "./_components/Footer/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col mx-[25dvh]">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
