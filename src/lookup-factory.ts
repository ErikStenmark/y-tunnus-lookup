import HttpClient from './http-client';
import RphService from './rph-service';
import Validate from './validator';

const lookupFactory = () => {
    const validate = new Validate();
    const client = new HttpClient();
    const rphService = new RphService(client);

    return async (businessId: string) => {

        if (!validate.businessId(businessId)) {
            throw new Error('invalid business id');
        }

        return await rphService.getById(businessId);
    }
};

export default lookupFactory;