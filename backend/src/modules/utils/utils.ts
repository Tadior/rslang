import request from "request";
import "dotenv/config";

const baseUrl = process.env.BASE_URL || "http://localhost:4000";

export const ping = () =>
    request(baseUrl, (error, response, body) => {
        console.log("statusCode:", response && response.statusCode);
        console.log("error:", error);
        console.log("body:", body);
    });
