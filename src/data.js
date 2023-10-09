export async function fetchData() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT54lhsjwhQEouwKyJT57Mzxx0WyXBaBM0ZkZoUT3Hf0tqw_z1k72RkYtrsCwReBxFtp1IRIDfZ7jSz/pub?gid=0&single=true&output=csv";

  const headers = {
    accept: "*/*",
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.text();

    const lines = data.split('\n');
  
    // Initialize an array to store the JSON objects
    const jsonArray = [];
  
    // Iterate over each line (excluding the header) and create JSON objects
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',');
        const jsonObject = {
          year: parseInt(values[0]),
          make: values[1],
          model: values[2],
          styling: parseInt(values[3]),
          acceleration: parseInt(values[4]),
          handling: parseInt(values[5]),
          funFactor: parseInt(values[6]),
          coolFactor: parseInt(values[7]),
          totalWeekend: parseInt(values[8]),
          features: parseInt(values[9]),
          comfort: parseInt(values[10]),
          quality: parseInt(values[11]),
          practicality: parseInt(values[12]),
          value: parseInt(values[13]),
          totalDaily: parseInt(values[14]),
          dougscore: parseInt(values[15]),
          country: values[16],
        };
        jsonArray.push(jsonObject);
      }
    }
  
    return jsonArray;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
