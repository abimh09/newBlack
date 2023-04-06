import axios from "axios";
export const jezaApi = axios.create({
    baseURL: "https://localhost:7179",
    headers: {
        'Access-Control-Allow-Origin': 'https://localhost:7179/',
        'Content-Type': 'application/json',
    }
})