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

	var tag = 'SELECT';
	 //create class definition
    var myClass = $Element.subclass(__name);
    //assign shorthand
    var API = myClass.prototype;

    API.constructor = function (__collection, __parent) {
    	//call Element constr
    	myClass.super.constructor.call(this, tag, __parent);
    	 
    	this.setCollection(__collection);
    };

    /**
    *
    *
    */
    API.setCollection = function (__collection) {
    	var _i;
    	this.element.innerHTML = '';
    	this.collection = [];

    	for (_i = 0; _i < __collection.length; _i ++){ 
    		this.collection.push($ListOption(this.element, __collection[_i]));
    	}
    };

    __namespace[__name] = myClass;

}(window, '$SelectElement'));