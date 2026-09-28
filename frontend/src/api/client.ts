const BASE_URL = "http://127.0.0.1:5000"

type RequestOptions = {
    method? : string,
    body?: unknown
}


export async function request<T>(path:string, opts:RequestOptions = {}): Promise<T> {
    const res = await fetch(BASE_URL + path, {
        method: opts.method ?? "GET",
        headers: {
            ...(opts.body !== undefined ? {'Content-Type':'application/json'} : {})
        },
        body: opts.body !== undefined ? JSON.stringify(opts.body): undefined
    })

    if (!res.ok) throw await Error(`${res.status} ${res.statusText}`);
    const text = await res.text();

    return (text ? JSON.parse(text):undefined) as T
}