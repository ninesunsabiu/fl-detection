import { handleRequest } from './handler';
import { handleOptions } from './handleOptions';

addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method === 'OPTIONS') {
        // Handle CORS preflight requests
        event.respondWith(handleOptions(request));
    } else {
        event.respondWith(handleRequest(request));
    }
});
