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
import Grow from "@mui/material/Grow";
import Zoom from "@mui/material/Zoom";

import { TransitionGroup } from "react-transition-group";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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
  const [searchResultsNumber, setSearchResultsNumber] = useState(1);

  const [visibleResults, setVisibleResults] = useState([]);

  function handleSearchButtonClick() {
    setpaginationPage(1);
    setVisibleResults([...searchResults].splice(0, 10));
  }
  useEffect(() => {
    fetchData()
      .then((data) => {
        // let tmp_data = data.data.slice(0, 10);
        let tmp_data = data.map((car, index) => {
          return { ...car, index: index };
        });
        setCarsData(tmp_data);
        setSearchResults(tmp_data);
        setSearchResultsNumber(Math.ceil(tmp_data.length / 10));
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
    setSearchParamsChanged(true);

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
    const formatedLabelsToColumnHeaders = {
      DougScore: "dougscore",
      "Total Daily Score": "totalDaily",
      "Total Weekend Score": "totalWeekend",
      Year: "year",
      Styling: "styling",
      Acceleration: "acceleration",
      Handling: "handling",
      "Fun Factor": "funFactor",
      "Cool Factor": "coolFactor",
      Features: "features",
      Comfort: "comfort",
      Quality: "quality",
      Practicality: "practicality",
      Value: "value",
    };

    // More Filter 
    if (searchParams.fieldToFilter != null) {
      results = results.filter((car) => {
        const tmpFieldToFilter =
          formatedLabelsToColumnHeaders[searchParams.fieldToFilter];

        if (car[tmpFieldToFilter] >= searchParams.filedToFilterFrom) {
          return true;
        } else {
          return false;
        }
      });

      results = results.filter((car) => {
        const tmpFieldToFilter =
          formatedLabelsToColumnHeaders[searchParams.fieldToFilter];

        if (car[tmpFieldToFilter] <= searchParams.filedToFilterTo) {
          return true;
        } else {
          return false;
        }
      });
    }

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

    setSearchResultsNumber(Math.ceil(results.length / 10));

    setAutocompleteOptions({
      ...autocompleteOptions,
      country: countries.sort(),
      make: makes.sort(),
      model: models.sort(),
      sortBy: defaultAutocompleteOptions.sortBy,
      fieldToFilter: defaultAutocompleteOptions.fieldToFilter,
    });

    //Sorting
    // results = results.sort((car1, car2) => {
    //   const tmpFieldToSort =
    //     formatedLabelsToColumnHeaders[searchParams.sort_by];

    //   if (searchParams.sort_order == "Asc") {
    //     return car1[tmpFieldToSort] > car2[tmpFieldToSort] ? 1 : -1;
    //   }

    //   if (searchParams.sort_order == "Desc") {
    //     return car1[tmpFieldToSort] < car2[tmpFieldToSort] ? 1 : -1;
    //   }
    //   return 0;
    // });

    // results = results.sort((car1, car2) => {
    //   const tmpFieldToSort =
    //     formatedLabelsToColumnHeaders[searchParams.sort_by];

    //     return car1[tmpFieldToSort] > car2[tmpFieldToSort] ? 1 : -1;

    // });

    setSearchResults(results);
  }

  useEffect(() => {
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
        <Container maxWidth="md" sx={{ mt: 6 }}>
          <Box>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              component="p"
            >
              This application pulls data from Doug's Google Sheet and gives you
              the ability to Filter & Sort and presents it nicely. For more
              information on how the scores are evaluated, visit Doug's website
              at{" "}
              <Link
                target="_blank"
                rel="noreferrer"
                sx={{ textDecoration: "none", color: "green" }}
                href="https://www.dougdemuro.com"
              >
                www.dougdemuro.com
              </Link>
            </Typography>
          </Box>
        </Container>
        <Container maxWidth="md" sx={{ mt: 6 }}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "15px",
              position: "relative",
            }}
            variant="outlined"
          >
            <Backdrop
              sx={{
                color: "green",
                backgroundColor: "rgba(240, 255, 239, 0.1)",
                backdropFilter: "blur(3px)",
                zIndex: 3,
                position: "absolute",
              }}
              open={carsData.length == 0}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" marginBottom={1}>
                  Filter & Sort
                </Typography>
                {searchParamsChanged === true &&
                  visibleResults.length !== 0 && (
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
                    onClick={() => {
                      handleSearchButtonClick();
                    }}
                    sx={{
                      color: "white",
                      textTransform: "none",
                      borderRadius: "13px",
                    }}
                  >
                    {`Show ${searchResults.length} search results `}
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Container>

        {visibleResults.length > 0 && (
          <Container maxWidth="md" sx={{ mt: 6 }}>
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
              {visibleResults.map((car, index) => (
                <Grid key={index} item xs={12} md={6} lg={6}>
                  <Grow key={car.index} in={car != null} unmountOnExit>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "15px",
                        border: "2px solid green",
                        boxShadow: "none",
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
                              <Typography variant="body1"> WEEKEND:</Typography>
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
                              <Score title="Fun Factor" value={car.funFactor} />
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
                              href={`https://www.youtube.com/results?search_query=Doug+DeMuro+${car.year}+${car.make}+${car.model}`}
                              target="_blank"
                            >
                              YouTube
                            </Button>
                          </Grid>
                        </Grid>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Stack alignItems={"center"}>
                  <Pagination
                    count={searchResultsNumber}
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
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Box sx={{ bgcolor: "background.paper", px: 6 }} component="footer">
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            This is my first application build with ReactJS. The data used in
            this application is publicly accessible and belongs to Doug Demuro.
            All credit for his outstanding work goes to him.
          </Typography>
        </Box>
      </Container>

      {/* End footer */}
    </ThemeProvider>
  );
}

export default App;
