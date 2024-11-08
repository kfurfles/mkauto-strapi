"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    graphql: {
        config: {
            endpoint: '/graphql',
            shadowCRUD: true,
            playgroundAlways: false,
            depthLimit: 7,
            amountLimit: 100,
            apolloServer: {
                tracing: false,
            },
        },
    }
});
