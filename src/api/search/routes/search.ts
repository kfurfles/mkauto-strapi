export default {
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
  }