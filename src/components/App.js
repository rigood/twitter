import React from "react";
import { useState } from "react";
import AppRouter from "./Router";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return <AppRouter />;
}

export default App;
