import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import Login from "./components/Login";
import SomeShit from "./components/SomeShit";
import useGlobal from "./store";

function App() {
  useEffect(() => {
    fetch("/api/terve").then((result) => {
      result.json().then((json) => {
        console.log(json);
      });
    });
  });

  return (
    <ChakraProvider resetCSS>
      <SomeShit />
    </ChakraProvider>
  );
}

export default App;
