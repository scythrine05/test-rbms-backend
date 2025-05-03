import app from "./app.js";
import { Config } from "./config/index.js";

const startServer = async () => {
    const PORT = Config.PORT;

    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error(`Server failed to start: ${err.message}`);
        process.exit(1);
    }
};

startServer();
