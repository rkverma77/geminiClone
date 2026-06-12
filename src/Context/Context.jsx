import { createContext, useState } from "react";
import main from "../config/gemini";
import formatResponse from "../utils/formatResponse";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPromt, setRecentPromt] = useState("");
  const [prevPromt, setPrevPromts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await main(prompt);
      setRecentPromt(prompt);
    } else {
      setPrevPromts((prev) => [...prev, input]);
      setRecentPromt(input);
      response = await main(input);
    }

    setResultData(formatResponse(response));
    setLoading(false);
    setInput("");
  };


  const contextValue = {
    prevPromt,
    setPrevPromts,
    onSent,
    setRecentPromt,
    recentPromt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
