export enum ApiErrorEnum {
  SOCKET_ERROR = 'SOCKET_ERROR',
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class ApiError extends Error {
  constructor(
    public code: ApiErrorEnum | string,
    public message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromError(error: any): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error.name === 'TimeoutError') {
      return new ApiError(ApiErrorEnum.TIMEOUT_ERROR, 'Request timed out', error);
    }

    if (error.name === 'NetworkError') {
      return new ApiError(ApiErrorEnum.NETWORK_ERROR, 'Network error', error);
    }

    if (error.response) {
      const message = error.response.data?.message || error.message;
      return new ApiError(error.response.data?.code || ApiErrorEnum.API_ERROR, message, error);
    }

    return new ApiError(ApiErrorEnum.UNKNOWN_ERROR, error.message || 'Unknown error', error);
  }
} 