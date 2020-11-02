// We support the GET, POST, HEAD, and OPTIONS methods from any origin,
// and allow any header on requests. These headers must be present
// on all responses to all CORS preflight requests. In practice, this means
// all responses to OPTIONS requests.
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': 'Content-Type'
};

export function handleOptions(request: Request) {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
        headers.get('Origin') !== null &&
        headers.get('Access-Control-Request-Method') !== null &&
        headers.get('Access-Control-Request-Headers') !== null
    ) {
        // Handle CORS pre-flight request.
        // If you want to check or reject the requested method + headers
        // you can do that here.
        const respHeaders = {
            ...corsHeaders,
            'Access-Control-Allow-Origin': headers.get('Origin')!,
            // Allow all future content Request headers to go back to browser
            // such as Authorization (Bearer) or X-Client-Name-Version
            'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers')!
        };

        return new Response(null, {
            headers: respHeaders
        });
    } else {
        // Handle standard OPTIONS request.
        // If you want to allow other HTTP Methods, you can do that here.
        return new Response(null, {
            headers: {
                Allow: 'GET,POST,OPTIONS'
            }
        });
    }
}
