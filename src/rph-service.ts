import { IHttpClient } from './http-client';

type Address = {
    street: string;
    postCode: number;
    city: string;
}

type BusinessLine = {
    code: string;
    description: string;
}

type GetBusinessResponse = {
    name: string;
    website: string;
    address: Address;
    businessLine: BusinessLine;
}

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
        const [result] = data.results;

        return this.extractData(result);
    }

    private buildUrl(businessId: string): string {
        return `${this.apiUrl}/${businessId}`;
    }

    private extractData(data: ReturnData): GetBusinessResponse {
        return {
            name: this.extractName(data),
            address: this.extractAddress(data),
            businessLine: this.extractBusinessLine(data),
            website: this.extractWebSite(data)
        }
    }

    private extractName(data: ReturnData): string {
        const [current] = this.getCurrent(data.names);
        return current.name;
    }

    private extractAddress(data: ReturnData): Address {
        const [current] = this.getCurrent(data.addresses);
        const { street, postCode, city } = current;
        return {
            street,
            postCode,
            city
        }
    }

    private extractBusinessLine(data: ReturnData, lang = 'EN'): BusinessLine {
        const current = this.getCurrent(data.businessLines);
        const byLang = this.getByLang(data.businessLines, lang);
        const fallBack = !byLang.length ? current[0] : byLang[0];

        return {
            code: fallBack.code,
            description: fallBack.name
        }
    }

    private extractWebSite(data: ReturnData): string {
        const [current] = this.getCurrent(data.contactDetails);
        return current.value;
    }

    private getCurrent(data: DataEntry[]) {
        return data.filter(entry => entry.endDate === null);
    }

    private getByLang(data: DataEntry[], language: string) {
        return data.filter(entry => entry.language === language);
    }

}