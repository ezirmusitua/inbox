type tFetchRequestBody = string | Record<string, any> | Blob | FormData;

const base = "http://localhost:31312";

interface iFetchOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
    params?: Record<string, any>;
    query?: Record<string, any>;
    data?: tFetchRequestBody;
    headers?: Record<string, any>;
    raw_options?: Record<string, any>;
    raw_resp?: boolean;
    raw_body?: boolean;
}

function concat_url(
    url: string,
    params: Record<string, any>,
    query: Record<string, any>,
) {
    Object.keys(params).forEach((key) => {
        url = url.replace(new RegExp(key, "i"), params[key] + "");
    });
    url += "?" + new URLSearchParams(query).toString();
    return `${base}/${url}`;
}

export async function _fetch(options: iFetchOptions) {
    const _headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    const is_json = _headers["Content-Type"] === "application/json";
    const is_form =
        _headers["Content-Type"] === "application/x-www-form-urlencoded";
    const is_blob_data = options.data && options.data instanceof Blob;
    const is_form_data = options.data && options.data instanceof FormData;
    const is_string_data = options.data && options.data instanceof String;

    let _body = null as string | FormData | Blob;
    if (is_blob_data || is_form_data || is_string_data) {
        _body = options.data as Blob | FormData | string;
    } else if (is_json) {
        _body = JSON.stringify(_body);
    } else if (is_form) {
        const form_data = new FormData();
        Object.keys(options.data).forEach((field: string) => {
            form_data.append(field, options.data[field]);
        });
        _body = form_data;
    }
    const _url = concat_url(
        options.url,
        options.params || {},
        options.query || {},
    );
    const resp = await fetch(_url, {
        method: options.method || "GET",
        headers: _headers,
        body: _body,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        ...(options.raw_options || {}),
    });
    if (options.raw_resp) return resp;
    const is_success = resp.ok;
    if (options.raw_body && is_success) return resp.body;
    if (options.raw_body && !is_success) throw resp.body;
    const resp_data = is_json ? await resp.json() : resp.text;
    if (!is_success) throw resp_data;
    return resp_data;
}

export interface iFetchRequest {
    url: string;
    params?: Record<string, any>;
    query?: Record<string, any>;
    headers?: Record<string, any>;
}

export const get = (options: iFetchRequest) => _fetch(options);

export interface iFetchRequestWithData extends iFetchRequest {
    data: tFetchRequestBody;
}

export const post = (options: iFetchRequestWithData) =>
    _fetch({ method: "POST", ...options });

export const put = (options: iFetchRequestWithData) =>
    _fetch({ method: "PUT", ...options });

export const del = (options: iFetchRequest) =>
    _fetch({ method: "DELETE", ...options });

export interface iUploadRequest extends iFetchRequest {
    method: "POST" | "PUT";
    data: Record<string, File>;
}

export const upload = (options: iUploadRequest) => {
    return _fetch({
        ...options,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...(options.headers || {}),
        },
    });
};
