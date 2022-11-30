import React from "react";
import { render } from "react-dom";
import  ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import reportWebVitals from "./reportWebVitals";
import { Listings } from "./sections";

const root = document.getElementById("root");

const client = new ApolloClient({
  uri: "/api"
});

render(
  <ApolloProvider client={client}>
  <React.StrictMode>
    <Listings title="Vidumini Listings" />
  </React.StrictMode>
  </ApolloProvider>,
  root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
