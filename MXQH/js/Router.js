'use strict'
//angular.module('Routing', ['ui.router', 'oc.lazyLoad'])
angular.module('app')
  .provider('router', function ($stateProvider) {
      var urlCollection;
      this.$get = function ($http, $state) {
          return {
              setUpRoutes: function () {
                  $http.get(urlCollection).success(function (collection) {
                      for (var routeName in collection) {
                          if (!$state.get(routeName)) {
                              $stateProvider.state(routeName, collection[routeName]);
                          }
                      }
                  });
              },
              //配置路由
              setDataRouters: function (route) {
                  if (!$state.get(route.Name)) {
                      var item = {};
                      item.url = route.Url;
                      item.templateUrl = route.TempleteUrl;
                      if (route.Controller) {
                          item.controller = route.Controller;
                      }
                      if (route.ControllerAS) {
                          item.controllerAS = route.ControllerAS;
                      }
                      if (route.LazyLoad && route.LazyLoad.length > 0)
                      {
                          var len = route.LazyLoad.length;
                          item.resolve = {
                              deps: ['$ocLazyLoad',
                              function ($ocLazyLoad) {
                                  return $ocLazyLoad.load(route.LazyLoad);
                              }]
                          }
                      }

                      $stateProvider.state(route.Name, item);
                  }
              }
          }
      };
      this.setCollectionUrl = function (url) {
          urlCollection = url;
      }
  })