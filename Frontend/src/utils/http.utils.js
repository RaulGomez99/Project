export default class Http {

    static getRequest = (url, token) => {
        const init = {
            headers: {
                "Content-Type": "application/json",
                "authtoken":token
            }
        };
        const request = new Request(url, init);
        return request;
    }

    static postRequest = (data, url, method, token) => {
        const init = {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "authtoken":token
            }
        };
        console.log(init);
        const request = new Request(url, init);
        return request;
    }

    static post = async (body, url, token) => {
        console.log(token);
        const request = this.postRequest(body, url, 'POST', token);
        const res = await fetch(request);
        const data = res.json();
        return data;
    };

    static get = async (url, token) => {
        const request = this.getRequest(url,token);
        const res = await fetch(request);
        const data = res.json();
        return data;
    };
}