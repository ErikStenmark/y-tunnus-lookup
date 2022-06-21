import fetch from 'node-fetch';

const fetchBusiness = async (businessId: string) => {
    const response = await fetch(`https://avoindata.prh.fi/bis/v1/${businessId}`);
    const data = await response.json();
    return data;
}

(async () => {
    const data = await fetchBusiness('1080465-1');
    console.log(data);
})();