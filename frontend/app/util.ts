export const postData = async (path: string, data: any, setError: (error: string | null) => void) => {
    const response = await fetch(`http://localhost:8000${path}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
        .catch((error: Error) => {
            setError(error.message);
            return error;
        })
        .then((response: Response | Error) => {
            return response instanceof Error ? response.message : response.text()
        });
    console.log(`Result: ${response}`);
    return response;
};

export const getData = async (path: string, setError: (error: string | null) => void) => {
    return await fetch(`http://localhost:8000${path}`)
        .catch((error: Error) => {
            setError(error.message);
        })
        .then((response: Response | void) => {
            return response ? response.json() : [];
        });
};
