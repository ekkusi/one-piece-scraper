import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "react-google-login";
import { User } from "1337xto-subscriber-server/lib/prisma";

type LoginProps = {
  login: (user: User) => void;
};

const Login = ({ login }: LoginProps): JSX.Element => {
  const [hasTriedCookieLogin, setHasTriedCookieLogin] = useState(false);

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

  const { signIn } = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
    onSuccess: handleLogin,
    onFailure: handleLogin,
    cookiePolicy: "single_host_origin",
  });

  const tryCookieLogin = async () => {
    setHasTriedCookieLogin(true);
    const res = await fetch("/api/me");

    if (res.status !== 200) return;
    const user: User = await res.json();
    login(user);
  };

  useEffect(() => {
    if (!hasTriedCookieLogin) {
      tryCookieLogin();
    }
  });

  return (
    <Flex
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Flex direction="column" alignItems="center">
        <Heading>1337xx.to hakubotti</Heading>
        <Text mb="3">Astu nykyaikaan ja automatisoi torrenttihakusi:)</Text>
        <Button onClick={() => signIn()} textAlign="center">
          Kirjauppa sisään
        </Button>
      </Flex>
    </Flex>
  );
};

export default Login;
