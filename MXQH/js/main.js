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

      // angular translate
      vm.lang = { isopen: false };
      vm.langs = { cn: "中文", en: '英语', de_DE: '德语', it_IT: '意大利' };
      //默认中文
      vm.selectLang = vm.langs[$translate.proposedLanguage()] || "中文";
      //$translate.use("cn")
      vm.setLang = function (langKey, $event) {
          alert(langKey)
        // set the current lang
        vm.selectLang = vm.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        vm.lang.isopen = !vm.lang.isopen;
      };

      vm.Follows = [{ name: "小李", job: "文员", state : "on" },
          { name: "小李", job: "前台", state: "away" },
          { name: "李五", job: "行政助理", state: "busy" },
          { name: "马六", job: "司机", state: "on" },
          { name: "小黄", job: "软件工程师" }
      ]

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }]);