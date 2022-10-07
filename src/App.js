import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.adviceslip.com/advice");
      if (!response.ok) return;

      const data = await response.json();
      const { advice } = data.slip;
      setAdvice(advice);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="card">
      <h1>{advice}</h1>
      <button onClick={fetchData}>
        <span>Give Me Advice!</span>
      </button>
    </div>
  );
}

export default App;
