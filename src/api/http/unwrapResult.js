// Unwraps the HypeGrid backend envelope { success, message, data } (or the
// failure shape { success:false, code, message }). Throws an Error carrying
// `code` + `status` on failure.
export function unwrapResult(response) {
  const result = response?.data;

  if (!result || typeof result !== 'object') {
    const error = new Error('No response data returned from server.');
    error.code = 'NO_RESPONSE_DATA';
    throw error;
  }

  const isSuccess = result.success === true || result.isSuccess === true;
  if (!isSuccess) {
    const error = new Error(result.message || 'Request failed.');
    error.code = result.code || 'REQUEST_FAILED';
    error.result = result;
    throw error;
  }

  return result.data ?? null;
}
