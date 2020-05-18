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
                      if (route.ControllerAs) {
                          item.controllerAs = route.ControllerAs;
                      }
                      if (route.LazyLoad && route.LazyLoad.length > 0) {
                          if (route.LazyLoad.length == 1) {
                              var len = route.LazyLoad.length;
                              item.resolve = {
                                  deps: ['$ocLazyLoad',
                                  function ($ocLazyLoad) {
                                      return $ocLazyLoad.load(route.LazyLoad);
                                  }]
                              }
                          }
                          else {
                              var len = route.LazyLoad.length;
                              var js = route.LazyLoad[len - 1];
                              var arr = angular.copy(route.LazyLoad);
                              arr.splice(len - 1, 1);
                              item.resolve = {
                                  deps: ['$ocLazyLoad',
                                        function ($ocLazyLoad) {
                                            return $ocLazyLoad.load(arr).then(
                                                function () {
                                                    return $ocLazyLoad.load(js);
                                                }
                                            );
                                        }]
                              }
                          }
                      }

                      item.resolve = angular.extend(item.resolve || {}, {
                          Fun: ['$cookieStore', function ($cookieStore) {
                              $cookieStore.put('active-function', route.FunNo);
                              $cookieStore.put('active-router', route.Name)
                              return route.FunNo;
                          }]
                      });
                      $stateProvider.state(route.Name, item);
                  }
              },
          }
      };
      this.setCollectionUrl = function (url) {
          urlCollection = url;
      }
  })