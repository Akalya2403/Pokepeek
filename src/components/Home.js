import axios from 'axios';
import { useState, useEffect } from 'react';
import { AppShell, AppShellHeader, Image, Flex, Autocomplete, AppShellMain, Group, Tooltip } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import pokepeek from '../Assets/pokepeek.png';
import heart from '../Assets/heart.png';
import PokemonCard from './PokemonCard';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonNames, setPokemonNames] = useState([]);
  const [searchedPokemonDetails, setSearchedPokemonDetails] = useState(null);

  const isInvalidSearch =
    searchTerm.trim() !== '' &&
    !pokemonNames.some((p) => p.name.toLowerCase() === searchTerm.toLowerCase());

  const isSmallScreen = useMediaQuery('(max-width: 500px)');

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then((res) => setPokemonNames(res.data.results))
      .catch((err) => console.error('Error fetching names', err));
  }, []);

  const handleSearch = (val) => {
    const match = pokemonNames.find((p) => p.name.toLowerCase() === val.toLowerCase());
    if (match) {
      axios
        .get(match.url)
        .then((res) => setSearchedPokemonDetails(res.data))
        .catch(() => alert('Error fetching Pokémon details'));
    } else {
      alert('No Pokémon found with that name');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchedPokemonDetails(null);
  };

  return (
    <div>
      <AppShell>
        <AppShellHeader
          height={80}
          style={{ background: 'linear-gradient(to bottom, #00FFFF,#008080)' }}
        >
          <Flex align="center" justify="space-between" h="100%" px="lg">
            <Image src={pokepeek} fit="contain" h={isSmallScreen ? 70 :100} w={isSmallScreen ? 120 : 200} />
            <Group spacing="xs">
              <Tooltip
                label="View your favourite Pokémon"
                transitionProps={{ transition: 'fade-down', duration: 300 }}
                position="bottom"
                color="gray"
                style={{ fontSize: '12px', padding: '4px 8px' }}
                withArrow
              >
                <Link to="/favorites">
                  <Image src={heart} fit="contain" height={isSmallScreen ? 25 : 40} width={isSmallScreen ? 25 : 40} />
                </Link>
              </Tooltip>

              <Autocomplete
                placeholder="Search Pokémon"
                leftSection={<IconSearch size={16} />}
                rightSection={
                  searchTerm && (
                    <IconX
                      size={16}
                      style={{ cursor: 'pointer' }}
                      onClick={handleClear}
                    />
                  )
                }
                value={searchTerm}
                onChange={setSearchTerm}
                onOptionSubmit={(val) => {
                  setSearchTerm(val);
                  handleSearch(val);
                }}
                data={pokemonNames.map((p) => p.name)}
                style={{ width: isSmallScreen ? '100px' : '200px' }}
                nothingFound="No match"
                withinPortal
                radius="xl"
                searchable
                error={isInvalidSearch ? 'Pokémon not found' : false}
                spellCheck={false}
              />
            </Group>
          </Flex>
        </AppShellHeader>

        <AppShellMain pt={80}>
          <PokemonCard
            searchedPokemonDetails={searchedPokemonDetails}
            onClearSearch={() => {
              setSearchTerm('');
              setSearchedPokemonDetails(null);
            }}
          />
        </AppShellMain>
      </AppShell>
    </div>
  );
};

export default Home;




