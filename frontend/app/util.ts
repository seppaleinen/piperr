export const postData = async (path: string, data: any) => {
    try {
        const response = await fetch(`http://localhost:8000${path}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        const result = await response.text();
        console.log(`Result: ${result}`);
        return result;
    } catch (error) {
        console.error(`Error: ${error}`);
        return error;
    }
};

export const getData = async (path: string) => {
    const response = await fetch(`http://localhost:8000${path}`);
    return response.json();
};
