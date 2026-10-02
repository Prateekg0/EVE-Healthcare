import 'dotenv/config';
import app from '../app.js';
import { connectDatabase } from './config/mongooseConnection.js';

const port = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
    throw new Error(
        'JWT_SECRET is required. Set a long random secret in .env.'
    );
}

await connectDatabase();

app.listen(port, () => {
    console.log(`EVE API listening on http://localhost:${port}`);
});