/*
*	A basic element class 
*
*
*
*
*
*/
(function (__namespace, __name) 
    'use strict';

    var tag = 'OPTION';
	 //create class definition
    var myClass = $Element.subclass(__name);
    //assign shorthand
    var API = myClass.prototype;

    API.constructor = function (__list, __value) {
        myClass.super.constructor.call(this, tag, __list);
    	this.value = __value;
    	this.element.setAttribute('value', __value);
        this.element.innerHTML = __value;
    };

    /**
    *
    *
    */
    API.clear = function (){
        this.element.setAttribute('value', '');
        myClass.super.clear.call(this);
    };

    /**
    *
    *
    */
    API.select = function () {
       this.element.setAttribute('selected', 'selected');
    }


    __namespace[__name] = myClass;
}(window, '$OptionElement'));