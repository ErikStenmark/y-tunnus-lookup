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

        return new Promise(async (resolve, reject) => {
            if (!response.ok) {
                reject({
                    status: response.status,
                    response: response.statusText
                })
            }

            let data = {} as T;

            try {
                data = await response.json();
            } catch {
                reject({
                    status: response.status,
                    response: 'unable to parse JSON response'
                });
            }

            resolve({
                statusCode: response.status,
                data
            });
        });
    }
}