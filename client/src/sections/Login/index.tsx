import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useApolloClient, useMutation } from "react-apollo";
import { Card, Layout, Spin, Typography } from "antd";
import { ErrorBanner } from "../../lib/components";
import { LOG_IN } from "../../lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { AUTH_URL } from "../../lib/graphql/quaries/AuthUrl";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/quaries/AuthUrl/__generated__/AuthUrl";
import googleLogo from "./assets/google_logo.jpg";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../lib/utils";
import { Viewer } from "../../lib/types";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [logIn, { data: LogInData, loading: logInLoading, error: logInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn && data.logIn.token) {
          setViewer(data.logIn);
          sessionStorage.setItem("token", data.logIn.token);
          displaySuccessNotification("You are successfullt logged in.");
        }
      },
    });

  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorization = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch {
      displayErrorMessage(
        "Sorry! we couldn't log you in. Please try again later. "
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in.." />
      </Content>
    );
  }

  if (LogInData && LogInData.logIn) {
    const { id: viewId } = LogInData.logIn;
    return <Navigate to={`/user/${viewId}`} />;
  }

  const loginErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! we couldn't log you in. Please try again later. " />
  ) : null;

  return (
    <Content className="log-in">
      {loginErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to ViduHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorization}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
