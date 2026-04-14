class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = details.status ?? 0;
    this.url = details.url ?? "";
    this.method = details.method ?? "GET";
    this.data = details.data ?? null;
    this.response = details.response;
  }
}

const isFormData = (value) => typeof FormData !== "undefined" && value instanceof FormData;
let refreshHandler = null;

const isJsonLikeObject = (value) => {
  if (value == null) return false;
  if (Array.isArray(value)) return true;
  if (typeof value !== "object") return false;
  if (isFormData(value)) return false;
  if (typeof Blob !== "undefined" && value instanceof Blob) return false;
  if (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) return false;
  return true;
};

const parseResponseBody = async (response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength === "0") {
    return null;
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text === "" ? null : text;
};

const createRequestOptions = (options = {}) => {
  const merged = {
    credentials: "include",
    ...options,
  };

  const headers = new Headers(merged.headers || {});
  const hasBody = Object.prototype.hasOwnProperty.call(merged, "body");

  if (hasBody && isJsonLikeObject(merged.body)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    merged.body = JSON.stringify(merged.body);
  }

  // FormData는 브라우저가 boundary를 포함한 Content-Type을 자동 설정해야 한다.
  if (isFormData(merged.body)) {
    headers.delete("Content-Type");
  }

  merged.headers = headers;
  return merged;
};

const request = async (url, options = {}) => {
  const requestOptions = createRequestOptions(options);
  const method = (requestOptions.method || "GET").toUpperCase();
  const response = await fetch(url, requestOptions);
  const data = await parseResponseBody(response);

  if (!response.ok) {
    const fallback = `HTTP ${response.status} 요청 실패`;
    const serverMessage =
      data && typeof data === "object" && "message" in data ? data.message : null;
    throw new ApiError(serverMessage || fallback, {
      status: response.status,
      url,
      method,
      data,
      response,
    });
  }

  return data;
};

const setAuthRefreshHandler = (handler) => {
  refreshHandler = typeof handler === "function" ? handler : null;
};

const requestAuthResponse = async (url, options = {}) => {
  const buildRequestOptions = () => createRequestOptions(options);
  const firstResponse = await fetch(url, buildRequestOptions());

  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  // refresh 주입이 없는 경우 기존 응답(401)을 그대로 반환한다.
  if (!refreshHandler) {
    return firstResponse;
  }

  let refreshed = false;
  try {
    refreshed = await refreshHandler();
  } catch {
    refreshed = false;
  }

  if (!refreshed) {
    return firstResponse;
  }

  // refresh 성공 시 원요청 1회 재시도
  return fetch(url, buildRequestOptions());
};

const get = (url, options = {}) => request(url, { ...options, method: "GET" });
const post = (url, body, options = {}) => request(url, { ...options, method: "POST", body });
const put = (url, body, options = {}) => request(url, { ...options, method: "PUT", body });
const del = (url, options = {}) => request(url, { ...options, method: "DELETE" });

// request/get/post/put/delete는 기존 파싱/에러 계약을 유지한다.
// 인증이 필요한 Response 호환 요청은 requestAuthResponse를 사용한다.

const httpClient = {
  request,
  requestAuthResponse,
  get,
  post,
  put,
  delete: del,
};

export { ApiError, httpClient, setAuthRefreshHandler };
