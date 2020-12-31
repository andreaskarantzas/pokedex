/**
 * Created by andreaskarantzas on 27.12.20.
 */
import * as React from "react";
import { Grid, Paper } from "@material-ui/core";
import { useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/rootReducer";
import { makeStyles } from "@material-ui/core/styles";
import { PokemonPageImage } from "./PokemonPageImage";
import { PokemonPageTabs } from "./PokemonPageTabs/PokemonPageTabs";
import { Pokemon } from "../../types/Pokemon";
import { PokemonPageControls } from "./PokemonPageControls";
import { useEffect } from "react";
import { fetchPokemonsByIdOrName } from "../../features/pokemonsList/pokemonListSlice";
import { PageTitleNavigation } from "../../components/Navigation/PageTitleNavigation";
import { Capitalize } from "../../Util/Capitalize";
import { PokemonSpecies } from "../../types/PokemonSpecies";
import { fetchPokemonSpeciesById } from "../../features/pokemonSpecies/pokemonSpeciesSlice";

export const PokemonPage: React.FC = () => {
  const classes = useStyles();
  const match = useRouteMatch<any>();
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.pokemon);
  const { speciesData } = useSelector(
    (state: RootState) => state.pokemonSpecies
  );
  const selectedPokemon = data.find(
    (p: Pokemon) => p && p.id === Number(match.params.id)
  );
  const selectedPokemonSpecies = speciesData.find(
    (ps: PokemonSpecies) => ps && ps.id === Number(match.params.id)
  );

  useEffect(() => {
    fetchPokemonIfUnavailable();
    fetchPokemonSpeciesIfUnavailable();
  }, []);

  const fetchPokemonIfUnavailable = () => {
    if (!selectedPokemon) {
      dispatch(fetchPokemonsByIdOrName(match.params.id));
    }
  };

  const fetchPokemonSpeciesIfUnavailable = () => {
    if (!selectedPokemonSpecies) {
      dispatch(fetchPokemonSpeciesById(match.params.id));
    }
  };

  if (selectedPokemon && selectedPokemonSpecies) {
    return (
      <Grid container justify="center" alignContent="center">
        <Grid item xs={12} lg={8} className={classes.container}>
          <PageTitleNavigation
            title={Capitalize(selectedPokemon.name)}
            canGoBack={true}
          />
          <Paper className={classes.paper}>
            <Grid container direction="row" className={classes.innerContainer}>
              <PokemonPageImage pokemon={selectedPokemon} />
              <PokemonPageTabs
                pokemon={selectedPokemon}
                species={selectedPokemonSpecies}
              />
            </Grid>
          </Paper>
          <PokemonPageControls pokemon={selectedPokemon} />
        </Grid>
      </Grid>
    );
  }
  return null;
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "16px 32px",
  },
  paper: {
    borderRadius: theme.spacing(4),
    width: "100%",
    marginTop: theme.spacing(4),
  },
  innerContainer: {
    padding: theme.spacing(4),
  },
}));
