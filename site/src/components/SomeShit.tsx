import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { User } from "../../../server/lib/prisma";
import Login from "./Login";
import SubscriptionChangeModal from "./SubscriptionChangeModal";

type SomeShitProps = {};

const SomeShit = (props: SomeShitProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const login = (user: User) => {
    setUser(user);
    setSearchString(user.search_words.join(", "));
  };

  const save = async () => {
    setLoading(true);
    const res = await fetch("/api/update-subscription", {
      method: "POST",
      body: JSON.stringify({
        searchString,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      const newUser: User = data.user;
      setUser(newUser);
      setIsModalOpen(true);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
    });
    await res.json();
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <Login login={login} />
      ) : (
        <>
          <Flex
            justifyContent="space-between"
            position="absolute"
            width="100%"
            p="5"
          >
            <Text>Kirjautunut: {user.email}</Text>
            <Button onClick={handleLogout}>Kirjaudu ulos</Button>
          </Flex>
          <Flex
            width="100%"
            minHeight="100vh"
            justifyContent="center"
            alignItems="center"
            p="5"
            pb={{ base: 0, md: 20 }}
          >
            <Box>
              <Heading as="h2" size="md">
                Syötä hakusanat, joita halajat tarkastella
              </Heading>
              <Text>
                Jos halajat tarkastella useampaa torrenttia, erottele haut
                pilkulla ja välillä.
              </Text>
              <Text>
                Esimerkiksi: <i>one piece 980, one piece 981</i>
              </Text>
              <Text>
                Huom! Isoilla ja pienillä kirjaimilla ei ole väliä haun kannalta
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
                mb="5"
              >
                Tallenna haku
              </Button>
              <Text>
                Jos halajat poistella tilauksen, tallenna tyhjä haku niin
                spämmiä ei pitäis enää tulla
              </Text>
            </Box>
          </Flex>
        </>
      )}
      <SubscriptionChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        searchString={searchString}
      />
    </>
  );
};

export default SomeShit;
