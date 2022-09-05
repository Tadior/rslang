import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ping } from "./modules/utils/utils";
import "dotenv/config";

const PORT = process.env.PORT || 4444;

async function bootstrap(): Promise<void> {
    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useStaticAssets(join(__dirname, "..", "src", "modules", "files"), {
        prefix: "/files",
    });
    app.enableCors();
    await app.listen(PORT, () => {
        setInterval(ping, 1 * 10 * 1000);
        console.log(`Start server on the ${PORT} port!`);
    });
}
bootstrap();
