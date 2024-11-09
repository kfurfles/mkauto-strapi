"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'GET',
            path: '/search',
            handler: 'search.search',
        },
        {
            method: 'GET',
            path: '/search/filter',
            handler: 'search.filter',
        },
    ]
};
