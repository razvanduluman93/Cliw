angular
  .module('appApp').config(function($urlRouterProvider, $stateProvider, $httpProvider, $authProvider, API_URL) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('main', {
      url: '/',
      templateUrl: '/views/main.html'
    })

    .state('register', {
      url: '/register',
      templateUrl: '/views/register.html',
      controller: 'RegisterCtrl'
    })
      .state('map', {
        url: '/map',
        templateUrl: '/views/map.html',
        controller: 'MapCtrl'
      })

    .state('login', {
      url: '/login',
      templateUrl: '/views/login.html',
      controller: 'LoginCtrl'
    })

    .state('converter', {
      url: '/converter',
      templateUrl: '/views/converter.html',
      controller: 'ConverterCtrl'
    })
    
    .state('help',{
        url: '/help',
        templateUrl: '/views/help.html'
    })

    .state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl'
    });

    $authProvider.google = ({
      clientId: '823247515465-vniuvtdoja6ig5iif2k4rmbfclrd3r4o.apps.googleusercontent.com',
        url: API_URL + 'auth/google'
    })
    

    $httpProvider.interceptors.push('authInterceptor')
  })
  .run(function($window) {
    var params = $window.location.search.substring(1);

    if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
      var pair = params.split('=');
      var code = decodeURIComponent(pair[1]);

      $window.opener.postMessage(code, $window.location.origin);
    }
  })
  .constant('API_URL', 'http://localhost:3000/')
