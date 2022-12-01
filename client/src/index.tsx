import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import reportWebVitals from "./reportWebVitals";
import { Listings, Home, Host, Listing, NotFound, User } from "./sections";
import "./styles/index.css";

const root = document.getElementById("root");

const client = new ApolloClient({
  uri: "/api",
});

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<Host />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/listings/:location?" element={<Listings />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/login" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
