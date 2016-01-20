/*
*	A basic element class 
*
*
*
*
*
*/
(function (__namespace, __name) {
	 //create class definition
    var myClass = $jclass(__name);
    //assign shorthand
    var API = myClass.prototype;

    API.constructor = function (__name, __parent) {
    	this.name = __name;
    	this.element = document.createElement(__name); 
    	this.appendTo(__parent);
    };

    /**
    * Clears element conents
    */
    API.clear = function (){
        this.element.innerHTML = '';
        return this;
    };

    /**
    * Removed element from dom
    *
    */
    API.remove = function () {
        var _parent = this.element.parentNode;
        if(_parent){
            _parent.removeChild(this.element);
        }
    };

    /**
    * Inserts Element to provided parent
    *
    */
    API.appendTo = function (__element) {
        if(__element){
            __element.appendChild(this.element);
        }
    };


    __namespace[__name] = myClass;
}(window, '$Element'));