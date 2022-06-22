import HttpClient from './http-client';
import RphService from './rph-service';
import Validate from './validator';

const fetchBusiness = async (businessId: string) => {
    const validate = new Validate();

    if (validate.businessId(businessId)) {
        const client = new HttpClient();
        const rphService = new RphService(client);

        const data = await rphService.getById(businessId);
        return data;
    }

}

(async () => {
    try {
        const data = await fetchBusiness('1080465-1');
        console.log(data);
    } catch (e) {
        console.log(e);
    }
})();