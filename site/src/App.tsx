import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import SomeShit from "./components/SomeShit";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

const App = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <SomeShit />
    </ChakraProvider>
  );
};

export default App;
