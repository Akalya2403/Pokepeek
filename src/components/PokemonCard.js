import './PokemonCard.css';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import axios from 'axios';
import leftArrow from '../Assets/left-arrow.png';
import emptyHeart from '../Assets/emptyHeart.png';
import filledHeart from '../Assets/filledHeart.png';
import { Card, Stack, Image, Text, SimpleGrid, Pagination, Button, Grid, Box } from '@mantine/core';


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

const PokemonCard = ({ searchedPokemonDetails, onClearSearch }) => {
  const URL = 'https://pokeapi.co/api/v2/pokemon?limit=100';
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState();
  const [favorites, setFavorites] = useState([]);

  const isSmallScreen = useMediaQuery('(max-width: 768px)');


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
    axios
      .get(URL)
      .then((response) => setData(response.data))
      .catch((error) => {
        console.log('fetching error', error);
      });
  }, []);


  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);


  useEffect(() => {
    if (searchedPokemonDetails) {
      setSelectedPokemon({
        name: searchedPokemonDetails.name,
        url: `https://pokeapi.co/api/v2/pokemon/${searchedPokemonDetails.name}`,
      });
      setPokemonDetails(searchedPokemonDetails);
    }
  }, [searchedPokemonDetails]);


  useEffect(() => {
    if (selectedPokemon && !searchedPokemonDetails) {
      axios.get(selectedPokemon.url).then((response) => setPokemonDetails(response.data));
    }
  }, [selectedPokemon, searchedPokemonDetails]);

  const pokemonList = data?.results || [];
  const cardPerPage = 10;
  const startIndex = (currentPage - 1) * cardPerPage;
  const endIndex = startIndex + cardPerPage;
  const currentCard = pokemonList.slice(startIndex, endIndex);

  return (
    <div
      style={{
        paddingLeft: selectedPokemon ? (isSmallScreen ? '15px' : '20px') : (isSmallScreen ? '20px' : '100px'),
        paddingRight: selectedPokemon ? (isSmallScreen ? '15px' : '20px') : (isSmallScreen ? '20px' : '100px'),
      }}
    >
      {selectedPokemon === null ? (
        <>
          <Text c="dimmed" ta="center" size="xs" style={{ paddingTop: '5px' }}>
            ✨Every Pokémon has a story — explore them all and bookmark your heroes in favorites!
          </Text>

          <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing={40} pt={40} pb={40}>
            {currentCard.map((item) => {
              const parts = item.url.split('/');
              const id = parts[parts.length - 2];
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

              return (
                <div key={id}>
                  <Card
                    className="pokemon-card"
                    shadow="lg"
                    radius={15}
                    padding={isSmallScreen ? 0 : 'sm'}
                    style={{ width: isSmallScreen ? '100%' : 'auto', position: 'relative' }}
                    onClick={() => {
                      setSelectedPokemon(item);
                      onClearSearch();
                    }}
                  >
                    <Box style={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer', paddingRight: '5px' }}>
                      <Image
                        src={isFav(id) ? filledHeart : emptyHeart}
                        width={18}
                        height={18}
                        fit="contain"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(id, item.name);
                        }}
                        alt="favorite-toggle"
                      />
                    </Box>

                    <Stack align="center" spacing="xs">
                      <Image src={imageUrl} w={isSmallScreen ? 60 : 80} h={isSmallScreen ? 60 : 80} />
                      <Text
                        size={isSmallScreen ? 'sm' : '1rem'}
                        ta="center"
                        tt="capitalize"
                        fw={800}
                        style={{ color: '#000354' }}
                      >
                        {item.name}
                      </Text>
                    </Stack>
                  </Card>
                </div>
              );
            })}
          </SimpleGrid>

          <Pagination total={10} size="xs" radius="xl" color="#FF5B69"
            style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}
            onChange={setCurrentPage}
          />
        </>
      ) : (
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
          {pokemonDetails && (
            <Card shadow="xl" padding="lg" radius="md" withBorder
              style={{
                position: 'relative',
                background: 'radial-gradient(circle,white,#D1C593)',
                width: isSmallScreen ? '450px' : '500px',
                height: isSmallScreen ? '450px' : '400px',
                margin: '0 auto',
              }} >
              <Grid gutter="md">
                <Grid.Col
                  span={isSmallScreen ? 8 : 7}
                  style={{ display: 'flex', flexDirection: 'column' }}>
                  <Button
                    className="backArrow"
                    variant="transparent"
                    style={{ width: 'fit-content', padding: 0, margin: '10px' }}
                    onClick={() => {
                      setSelectedPokemon(null);
                      setPokemonDetails(null);
                      onClearSearch();
                    }}
                  >
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
                      onClick={() => { toggleFavorite(pokemonDetails.id, pokemonDetails.name); }}
                      width={20}
                      height={20}
                      fit="contain"
                      alt="favorite-toggle"
                    />
                  </Box>

                  <Text size="lg" fw={600} mt="60">Height: {pokemonDetails.height}</Text>

                  <Text size="lg" fw={600} mt="lg"> Types:</Text>
                  {pokemonDetails.types?.map((typeObj) => (
                    <Text key={typeObj.type.name}>{typeObj.type.name}</Text>
                  ))}

                  <Text size="lg" fw={600} mt="lg"> Abilities:</Text>
                  {pokemonDetails.abilities?.map((abilityObj) => (
                    <Text key={abilityObj.ability.name}>{abilityObj.ability.name}</Text>
                  ))}
                </Grid.Col>
              </Grid>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default PokemonCard;
