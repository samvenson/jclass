//--------------------------------------------	PROPER CLASSING
/**
 * Create class
 */
(function (window) {
    'use strict';
    var foo = '$ctrlClass';
    //define class
    var myClass = window[foo] = $class(foo);

    var PROTO = myClass.prototype;

    /**
    * callback was passed on to clas options
    */
    myClass.onInstanceCreated = function(__intance) {
    	// debugger;
    	__intance.name = 'Boooooo';
    }

    //instance

    /*PROTO.constructor = function (__arg) {
        this.x = 110;
        console.log(this.__className + ' constructor()! __arg: ' + __arg + ', foo: ' + foo);
    }*/

    PROTO.test = function () {
        console.log(this.__className + ' TEST()! foo: ' + foo + ', x: ' + this.x);
    }

}(window));

/**
 * Create class
 */
(function (window) {
    'use strict';
    var foo = '$ctrlClass_alt';
    //define class
    var myClass = window[foo] = $class(foo);

    var PROTO = myClass.prototype;


    myClass.onInstanceCreated = function () {
    	debugger;
    }

/*
    PROTO.constructor = function (__arg) {
        this.x = 110;
        console.log(this.__className + ' constructor()! __arg: ' + __arg + ', foo: ' + foo);
    }
*/
    PROTO.test = function () {
        console.log(this.__className + ' TEST()! foo: ' + foo + ', x: ' + this.x);
    };

    PROTO.mixedFunction = function () {
        debugger;
    }

}(window));

/*var _instance = $ctrlClass('Hello instance!');
console.log(_instance);

debugger;*/


(function (window) {
    'use strict';
    var foo = '$ctrlClassMix';
    //define class
    var myClass = window[foo] = $ctrlClass.subclass(foo);

    myClass.mixin($ctrlClass_alt.prototype);

    var PROTO = myClass.prototype;

    myClass.onInstanceCreated = function (__instance) {
    	debugger;
    }
    myClass.onSubclassCreated = function (__subclass) {
    	debugger;
    }

   /* PROTO.constructor = function (__arg) {
        this.y = 110;
        this.arg = __arg;
        myClass.super.constructor.call(this);
        // myClass.supers.$ctrlClass.super.test();
        console.log(this.__className + ' constructor()! __arg: ' + __arg + ', foo: ' + foo);
    }*/

    PROTO.test = function () {
        console.log(this.__className + ' TEST()! foo: ' + foo + ', x: ' + this.x);
        //no super here!????
        myClass.super.test.call(this);
    }

}(window));



var _instance = $ctrlClassMix('Hello instance1!');
console.log(_instance);

_instance.mixedFunction();

