export function adaptNetlifyHandler(apiHandler) {
  return async event => {
    let body
    try {
      body = event.body ? JSON.parse(event.body) : undefined
    } catch {
      body = undefined
    }

    const request = {
      method: event.httpMethod,
      headers: event.headers || {},
      query: Object.fromEntries(new URLSearchParams(
        event.rawQuery || new URLSearchParams(event.queryStringParameters || {}).toString(),
      )),
      body,
    }
    const response = {
      statusCode: 200,
      headers: {},
      body: '',
      status(code) {
        this.statusCode = code
        return this
      },
      setHeader(name, value) {
        this.headers[name] = value
        return this
      },
      end(value = '') {
        this.body = value
      },
    }

    await apiHandler(request, response)
    return {
      statusCode: response.statusCode,
      headers: response.headers,
      body: Buffer.isBuffer(response.body) ? response.body.toString('base64') : response.body,
      ...(Buffer.isBuffer(response.body) ? { isBase64Encoded: true } : {}),
    }
  }
}
