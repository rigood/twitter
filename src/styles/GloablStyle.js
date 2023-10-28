import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import "./font.css";
import "./variables.css";

const GlobalStyle = createGlobalStyle`
${reset}

* {
  box-sizing: border-box;
}

body {
  background-color: var(--outer-bg-color);
  color: var(--text-color);
  font-family: "Pretendard";
  font-weight: 400;
}

a {
  text-decoration: none;
  color: inherit;
}

button,
input,
textarea {
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  border: none;
  background-color: transparent;
}

button{
  cursor: pointer;
}

input::placeholder {
  color: inherit;
  font-family: inherit;
  font-size: inherit;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px #fff inset;
  box-shadow: 0 0 0px 1000px #fff inset;
  transition: background-color 5000s ease-in-out 0s;
}

input:autofill,
input:autofill:hover,
input:autofill:focus,
input:autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px #fff inset;
  box-shadow: 0 0 0px 1000px #fff inset;
  transition: background-color 5000s ease-in-out 0s;
}

`;

export default GlobalStyle;
