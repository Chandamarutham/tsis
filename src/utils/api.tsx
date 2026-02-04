type JsonValue = string | number | boolean | null;
interface JsonObject {
    [key: string]: JsonValue | JsonObject;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        status?: number;
    };
}

export async function invokeApi<TReq = JsonObject, TRes = JsonObject>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    {
        body,
        queryParams,
        headers
    }: {
        body?: TReq;
        queryParams?: Record<string, JsonValue>;
        headers?: Record<string, string>;
    } = {}
): Promise<ApiResponse<TRes>> {
    const baseUrl: string = import.meta.env.VITE_API_BASE_URL;
    let url: string = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    url += endpoint;

    const fetchUrl: URL = new URL(url);
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                fetchUrl.searchParams.append(key, String(value));
            }
        });
    }

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(fetchUrl.toString(), options);
        
        if (!response.ok) {
            if (response.status === 403) {
                return {
                    success: false,
                    error: {
                        code: 'RECORD_LOCKED',
                        message: 'This record is locked and cannot be modified.',
                        status: 403
                    }
                };
            } // Handle other HTTP errors
            
            return {
                success: false,
                error: {
                    code: 'API_ERROR',
                    message: `API request failed with status ${response.status}`,
                    status: response.status
                }
            };
        }
        
        const data = await response.json() as TRes;
        return {
            success: true,
            data
        };
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            return {
                success: false,
                error: {
                    code: 'NETWORK_ERROR',
                    message: 'Unable to connect to the server. Please check if the backend is running.'
                }
            };
        }
        
        return {
            success: false,
            error: {
                code: 'UNKNOWN_ERROR',
                message: error instanceof Error ? error.message : 'An unknown error occurred'
            }
        };
    }
}
