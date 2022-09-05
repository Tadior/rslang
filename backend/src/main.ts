import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import "dotenv/config";
import { LoggerMiddleware } from "./modules/logger/logger.middleware";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe";

const PORT = process.env.PORT || 4444;
const urls: string[] = ["", "/users", "/words", "/words?group=3&page=4"];
export const baseUrl = process.env.BASE_URL || "http://localhost:4000";

async function bootstrap(): Promise<void> {
    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useStaticAssets(join(__dirname, "..", "src", "modules", "files"), {
        prefix: "/files",
    });
    app.enableCors();
    const logger: LoggerMiddleware = new LoggerMiddleware();
    await app.listen(PORT, () => {
        setInterval((): void => {
            const randomEndpoint: string = baseUrl.concat(urls[Math.floor(Math.random() * urls.length)]);
            logger.ping(randomEndpoint);
        }, 14 * 60 * 1000);
        console.log(`Start server on the ${PORT} port!`);
    });
}
bootstrap();
