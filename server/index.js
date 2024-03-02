const express = require('express');
const app = express();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const PORT = 4000;

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!,
                name: String,
                username: String,
                website: String,
                email: String
            }

            type Todo {
                id: ID!,
                title: String!,
                completed: Boolean
            }

            type Query {
                getTodos: [Todo],
                getUsers: [User],
            }
        `,
        resolvers: {
            Query: {
                getTodos: async () => {
                    try {
                        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
                        return response.data;
                    } catch (error) {
                        console.error('Error fetching todos:', error);
                        return [];
                    }
                    
                },
                getUsers: async () => {
                    try {
                        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                        return response.data;
                    } catch (error) {
                        console.error('Error fetching users:', error);
                        return [];
                    }
                    
                },

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
