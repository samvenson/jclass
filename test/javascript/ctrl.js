/*
*
*
*
*/
(function () {
    'use strict';
    var canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    var ctx = canvas.getContext('2d');
    //
    var timer;

    window.init = function (){
        draw();
    };

    function draw (){
        document.body.appendChild(canvas);
        drawClasses();
    }

    function drawClasses (){
        var _classes = $JCDebugger.getClasses();
        var _i;
        var _levels = _classes[_classes.length-1].__level;
        var _height = canvas.height / _levels;
        var _x = 0;
        var _level;
        var _width = 30;

        for(_i = 0; _i < _classes.length; _i += 1){
            var _class = _classes[_i];
            _x = !_level || _level !== _class.__level ? 0 : _x + _width;
            _level = _class.__level;
            var _y = _height * (_level - 1);

            _class.render(ctx, {x: _x, y: _y, width: _width, height: _height });
        }
    }

    $JCDebugger.subclass('Animal');
   $JCDebugger.subclass('Plant');
   $JCDebugger.subclass('Fish');
   $JCDebugger.subclass('Car');
}())

 