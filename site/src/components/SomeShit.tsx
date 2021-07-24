import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { User } from "../../../server/lib/prisma";
import Login from "./Login";

type SomeShitProps = {};

const SomeShit = (props: SomeShitProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);

  const login = (user: User) => {
    setUser(user);
    setSearchString(user.search_words.join(", "));
  };

  const save = async () => {
    setLoading(true);
    console.log("Saving");
    const res = await fetch("/api/update-subscription", {
      method: "POST",
      body: JSON.stringify({
        searchString,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res);

    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <Text position="absolute" top="5" left="5">
        {user ? `Logged in as ${user.email}` : "Not logged in"}
      </Text>
      {!user ? (
        <Login login={login} logout={() => setUser(null)} />
      ) : (
        <Flex
          width="100%"
          minHeight="100vh"
          justifyContent="center"
          alignItems="center"
          pb="20"
        >
          <Box>
            <Heading as="h1" size="xl">
              1337xx subscriber
            </Heading>
            <Heading as="h2" size="md">
              Insert keywords you want to subscribe to
            </Heading>
            <Text>
              If you want to subscribe to multiple searches, separate them by
              comma and space.
            </Text>
            <Text>
              For example: <i>one piece 980, one piece 981</i>
            </Text>
            <Input
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              placeholder="one piece 980, one piece 981"
              mb="3"
            />
            <Button
              onClick={save}
              isLoading={loading}
              isDisabled={
                searchString === user.search_words.join(", ") || loading
              }
            >
              Save
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default SomeShit;
