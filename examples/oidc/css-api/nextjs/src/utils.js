import NodeCache from 'node-cache';

const cache = new NodeCache({
    // access token lives for 300 seconds. Invalidating cache just before expiry.
    stdTTL: 290
});

/**
 * This function returns a cached access token that can be used for CSS API routes.
 * @returns accessToken - An access token that can be used against the CSS API
 */
export const fetchCssApiCredentials = async () => {
    let accessToken = cache.get('accessToken')
    if (accessToken) return accessToken
    const postData = new URLSearchParams();
    postData.append('grant_type', 'client_credentials')
    postData.append('client_id', process.env.SSO_CLIENT_ID)
    postData.append('client_secret', process.env.SSO_CLIENT_SECRET)
    const result = await fetch(process.env.SSO_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: postData,
    }).then(res => res.json())
    cache.set('accessToken', result.access_token)
    return result.access_token
}

/**
 * A catchall error handler.
 * @param {function} handler - An api route handler.
 * @returns {function} - Handler wrapped with generic error handler.
 */
export function apiErrorHandler(handler) {
    return async (req, res) => {
        try {
            await handler(req, res)
        } catch (e) {
            console.info(`[${req.method}] - ${req.url}: Encountered internal error ${e}`)
            res.status(500).send('Internal Server Error')
        }
    }
}