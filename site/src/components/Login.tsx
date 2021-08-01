import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import { User } from "1337xto-subscriber-server/lib/prisma";

type LoginProps = {
  login: (user: User) => void;
  logout: () => void;
};

const Login = ({ login, logout }: LoginProps): JSX.Element => {
  const [hasTriedCookieLogin, setHasTriedCookieLogin] = useState(false);

  const tryCookieLogin = async () => {
    setHasTriedCookieLogin(true);
    const res = await fetch("/api/me");
    console.log(res);

    if (res.status !== 200) return;
    const user: User = await res.json();
    login(user);
  };

  useEffect(() => {
    if (!hasTriedCookieLogin) {
      tryCookieLogin();
    }
  });

  const handleLogin = async (googleData: any) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const user: User = await res.json();
      login(user);
    }
  };

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
    });
    await res.json();
    logout();
  };

  return (
    <Flex
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Heading as="h1">Kirjauduppa sissään</Heading>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
          buttonText="Login"
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={"single_host_origin"}
        />
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Flex>
  );
};

export default Login;
