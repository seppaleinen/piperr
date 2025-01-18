const backend_url = process.env.NODE_ENV === 'development' ?
    'http://localhost:8000' :
    '/backend';

export const postData = async (path: string, data: any, setError: (error: string | null) => void) => {
    const response = await fetch(`${backend_url}${path}`, {
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
    try {
        const response = await fetch(`${backend_url}${path}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} message: ${await response.text()}`);
        }
        return await response.json();
    } catch (error: any) {
        console.log("Error fetching data:", error);
        setError(error.message);
        return [];
    }
};
