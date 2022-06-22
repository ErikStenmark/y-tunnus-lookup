import HttpClient from './http-client';
import RphService from './rph-service';

const fetchBusiness = async (businessId: string) => {
    const client = new HttpClient();
    const rphService = new RphService(client);

    const data = await rphService.getById(businessId);
    console.log(data);
}

(async () => {
    const data = await fetchBusiness('1080465-1');
    console.log(data);
})();