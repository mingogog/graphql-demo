import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import {typeDefs, resolvers} from './graphql';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

const bootstrapServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/graphql', expressMiddleware(server));

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    await mongoose.connect(process.env.MONGO_DB_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log('You successfully connected to MongoDB!');
}

bootstrapServer()

