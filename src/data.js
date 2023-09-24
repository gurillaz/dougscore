export async function fetchData() {
    const url = 'https://api.fureweb.com/spreadsheets/1maG5rJgUn0K50p93r0YUbJjejKcVZPmhDxFQ_hwADRg';
    const headers = {
      accept: '*/*',
    };
  
    try {
      const response = await fetch(url, { headers });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  
export function getTopTenCars(data){

    const sortedData = data.sort((a,b)=>a.DougScore > b.DougScore);

    const topTen = sortedData.splice(0,10);

    return topTen;

}