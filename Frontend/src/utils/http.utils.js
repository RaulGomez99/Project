export default class Http {

    static postRequest = (data, url, method) => {
        const init = {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        };
        console.log(init);
        const request = new Request(url, init);
        return request;
    }

    static post = async (body, url) => {
        const request = this.postRequest(body, url, 'POST');
        const res = await fetch(request);
        const data = res.json();
        return data;
    };

    static get = async (url) => {
        const res = await fetch(url);
        const data = res.json();
        return data;
    };
}