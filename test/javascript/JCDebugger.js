/*
 *
 *
 *
 *
 */

/*
 * Debugger
 * as a good coding technique - always code in closures!
 * TODO render clases first
 *
 */
(function (__namespace, __name) {
    'use strict';
    //create class definition
    var myClass = $jclass(__name);
    //assign shorthand
    var API = myClass.prototype;
    //store classes
    var subclasses = [];
    //
    var instances = [];
    //
    function byLevel (__a, __b) {
    	return __a - __b;
    }
    /**
     * Watch subclases created
     */
    myClass.onSubclassCreated = function (__subclass, __baseClass) {
        subclasses.push(__subclass);
        __subclass.render = myClass.render.bind(this, __subclass);
        //updateList();
    };

    /**
     * Watch instances created created
     */
    myClass.onInstanceCreated = function (__instance, __class) {
        instances.push(__instance);
    };

    myClass.getClasses = function (){
    	return subclasses.sort(byLevel);
    };

    myClass.render = function (__subclass, __ctx, __bounds, __options) {
    	//debugger;
        console.log('render');
        __ctx.fillStyle = '#FF0000'
        __ctx.strokeStyle = 'blue'
        __ctx.fillRect( __bounds.x, __bounds.y, __bounds.width, __bounds.height);
  //       __ctx.rect(__bounds.x, __bounds.y, __bounds.width, __bounds.height);
		// __ctx.stroke();
		// __ctx.fill();
    };

    //define API
    API.constructor = function (__name) {
        this.name = __name;
        document.body.appendChild(canvas);
        document.body.appendChild(txt);
    };

    //
    API.renderClasses = function (__ctx, __bounds, __options) {
    	debugger;
        console.log('render');
        __ctx.fillStyle = 'red'
        __ctx.strokeStyle = 'blue'
        __ctx.rect(__ctx, __bounds.x, __bounds.y, __bounds.width, __bounds.height);
		__ctx.stroke();
    };

    //asign class to namespace
    __namespace[__name] = myClass;
}(window, '$JCDebugger'));