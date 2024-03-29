angular.module('AppSet')
.directive('uiToggleClass', ['$timeout', '$document', function($timeout, $document) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          e.preventDefault();
          var classes = attr.uiToggleClass.split(','),
              targets = (attr.target && attr.target.split(',')) || Array(el),
              key = 0;
          angular.forEach(classes, function( _class ) {
            var target = targets[(targets.length && key)];            
            ( _class.indexOf( '*' ) !== -1 ) && magic(_class, target);
            $( target ).toggleClass(_class);
            key ++;
          });
          $(el).toggleClass('active');

          function magic(_class, target){
            var patt = new RegExp( '\\s' + 
                _class.
                  replace( /\*/g, '[A-Za-z0-9-_]+' ).
                  split( ' ' ).
                  join( '\\s|\\s' ) + 
                '\\s', 'g' );
            var cn = ' ' + $(target)[0].className + ' ';
            while ( patt.test( cn ) ) {
              cn = cn.replace( patt, ' ' );
            }
            $(target)[0].className = $.trim( cn );
          }
        });
      }
    };
  }])
.directive('uiRemoveClass', ['$timeout', '$document', function ($timeout, $document) {
    return {
        restrict: 'AC',
        //scope: {
        //    ngModel: '=',
        //},
        link: function (scope, el, attr) {
            el.on('click', function(e) {
                e.preventDefault();
                var classes = attr.uiRemoveClass.split(','),
                    targets = (attr.target && attr.target.split(',')) || Array(el),
                    key = 0;
                angular.forEach(classes, function( _class ) {
                    var target = targets[(targets.length && key)];            
                    ( _class.indexOf( '*' ) !== -1 ) && magic(_class, target);
                    $(target).removeClass(_class);
                    key ++;
                });
                $(el).removeClass('active');

                function magic(_class, target){
                    var patt = new RegExp( '\\s' + 
                        _class.
                          replace( /\*/g, '[A-Za-z0-9-_]+' ).
                          split( ' ' ).
                          join( '\\s|\\s' ) + 
                        '\\s', 'g' );
                    var cn = ' ' + $(target)[0].className + ' ';
                    while ( patt.test( cn ) ) {
                        cn = cn.replace( patt, ' ' );
                    }
                    $(target)[0].className = $.trim( cn );
                }
            });
        }
    };
}]);