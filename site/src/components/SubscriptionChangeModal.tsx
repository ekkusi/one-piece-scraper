import {
  Button,
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import React from "react";

type SubscriptionChangeModalProps = Omit<ModalProps, "children"> & {
  searchString: string;
};

const SubscriptionChangeModal = ({
  searchString,
  ...modalProps
}: SubscriptionChangeModalProps): JSX.Element => {
  return (
    <>
      <Modal {...modalProps}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {searchString.length > 0 ? "Tilaus muutettu" : "Tilaus poistettu"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {searchString.length > 0 ? (
              <>
                <Text>Tilaus aloitettu hauille:</Text>
                <UnorderedList mb="5">
                  {searchString.split(", ").map((search) => (
                    <ListItem>{search}</ListItem>
                  ))}
                </UnorderedList>
                <Text>
                  Sähköpostiisi pitäisi olla tullut viesti tilauksen
                  muutoksesta. Jos kyseinen viesti on löytänyt tiensä perille
                  asti, pitäisi tulevien hakubotin viestienkin löytää:)
                </Text>
              </>
            ) : (
              "Tilaus poistettu. Sähköposteja ei ennää pitäisi tulla:)"
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={modalProps.onClose}>
              Okokok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubscriptionChangeModal;
