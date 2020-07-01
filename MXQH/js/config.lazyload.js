// lazyload config

angular.module('AppSet')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      easyPieChart:   ['Scripts/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
      sparkline:      ['Scripts/jquery/charts/sparkline/jquery.sparkline.min.js'],
      plot:           ['Scripts/jquery/charts/flot/jquery.flot.min.js', 
                          'Scripts/jquery/charts/flot/jquery.flot.resize.js',
                          'Scripts/jquery/charts/flot/jquery.flot.tooltip.min.js',
                          'Scripts/jquery/charts/flot/jquery.flot.spline.js',
                          'Scripts/jquery/charts/flot/jquery.flot.orderBars.js',
                          'Scripts/jquery/charts/flot/jquery.flot.pie.min.js'],
      slimScroll:     ['Scripts/jquery/slimscroll/jquery.slimscroll.min.js'],
      sortable:       ['Scripts/jquery/sortable/jquery.sortable.js'],
      nestable:       ['Scripts/jquery/nestable/jquery.nestable.js',
                          'Scripts/jquery/nestable/nestable.css'],
      filestyle:      ['Scripts/jquery/file/bootstrap-filestyle.min.js'],
      slider:         ['Scripts/jquery/slider/bootstrap-slider.js',
                          'Scripts/jquery/slider/slider.css'],
      chosen:         ['Scripts/jquery/chosen/chosen.jquery.min.js',
                          'Scripts/jquery/chosen/chosen.css'],
      TouchSpin:      ['Scripts/jquery/spinner/jquery.bootstrap-touchspin.min.js',
                          'Scripts/jquery/spinner/jquery.bootstrap-touchspin.css'],
      wysiwyg:        ['Scripts/jquery/wysiwyg/bootstrap-wysiwyg.js',
                          'Scripts/jquery/wysiwyg/jquery.hotkeys.js'],
      dataTable:      ['Scripts/jquery/datatables/jquery.dataTables.min.js',
                          'Scripts/jquery/datatables/dataTables.bootstrap.js',
                          'Scripts/jquery/datatables/dataTables.bootstrap.css'],
      vectorMap:      ['Scripts/jquery/jvectormap/jquery-jvectormap.min.js', 
                          'Scripts/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
                          'Scripts/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
                          'Scripts/jquery/jvectormap/jquery-jvectormap.css'],
      footable:       ['Scripts/jquery/footable/footable.all.min.js',
                          'Scripts/jquery/footable/footable.core.css']
  })
  .constant('LoadModules', [
              {
                  name: 'uiGrid',
                  files: [
                      'Scripts/ui-grid.min.js',
                      'Content/ui-grid.min.css'
                  ]
              },
              {
                  name: 'ngGrid',
                  files: [
                      'Scripts/modules/ng-grid/ng-grid.min.js',
                      'Scripts/modules/ng-grid/ng-grid.min.css',
                      'Scripts/modules/ng-grid/theme.css'
                  ]
              },
              {
                  name: 'fileLoad',
                  files: [
                      'Scripts/SheetJs/xlsx.full.min.js',
                  ]
              },
              {
                  name: 'JsPlump',
                  files: [
                      'Scripts/jsPlump/jquery-ui.min.css',
                      'Scripts/jsPlump/jquery-ui.min.js',
                      'Scripts/jsPlump/uuid.js',
                      'Scripts/jsPlump/graphlib.min.js',
                      'Scripts/jsPlump/mustache.min.js',
                      'Scripts/jsPlump/jquery.jsPlumb.min.js',
                  ]
              },
              {
                  name: 'Echart',
                  files: [
                      'Scripts/ECharts/4.7.0/echarts.min.js',
                  ]
              },
              {
                  name: 'datetimepicker',
                  files: [
                      //'Scripts/bootstrap/DateTimePicker/bootstrap-datetimepicker.min.css',
                      //'Scripts/bootstrap/DateTimePicker/bootstrap-datetimepicker.min.js',
                      'Scripts/jquery/DateTimePicker/jquery.datetimepicker.min.css',
                      'Scripts/jquery/DateTimePicker/jquery.datetimepicker.full.min.js',
                  ]
              },
              {
                  name: 'ui.select',
                  files: [
                      'Scripts/select.min.js',
                      'Content/select.min.css'
                  ]
              },
              {
                  name:'angularFileUpload',
                  files: [
                    'Scripts/modules/angular-file-upload/angular-file-upload.min.js'
                  ]
              },
              {
                  name:'ui.calendar',
                  files: ['Scripts/modules/angular-ui-calendar/calendar.js']
              },
              {
                  name: 'ngImgCrop',
                  files: [
                      'Scripts/modules/ngImgCrop/ng-img-crop.js',
                      'Scripts/modules/ngImgCrop/ng-img-crop.css'
                  ]
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      'Scripts/modules/angular-bootstrap-nav-tree/abn_tree_directive.js',
                      'Scripts/modules/angular-bootstrap-nav-tree/abn_tree.css'
                  ]
              },
              {
                  name: 'toaster',
                  files: [
                      'Scripts/modules/angularjs-toaster/toaster.js',
                      'Scripts/modules/angularjs-toaster/toaster.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      'Scripts/modules/textAngular/textAngular-sanitize.min.js',
                      'Scripts/modules/textAngular/textAngular.min.js'
                  ]
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      'Scripts/modules/angular-slider/angular-slider.min.js',
                      'Scripts/modules/angular-slider/angular-slider.css'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular',
                  files: [
                      'Scripts/modules/videogular/videogular.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.controls',
                  files: [
                      'Scripts/modules/videogular/plugins/controls.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.buffering',
                  files: [
                      'Scripts/modules/videogular/plugins/buffering.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.overlayplay',
                  files: [
                      'Scripts/modules/videogular/plugins/overlay-play.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.poster',
                  files: [
                      'Scripts/modules/videogular/plugins/poster.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.imaads',
                  files: [
                      'Scripts/modules/videogular/plugins/ima-ads.min.js'
                  ]
              }
  ])
  // oclazyload config
  .config(['$ocLazyLoadProvider', 'LoadModules', function($ocLazyLoadProvider, LoadModules) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:  false,
          events: true,
          modules: LoadModules,
      });
  }])
;