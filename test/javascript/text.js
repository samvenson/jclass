/*
*	A basic list class 
*
*
*
*
*
*/
(function (__namespace, __name) {
	'use strict';

	var tag = 'TEXTAREA';
	 //create class definition
    var myClass = $Element.subclass(__name);
    //assign shorthand
    var API = myClass.prototype;

    API.constructor = function (__parent) {
    	//call Element constr
    	myClass.super.constructor.call(this, tag, __parent); 
    };

    /**
    *
    *
    */
    API.clear = function (){
        this.element.setAttribute('value', '');
    };

    __namespace[__name] = myClass;

}(window, '$TextElement'));