import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { AppShell, AppShellHeader, AppShellMain, Flex, Image, Card, Stack, Text, SimpleGrid, Button, Grid, Box, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import leftArrow from '../Assets/left-arrow.png';
import emptyHeart from '../Assets/emptyHeart.png';
import filledHeart from '../Assets/filledHeart.png';
import pokeball from '../Assets/pokeball.png';

const loadFavorites = () => {
  try {
    const raw = localStorage.getItem('favorites');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (arr) => {
  localStorage.setItem('favorites', JSON.stringify(arr));
};

function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const isFav = (id) => favorites.some((f) => f.id === String(id));

  const toggleFavorite = (id, name) => {
    const sid = String(id);
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === sid);
      const next = exists ? prev.filter((f) => f.id !== sid) : [...prev, { id: sid, name }];
      saveFavorites(next);
      return next;
    });
  };

  useEffect(() => {
    if (!selectedPokemon) return;
    const url =
      selectedPokemon.url ||
      `https://pokeapi.co/api/v2/pokemon/${selectedPokemon.name || selectedPokemon.id}`;
    axios.get(url).then((res) => setPokemonDetails(res.data));
  }, [selectedPokemon]);

  return (
    <AppShell>
      <AppShellHeader
        height={80}
        style={{ background: 'linear-gradient(to bottom, #00FFFF,#008080)' }} >
        <Flex align="center" h="100%" px="sm">
          <Image src={pokeball} fit="contain" h="30" w="30" />
          <Text size="xl" fw={700} ta="center" style={{ color: "#000475" }}>
            My Favorite Pokémon
        </Text>
         

          <Anchor
            component={Link}
            to="/home"
            underline="hover"
            style={{ textUnderlineOffset: "6px", padding: "6px 30px", color: "#A10819" }}
            fw={700}
            size='xl'> Home </Anchor>
        </Flex>
      </AppShellHeader>
      <AppShellMain pt={80}>

        {!selectedPokemon && (
          <div
            style={{
              paddingLeft: isSmallScreen ? '20px' : '100px',
              paddingRight: isSmallScreen ? '20px' : '100px',
              paddingTop: '20px',
              paddingBottom: '40px',
            }}
          >
            {favorites.length === 0 ? (
              <Text ta="center" c="dimmed">
                No favorites yet. Tap the heart on any Pokémon to add it here.
              </Text>
            ) : (
              <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing={40}>
                {favorites.map((pokemon) => {
                  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                  return (
                    <Card
                      key={pokemon.id}
                      className="pokemon-card"
                      shadow="lg"
                      radius={15}
                      padding={isSmallScreen ? 0 : 'sm'}
                      style={{ width: isSmallScreen ? '100%' : 'auto', position: 'relative' }}
                      onClick={() => { setSelectedPokemon({ id: pokemon.id, name: pokemon.name }); }} >
                      <Box
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          cursor: 'pointer',
                          paddingRight: '5px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Image
                          src={isFav(pokemon.id) ? filledHeart : emptyHeart}
                          width={18}
                          height={18}
                          fit="contain"
                          alt="favorite-toggle"
                          onClick={() => toggleFavorite(pokemon.id, pokemon.name)}
                        />
                      </Box>

                      <Stack align="center" spacing="xs">
                        <Image
                          src={imageUrl}
                          w={isSmallScreen ? 60 : 80}
                          h={isSmallScreen ? 60 : 80}
                        />
                        <Text
                          size={isSmallScreen ? 'sm' : '1rem'}
                          ta="center"
                          tt="capitalize"
                          fw={800}
                          style={{ color: '#000354' }}
                        >
                          {pokemon.name}
                        </Text>
                      </Stack>
                    </Card>
                  );
                })}
              </SimpleGrid>
            )}
          </div>
        )}

        {selectedPokemon && pokemonDetails && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100vh - 80px)',
              paddingLeft: isSmallScreen ? '20px' : '100px',
              paddingRight: isSmallScreen ? '20px' : '100px',
            }} >
            <Card
              shadow="xl"
              padding="lg"
              radius="md"
              withBorder
              style={{
                position: 'relative',
                background: 'radial-gradient(circle,white,#D1C593)',
                width: isSmallScreen ? '450px' : '500px',
                height: isSmallScreen ? '450px' : '400px',
                margin: '0 auto',
              }}>
              <Grid gutter="md">
                <Grid.Col
                  span={isSmallScreen ? 8 : 7}
                  style={{ display: 'flex', flexDirection: 'column' }} >
                  <Button
                    className="backArrow"
                    variant="transparent"
                    style={{ width: 'fit-content', padding: 0, margin: '10px' }}
                    onClick={() => {
                      setSelectedPokemon(null);
                      setPokemonDetails(null);
                    }}>
                    <Image src={leftArrow} height={30} width={30} />
                  </Button>
                  <Text size="xl" fw={700} tt="capitalize" margin="5">
                    {pokemonDetails.name}
                  </Text>
                  <Image
                    src={pokemonDetails.sprites?.other?.['official-artwork']?.front_default}
                    fit="contain"
                    width={200}
                    height={200}
                    alt={pokemonDetails.name}
                  />
                </Grid.Col>
                <Grid.Col span={isSmallScreen ? 4 : 5}>
                  <Box
                    style={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer', padding: '10px' }}>
                    <Image
                      src={isFav(pokemonDetails.id) ? filledHeart : emptyHeart}
                      onClick={() => {
                        const nowFav = isFav(pokemonDetails.id);
                        toggleFavorite(pokemonDetails.id, pokemonDetails.name);
                        if (nowFav) {
                          setSelectedPokemon(null);
                          setPokemonDetails(null);
                        }
                      }}
                      width={20}
                      height={20}
                      fit="contain"
                      alt="favorite-toggle"
                    />
                  </Box>

                  <Text size="lg" fw={600} mt="60"> Height: {pokemonDetails.height} </Text>
                  <Text size="lg" fw={600} mt="lg">  Types: </Text>
                  {pokemonDetails.types?.map((typeObj) => (
                    <Text key={typeObj.type.name}>{typeObj.type.name}</Text>
                  ))}
                  <Text size="lg" fw={600} mt="lg">Abilities: </Text>
                  {pokemonDetails.abilities?.map((abilityObj) => (
                    <Text key={abilityObj.ability.name}>{abilityObj.ability.name}</Text>
                  ))}
                </Grid.Col>
              </Grid>
            </Card>
          </div>
        )}
      </AppShellMain>
    </AppShell>
  );
}
export default Favorite;