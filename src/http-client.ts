import fetch from 'node-fetch';

type AnyObject = { [key: string]: any };

export type HttpClientResponse<T = AnyObject> = {
    statusCode: number;
    data: T;
}

export interface IHttpClient {
    get<T = AnyObject>(url: string): Promise<HttpClientResponse<T>>;
}

export default class HttpClient implements IHttpClient {
    public async get<T = AnyObject>(url: string): Promise<HttpClientResponse<T>> {
        const response = await fetch(url);
        const data = await response.json();
        const statusCode = response.status;

        return {
            statusCode,
            data
        }
    }
}