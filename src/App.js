import { useEffect, useState } from "react";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import "./App.css";

function App() {
  const [advice, setAdvice] = useState({ id: undefined, advice: undefined });
  const [isLoading, setIsLoading] = useState(true);
  const [isInFavorite, setIsInFavorite] = useState(false);
  const [localStorageItems, setLocalStorageItems] = useState(
    JSON.parse(window.localStorage.getItem("favoriteAdvice")) || []
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const isExist = localStorageItems.some(
      (element) => element.id === advice.id
    );

    setIsInFavorite(isExist ? true : false);
  }, [advice]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.adviceslip.com/advice");
      if (!response.ok) return;

      const data = await response.json();
      setAdvice(data.slip);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const addToLocalStorage = (items) => {
    window.localStorage.setItem("favoriteAdvice", JSON.stringify(items));
  };

  const handleAddToFavorite = () => {
    setIsInFavorite(!isInFavorite);

    const isExist = localStorageItems.some(
      (element) => element.id === advice.id
    );

    if (isExist) return;

    const newFavoriteItem = { ...advice };
    const newItems = [...localStorageItems, newFavoriteItem];
    setLocalStorageItems(newItems);
    addToLocalStorage(newItems);
  };

  const handleRemoveFromFavorite = () => {
    setIsInFavorite(!isInFavorite);

    const newItems = localStorageItems.filter((item) => item.id !== advice.id);
    setLocalStorageItems(newItems);
    addToLocalStorage(newItems);
  };

  const handleShare = () => {
    navigator.share({
      title: window.document.title,
      url: window.location.href,
      text: advice.advice,
    });
  };

  return (
    <div className="card">
      <div className="topIcons">
        <button onClick={handleShare}>
          <FaShareAlt></FaShareAlt>
        </button>
        <div className="favorite">
          {!isInFavorite ? (
            <button onClick={handleAddToFavorite}>
              <MdOutlineFavoriteBorder></MdOutlineFavoriteBorder>
            </button>
          ) : (
            <button onClick={handleRemoveFromFavorite}>
              <MdOutlineFavorite></MdOutlineFavorite>
            </button>
          )}
        </div>
      </div>
      {!isLoading ? (
        <h1>{advice.advice}</h1>
      ) : (
        <h1 style={{ color: "#777" }}>Loading..</h1>
      )}
      <button className="newAdviceBtn" onClick={fetchData}>
        <span>Give Me Advice!</span>
      </button>
    </div>
  );
}

export default App;
