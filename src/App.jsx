import React, { useEffect, useState } from "react";
import { fetchData } from "./data"; // Import the fetchData function
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { Divider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TextField from "@mui/material/TextField";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import Autocomplete from "@mui/material/Autocomplete";
import Pagination from "@mui/material/Pagination";
import Fade from "@mui/material/Fade";

import { TransitionGroup } from "react-transition-group";

function Score({ title, value }) {
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      alignContent={"center"}
    >
      <Typography variant="overline" sx={{ lineHeight: 1.5 }}>
        {title}:
      </Typography>
      <Typography variant="overline" sx={{ lineHeight: 1.5 }}>
        {value}
      </Typography>
    </Stack>
  );
}

const defaultTheme = createTheme();

function App() {
  const [carsData, setCarsData] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [searchParamsChanged, setSearchParamsChanged] = useState(false);
  const [paginationPage, setpaginationPage] = useState(1);

  const [defaultAutocompleteOptions, setDefaultAutocompleteOptions] = useState({
    make: [],
    model: [],
    country: [],
    sortBy: [
      "DougScore",
      "Total Daily Score",
      "Total Weekend Score",
      "Country",
      "Styling",
      "Acceleration",
      "Handling",
      "Fun Factor",
      "Cool Factor",
      "Features",
      "Comfort",
      "Quality",
      "Practicality",
      "Value",
    ],
    sort_order: ["Asc", "Desc"],

    fieldToFilter: [
      "DougScore",
      "Total Daily Score",
      "Total Weekend Score",
      "Year",
      "Styling",
      "Acceleration",
      "Handling",
      "Fun Factor",
      "Cool Factor",
      "Features",
      "Comfort",
      "Quality",
      "Practicality",
      "Value",
    ],
    filedToFilterFrom: null,
    filedToFilterTo: null,
  });

  const [autocompleteOptions, setAutocompleteOptions] = useState({
    make: [],
    model: [],
    country: [],
    year: [],
    sortBy: [],
    sort_order: ["Asc", "Desc"],
    fieldToFilter: [],
  });

  const [searchParams, setSearchParams] = useState({
    make: null,
    model: null,
    country: null,
    filedToFilterFrom: "",
    filedToFilterTo: "",
    fieldToFilter: null,
    sort_by: "DougScore",
    sort_order: "Desc",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [visibleResults, setVisibleResults] = useState([]);

  function handleSearchButtonClick() {
    setSearchParamsChanged(false);

    setpaginationPage(1);
    setVisibleResults([...searchResults].splice(0, 10));
  }

  useEffect(() => {
    fetchData()
      .then((data) => {
        // let tmp_data = data.data.slice(0, 10);
        let tmp_data = data.data.map((car, index) => {
          return { ...car, index: index };
        });
        setCarsData(tmp_data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function handlePaginationPageChange(page) {
    setpaginationPage(page);

    setVisibleResults([...searchResults].splice((page - 1) * 10, 10));
  }

  function handleClearAllFilters() {
    setAutocompleteOptions({ ...defaultAutocompleteOptions });
    setSearchParams({
      make: null,
      model: null,
      country: null,
      filedToFilterFrom: "",
      filedToFilterTo: "",
      fieldToFilter: null,
      sort_by: "DougScore",
      sort_order: "Desc",
    });
    setSearchParamsChanged(false);
    setVisibleResults([]);
  }

  // useEffect(() => {
  //   setVisibleResults(
  //     [...searchResults].splice(paginationPage*10, 10)
  //   );

  // }, [paginationPage]);

  function populateDefaultAutocompleteOptions() {
    let countries = [];
    let makes = [];
    let models = [];

    carsData.map((car) => {
      if (!countries.includes(car.country)) {
        countries.push(car.country);
      }

      if (!makes.includes(car.make)) {
        makes.push(car.make);
      }
      if (!models.includes(car.model)) {
        models.push(car.model);
      }
    });

    setDefaultAutocompleteOptions({
      ...defaultAutocompleteOptions,
      country: countries.sort(),
      make: makes.sort(),
      modelß: models.sort(),
    });

    setAutocompleteOptions({
      ...autocompleteOptions,
      country: countries.sort(),
      make: makes.sort(),
      model: models.sort(),
      sortBy: defaultAutocompleteOptions.sortBy,
      fieldToFilter: defaultAutocompleteOptions.fieldToFilter,
    });
  }

  useEffect(() => {
    populateDefaultAutocompleteOptions();
  }, [carsData]);

  function updateSearchResultsAutocompleteData() {
    let results = carsData;

    results = results.filter((car) => {
      if (searchParams.make == car.make || searchParams.make == null) {
        return true;
      } else {
        return false;
      }
    });
    results = results.filter((car) => {
      if (searchParams.model == car.model || searchParams.model == null) {
        return true;
      } else {
        return false;
      }
    });
    results = results.filter((car) => {
      if (searchParams.country == car.country || searchParams.country == null) {
        return true;
      } else {
        return false;
      }
    });

    console.log(results);

    // if (
    //   searchParams.fieldToFilter != null &&
    //   searchParams.filedToFilterFrom != "" &&
    //   searchParams.filedToFilterTo != "" &&
    //   searchParams.filedToFilterFrom >= car[searchParams.fieldToFilter] &&
    //   searchParams.filedToFilterTo <= car[searchParams.fieldToFilter]
    // ) {
    //   results.push(car);
    // }

    if (results.length == 0) {
      results = [...carsData];
    }

    let countries = [];
    let makes = [];
    let models = [];

    results.map((car) => {
      if (!countries.includes(car.country)) {
        countries.push(car.country);
      }

      if (!makes.includes(car.make)) {
        makes.push(car.make);
      }
      if (!models.includes(car.model)) {
        models.push(car.model);
      }
    });

    setAutocompleteOptions({
      ...autocompleteOptions,
      country: countries.sort(),
      make: makes.sort(),
      model: models.sort(),
      sortBy: defaultAutocompleteOptions.sortBy,
      fieldToFilter: defaultAutocompleteOptions.fieldToFilter,
    });

    setSearchResults(results);
  }

  useEffect(() => {
    setSearchParamsChanged(true);
    // if (searchParams.make == null) {
    //   setSearchParams({ ...searchParams, model: null });
    // }
    updateSearchResultsAutocompleteData();
  }, [searchParams]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar
        position="relative"
        color="transparent"
        sx={{ boxShadow: "none" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            color="green"
            noWrap
            sx={{ marginX: "auto", marginTop: 3 }}
          >
            Better DougScore
          </Typography>
        </Toolbar>
      </AppBar>

      <main>
        <Container maxWidth="md">
          <Box sx={{ p: 6, paddingTop: 4 }}>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              component="p"
            >
              This application pulls data from Doug's Google Sheet and gives you
              the abbility to Filter & Sort and present it nicely. For more
              information on how the scores are evaluated, visit Doug's website
              at{" "}
              <Link
                target="_blank"
                rel="noreferrer"
                sx={{ textDecoration: "none", color: "green" }}
                href="dougdemuro.com"
              >
                www.dougdemuro.com
              </Link>
            </Typography>
          </Box>

          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "15px",
            }}
            variant="outlined"
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" marginBottom={1}>
                  Filter & Sort
                </Typography>
                {searchParamsChanged === true && (
                  <Button
                    size="small"
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    sx={{ color: "green" }}
                    onClick={() => {
                      handleClearAllFilters();
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </Stack>

              <Grid container spacing={1.2} marginTop={3}>
                <Grid item xs={6}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={autocompleteOptions.make}
                    renderInput={(params) => (
                      <TextField {...params} label="Make" />
                    )}
                    value={searchParams.make}
                    onChange={(event, value) =>
                      setSearchParams({
                        ...searchParams,
                        make: value,
                        model: value == null ? null : searchParams.model,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={autocompleteOptions.model}
                    renderInput={(params) => (
                      <TextField {...params} label="Model" />
                    )}
                    value={searchParams.model}
                    onChange={(event, value) =>
                      setSearchParams({ ...searchParams, model: value })
                    }
                    disabled={searchParams.make == null}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    options={autocompleteOptions.country}
                    renderInput={(params) => (
                      <TextField {...params} label="Country" />
                    )}
                    value={searchParams.country}
                    onChange={(event, value) =>
                      setSearchParams({ ...searchParams, country: value })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    size="small"
                    endIcon={
                      showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    }
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    sx={{ color: "green" }}
                    onClick={() => {
                      setShowFilters(!showFilters);
                    }}
                  >
                    More filters
                  </Button>
                </Grid>

                {showFilters && (
                  <>
                    <Grid item xs={12} marginTop={2}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        options={autocompleteOptions.fieldToFilter}
                        renderInput={(params) => (
                          <TextField {...params} label="Filed to Filter" />
                        )}
                        value={searchParams.fieldToFilter}
                        onChange={(event, value) =>
                          setSearchParams({
                            ...searchParams,
                            fieldToFilter: value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Value(From)"
                        size="small"
                        disabled={searchParams.fieldToFilter == null}
                        value={searchParams.filedToFilterFrom}
                        onChange={(event) => {
                          setSearchParams({
                            ...searchParams,
                            filedToFilterFrom: event.target.value,
                          });
                        }}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Value(To)"
                        size="small"
                        disabled={searchParams.fieldToFilter == null}
                        value={searchParams.filedToFilterTo}
                        onChange={(event) => {
                          setSearchParams({
                            ...searchParams,
                            filedToFilterTo: event.target.value,
                          });
                        }}
                        type="number"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>

            <CardActions
              sx={{ marginTop: "0px", paddingTop: 1, paddingBottom: 2 }}
            >
              <Grid container spacing={1.2} paddingX={1}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    color="success"
                    onClick={handleSearchButtonClick}
                    sx={{
                      color: "white",
                      textTransform: "none",
                      borderRadius: "13px",
                    }}
                  >
                    <>
                      {searchResults.length != visibleResults.length
                        ? `Show ${searchResults.length} search results `
                        : "Show All"}
                    </>
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Container>

        {visibleResults.length > 0 && (
          <Container sx={{ py: 8 }} maxWidth="md">
            {/* End hero unit */}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={1} paddingX={2} marginBottom={-1}>
                  <Grid item xs={7}>
                    <Autocomplete
                      size="small"
                      fullWidth
                      color={"success"}
                      options={autocompleteOptions.fieldToFilter}
                      renderInput={(params) => (
                        <TextField {...params} label="Sort By" />
                      )}
                      value={searchParams.sort_by}
                      onChange={(event, value) =>
                        setSearchParams({ ...searchParams, sort_by: value })
                      }
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Autocomplete
                      size="small"
                      fullWidth
                      options={autocompleteOptions.sort_order}
                      renderInput={(params) => (
                        <TextField {...params} label="Sort" />
                      )}
                      value={searchParams.sort_order}
                      onChange={(event, value) => {
                        setSearchParams({ ...searchParams, sort_order: value });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TransitionGroup>
                  {visibleResults.map((car, index) => (
                    <Fade key={car.index} mountOnEnter unmountOnExit>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "15px",
                          border: "2px solid green",
                          boxShadow: "0px 0px 5px -1px rgba(25,189,0,0.56)",
                          marginBottom: 2,
                        }}
                        raised
                      >
                        <CardContent sx={{ flexGrow: 1, paddingBottom: "5px" }}>
                          <Typography
                            mt="0"
                            component="span"
                            color="text.secondary"
                          >
                            {`${car.index}. ${car.year} - ${car.country}`}
                          </Typography>
                          <Typography variant="h5" marginBottom={1}>
                            {`${car.make} - ${car.model}`}
                          </Typography>

                          <Stack
                            marginY={2}
                            direction={"row"}
                            justifyContent={"space-between"}
                          >
                            <Typography variant="h6"> DougScore:</Typography>
                            <Typography
                              component="span"
                              variant="h5"
                              sx={{ fontWeight: "bold" }}
                            >
                              {car.dougscore}{" "}
                              <Typography lineHeight={0} variant="overline">
                                {" "}
                                /100
                              </Typography>
                            </Typography>
                          </Stack>

                          <Divider></Divider>
                          <Grid container spacing={3}>
                            <Grid item xs={6}>
                              {" "}
                              <Stack
                                color="green"
                                marginTop={2}
                                direction={"row"}
                                justifyContent={"space-between"}
                              >
                                <Typography variant="body1">
                                  {" "}
                                  WEEKEND:
                                </Typography>
                                <Typography variant="body1">
                                  {car.totalWeekend}{" "}
                                  <Typography lineHeight={0} variant="overline">
                                    {" "}
                                    /50
                                  </Typography>
                                </Typography>
                              </Stack>
                              <Stack direction="column">
                                <Score title="Styling" value={car.styling} />
                                <Score
                                  title="Acceleration"
                                  value={car.acceleration}
                                />
                                <Score title="Handling" value={car.handling} />
                                <Score
                                  title="Fun Factor"
                                  value={car.funFactor}
                                />
                                <Score
                                  title="Cool Factor"
                                  value={car.coolFactor}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={6}>
                              <Stack
                                color="red"
                                marginTop={2}
                                direction={"row"}
                                justifyContent={"space-between"}
                              >
                                <Typography variant="body1"> DAILY:</Typography>
                                <Typography variant="body1">
                                  {car.totalDaily}{" "}
                                  <Typography lineHeight={0} variant="overline">
                                    {" "}
                                    /50
                                  </Typography>
                                </Typography>
                              </Stack>

                              <Stack direction="column">
                                <Score title="Features" value={car.features} />
                                <Score title="comfort" value={car.comfort} />
                                <Score title="quality" value={car.quality} />
                                <Score
                                  title="practicality"
                                  value={car.practicality}
                                />
                                <Score title="value" value={car.value} />
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions sx={{ paddingTop: "0px" }}>
                          <Grid container>
                            <Grid item xs={8}>
                              <Typography
                                variant="body2"
                                paddingTop={1}
                                paddingLeft={1}
                                color="text.secondary"
                              >
                                {" "}
                                Watch the review on youtube:
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Button
                                startIcon={<YouTubeIcon />}
                                fullWidth
                                sx={{
                                  color: "red",
                                  textTransform: "none",
                                  borderRadius: 0,
                                }}
                              >
                                YouTube
                              </Button>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </Card>
                    </Fade>
                  ))}
                </TransitionGroup>
              </Grid>

              <Grid item xs={12}>
                <Stack alignItems={"center"}>
                  <Pagination
                    count={Math.ceil(searchResults.length / 10)}
                    variant="outlined"
                    shape="rounded"
                    page={paginationPage}
                    onChange={(event, value) =>
                      handlePaginationPageChange(value)
                    }
                  />
                </Stack>
              </Grid>
            </Grid>
          </Container>
        )}
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6, pt: 0 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          This is my first application build with ReactJS. The data used in this
          application is publicly accessible and belongs to Doug Demuro. All
          credit for his outstanding work goes to him.
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}

export default App;
