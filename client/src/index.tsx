import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useMutation } from "react-apollo";
import reportWebVitals from "./reportWebVitals";
import {
  AppHeader,
  Listings,
  Home,
  Host,
  Listing,
  NotFound,
  User,
  Login,
} from "./sections";
import { LOG_IN } from "./lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "./lib/types";
import { Layout, Affix, Spin } from "antd";
import "./styles/index.css";
import Avatar from "antd/es/avatar/avatar";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";

const root = document.getElementById("root");

const client = new ApolloClient({
  uri: "/api",
  request: async (operation) => {
    const token = sessionStorage.getItem("token");
    operation.setContext({
      headers: {
        "X-CSRF-TOKEN": token || "",
      },
    });
  },
});

const initalViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initalViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if(data.logIn.token){
          sessionStorage.setItem("token", data.logIn.token);
        }else{
          sessionStorage.removeItem("token");
        }
      }
    },
  });

  const loginRef = useRef(logIn);

  useEffect(() => {
    loginRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching ViduHouse" />
        </div>
      </Layout>
    );
  }

  const loginErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were login. Please try again later!" />
  ) : null;

  return (
    <Router>
      <Layout id="app">
        {loginErrorBannerElement}
        <Affix offsetTop={0} className="app_affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/listings/:location?" element={<Listings />} />
          <Route path="/user/:id" element={<User />} />
          <Route
            path="/login"
            element={<Login setViewer={(e) => setViewer(e)} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
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
