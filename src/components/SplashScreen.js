import { useEffect, useState } from 'react'
import { Center, Box, Image, Loader, Stack, Text, Transition } from '@mantine/core';
import '@mantine/core/styles.css';
import pokepeek from '../Assets/pokepeek.png';


const SplashScreen = ({ onFinish }) => {

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {

    const imageTimer = setTimeout(() => {
      setShowImage(true);
    }, 200);

    const splashTimer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => {
      clearTimeout(imageTimer);
      clearTimeout(splashTimer);
    };
  }, [onFinish]);

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        alignContent: 'center',
        backgroundImage: 'radial-gradient(circle ,#D1FFFD, #008080)'
      }}>
      <Center >
        <Transition mounted={showImage} duration={2000} transition="pop" timingFunction='ease'>
          {(styles) => (
            <Image
              src={pokepeek}
              fit="contain"
              h={450}
              w={450}
              style={styles}
            />
          )}
        </Transition>
        <Box
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            width: "100%"

          }}>
          <Stack align='center'>
            <Loader color='blue' type="dots" size="md" />
            <Text size='lg' c="dimmed">Connecting to Professor Oak… Please wait!</Text>
          </Stack>
        </Box>
      </Center>
    </Box>
  )
}

export default SplashScreen;