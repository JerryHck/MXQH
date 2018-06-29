'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', 'AjaxService',
    function ($scope, $translate, $localStorage, $window, AjaxService) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      var vm = this;
      vm.Test = "app.System";
      // config
      vm.app = {
        name: '管理平台',
        version: '1.3.3',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          //Fixs:[{headerFixed: true}]
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }
      GetList();
      

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        vm.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = vm.app.settings;
      }
      $scope.$watch('app.settings', function () {
        if( vm.app.settings.asideDock  &&  vm.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          vm.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = vm.app.settings;
      }, true);

      function GetList() {
          var en = {};
          en.name  = 'FunType';
          en.value = 1
          vm.promise = AjaxService.GetEntities("FunRoot", en).then(function (data) {
              vm.FunTree = data;
              //console.log(data);
          });
      }
       

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }]);