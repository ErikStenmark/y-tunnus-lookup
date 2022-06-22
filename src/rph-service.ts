import { IHttpClient } from './http-client';

type Address = {
    street: string;
    postCode: string;
    city: string;
}

type BusinessLine = {
    code: string;
    description: string;
}

type GetBusinessResponse = Partial<{
    name: string;
    website: string;
    address: Partial<Address>;
    businessLine: Partial<BusinessLine>;
}>

type ReturnData = {
    names: DataEntry[];
    addresses: DataEntry[];
    businessLines: DataEntry[];
    contactDetails: DataEntry[];
    [key: string]: DataEntry[];
}

type DataEntry = {
    registrationDate: string;
    endDate: string | null;
    language: string;
    [key: string]: any
}

type WrappedReturnData = {
    results: ReturnData[];
}

export interface IRphService {
    getById(businessId: string): Promise<GetBusinessResponse>;
}

export default class RphService implements IRphService {

    private apiUrl = 'https://avoindata.prh.fi/bis/v1';

    constructor(
        private client: IHttpClient
    ) { }

    public async getById(businessId: string): Promise<GetBusinessResponse> {
        const url = this.buildUrl(businessId);
        const { data } = await this.client.get<WrappedReturnData>(url);

        if (!data) {
            return {};
        }

        return this.extractData(data);
    }

    private buildUrl(businessId: string): string {
        return `${this.apiUrl}/${businessId}`;
    }

    private extractData(data: WrappedReturnData): GetBusinessResponse {
        const result: GetBusinessResponse = {}

        if (!data.results.length) {
            return result
        };

        const [firstEntry] = data.results;

        return {
            name: this.extractName(firstEntry),
            address: this.extractAddress(firstEntry),
            website: this.extractWebSite(firstEntry),
            businessLine: this.extractBusinessLine(firstEntry)
        };
    }

    private extractName(data: ReturnData): string {
        if (!data.names?.length) {
            return '';
        }

        const [current] = this.getCurrent(data.names);

        if (current) {
            return current.name || '';
        }

        return data.names[0].name || '';
    }

    private extractAddress(data: ReturnData): Partial<Address> {
        const result: Partial<Address> = {};

        if (!data.addresses?.length) {
            return result;
        }

        const current = this.getCurrent(data.addresses);

        if (!current.length) {
            return result;
        }

        const { street, postCode, city } = current[0];

        return {
            street: street || '',
            postCode: postCode || '',
            city: city || ''
        }
    }

    private extractBusinessLine(data: ReturnData, lang = 'EN'): Partial<BusinessLine> {
        const result: Partial<BusinessLine> = {}

        if (!data.businessLines?.length) {
            return result;
        }

        const current = this.getCurrent(data.businessLines);

        if (!current.length) {
            return result;
        }

        const [byLang] = this.getByLang(data.businessLines, lang);
        const businessLine = !byLang ? current[0] : byLang;

        return {
            code: businessLine.code || '',
            description: businessLine.name || ''
        }
    }

    private extractWebSite(data: ReturnData): string {
        if (!data.contactDetails?.length) {
            return '';
        }

        const sites = data.contactDetails.filter(entry => entry.type.includes('www' || 'Website'));
        const current = this.getCurrent(sites);

        if (current.length) {
            return current[0].value || ''
        };

        if (sites.length) {
            return sites[0].value || ''
        }

        return '';
    }

    private getCurrent(data: DataEntry[]) {
        return data.filter(entry => entry.endDate === null);
    }

    private getByLang(data: DataEntry[], language: string) {
        return data.filter(entry => entry.language === language);
    }

}