import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import request from "request";
import "dotenv/config";
import os from "node:os";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger("HTTP");

    use(request: Request, response: Response, next: NextFunction): void {
        const { url, method, headers } = request;
        const hostname: string = os.hostname() || "";
        const userAgent: string = headers["user-agent"] || "Impossible to determine user agent";
        response.on("finish", (): void => {
            const { statusCode } = response;
            const message = `${method} ${url} ${statusCode} - ${userAgent} : ${hostname}`;
            this.logger.log(`${message}`);
        });
        next();
    }

    ping(baseUrl: string): void {
        request(baseUrl, (error: Error, response: request.Response): void => {
            this.logger.log(`StatusCode: ${response && response.statusCode} - Error: ${error ? error : "no"}`);
        });
    }
}
