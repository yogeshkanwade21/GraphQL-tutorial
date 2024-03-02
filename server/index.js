const express = require('express');
const app = express();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 4000;

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type Todo {
                id: ID!,
                title: String!,
                completed: Boolean
            }

            type Query {
                getTodos: [Todo],
            }
        `,
        resolvers: {
            Query: {
                getTodos: () => [
                    { id: 1, title: 'First todo', completed: true }
                ],
            },
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(PORT, () => console.log(`server started on ${PORT}`));
}

startServer();
