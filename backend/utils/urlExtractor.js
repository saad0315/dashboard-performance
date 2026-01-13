
  exports.extractSourceFromURL= (url)=> {
    // Extract the query string part of the URL
    const queryString = url.split('?')[1];
    if (!queryString) return null; // If no query string found, return null
    
    // Split the query string into key-value pairs
    const queryParams = queryString.split('&');

    // Loop through the key-value pairs to find the utm_Source parameter
    for (const param of queryParams) {
        const [key, value] = param.split('=');
        if (key === 'utm_Source') {
            // If found, return the value associated with utm_Source
            return decodeURIComponent(value);
        }
    }

    // If utm_Source parameter not found, return null
    return null;
}
