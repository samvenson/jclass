/*
* Copyright
* 
*
*
*
*/

/*
 * Class Factory Library.
 * Constructs Class Objects to be used for instance creation as well as creating subclasses.
 * Class:
 *     use $class("Name"); to create class factory
 *     Note that Class Facory created will bare the name provided in arguments
 *     Essestial thisngs to remember:
 *         Class Factory will execute a callback (if assigned) when instance iis created using Class Factory Object
 *             "onInstanceCreated(Instance, Class)"
 *              You will have the chance to manage instance before the constructor of the instance is called
 *         Class Factory will execute a callback (if assigned) when a subclass is created using Class Factory Object
 *             "onSubclassCreated(Subclass Factory, Super Class Factory)"
 *             You will have the chance to manage Subclass Factory before any instance is created
 *         In both cases all super class structure will be avoked with the same calls starting from the current Class Factory going all the way up
 *         to the Origin (Base) Class Factory. However returning "false" at any callback will prevent the callback being executed at a higher super chain.
 * Example:
 *     var MyClass = $class('PointClass');
 *     MyClass.onInstanceCreated = function;
 *     MyClass.onSubclassCreated = function;
 *
 *     MyClass.prototype.constructor = function; //constructor methos is called on instance creation
 *
 *     MyClass.super = Base Class Factory
 *     MyClass.__superof = Array of all subclasses created using MyClass
 *
 *     var _instance = MyClass();
 *     _instance.class === MyClass; //true
 *     _instance.super === MyClass.super; //true
 *
 *     to evoke super methods use ".call()" method Ex:
 *
 *     _instance.super.constructor.call(_instance);
 *     //same as in a function call
 *     this.super.constructor.call(this);
 *     //same as on Class Factory namespace
 *     MyClass.super.constructor.call(_instance);
 *     //or
 *     MyClass.super.constructor.call(this);
 *
 *     Access to chain of supers ex:
 *     MyClass.super.super.constructor.call(this);
 *
 */
(function (__namespace, __name) {
    'use strict';
    var PROTO;
    //Injection which is made into Sudo Class (exports) constructor
    //This is done to indicate that a constructor is something developers should not be modifying
    var obfiscate = '/*[Sudo Class Constructor/Factory]*/';

    // We'll add a lot of space to prevent function block visibility in debugger
    var space = '                                                               ';
    space += space;
    space += space;
    space += space;
    obfiscate += space;

    var nativeKeys = [
    'super',
    'class',
    'instanceof',
    'constructor',
    '__className',
    '__classInfo',
    'mixin',
    'subclass',
    'prototype',
    '__superof',
    'deconstructor'
    ];

    var emptyArray = [];

    /**
     * Base class constructor
     */
    function ClassConstructor(__errorType) {
        if(this){
            //in case of no constructor is defined
            console.warn(this.constructor + ' -> constructor() method is NOT defined!');
            return;
        }
        //Handle Error cases
        switch (__errorType) {
        case 0:
            throw 'Illegal invocation! Do not use keyword "new" when evoking a new instance or class!';
        case 1:
            throw 'Illegal invocation! Class Name is invalid!';
        default:
            throw 'Illegal invocation!';
        }
    };

    //assign a shorthand
    PROTO = ClassConstructor.prototype;

    PROTO.deconstructor = function () {
        console.warn(this.constructor + ' -> deconstructor() method is NOT defined!');
    }

    /**
     * Mixes Object into self
     * @param   {[type]} __object           [description]
     * @param   {[type]} __ignoreCollection [description]
     * @returns {[type]}                    [description]
     */
    PROTO.mixin = function (__object, __ignoreCollection) {
        var _key;
        var _collection = __ignoreCollection || emptyArray;

        if(!__object){
            return this;
        }
        //assign prototype of class - something general???
        for (_key in __object) {
            if (__object.hasOwnProperty(_key) && nativeKeys.indexOf(_key) < 0 && _collection.indexOf(__object[_key]) < 0) {
                if(typeof __object[_key] === 'function'){
                    this[_key] = __object[_key].bind(this);
                }else{
                    this[_key] = __object[_key];
                }
            } else {
                // console.error(_key);
            }
        }

        return this;
    };

     /**
     * Type check which is a ssigned to each class instance to be used as a type check
     * @param   {Object} __instance     instance of class created using this utility
     * @param   {Function} __classFactory Sudo class constructor against which we'll tests the instance type
     * @returns {Boolean}  true if instance is of provided class of any of its subclasses
     */
    PROTO.instanceof = function (__classFactory) {
        var _isInstance;
        //There are only three case we should check for
        if (!__classFactory) {
            //first is arguments itself
            //check a streghtforward case
            return false;
        }

        if (this instanceof __classFactory.constructor) {
            //check for the immediate match of a provided class
            return true;
        }
        //itterate over subclasses of a provided class to wee if any of subclasses is the constructor
        return instanceofChildren(this, __classFactory);
    }

    /**
     * [info description]
     * @returns {[type]} [description]
     */
    PROTO.__classInfo = function () {
        console.log('Class Name: ' + this.__className + '\n' +
            'super: ' + this.super);
    };

    //
    PROTO.__className = name;

    /**
     * Mixing prototypes, but omitting native keys of class factories
     * @param   {[type]} __classFactory      [description]
     * @param   {[type]} __inheritFromObject [description]
     * @returns {[type]}                     [description]
     */
    function mixin (__classFactory, __modelObject) {
        var _object, _key;

        if(!__modelObject || (typeof __modelObject !== 'function' && typeof __modelObject !== 'object')){
            return __classFactory;
        }

        if(__modelObject.prototype){
            _object = __modelObject.prototype;
        }else{
            _object = __modelObject;
        }

        //assign prototype of class - something general???
        for (_key in _object) {
            if (_object.hasOwnProperty(_key) && nativeKeys.indexOf(_key) < 0) {
                __classFactory.prototype[_key] = _object[_key];
            } else {
                // console.error(_key);
            }
        }

        return __classFactory;
    }

    /**
     * Evaluates name of class provided
     * Prevent unwanted characters
     * Throws error if doesn't pass the validation
     * @param   {String} __name name of class
     */
    function evaluateClassName(__name) {
        var _i, _char;

        if(typeof __name !== 'string' || __name.trim() === ''){
            return false;
        }

        for (_i = 0; _i < __name.length; _i += 1) {
            _char = __name[_i];
            if (_char === '(' || _char === ')' || _char === '{' || _char === '}' || _char === '[' || _char === ']' || _char === ';' || _char === '\\' || _char === '/' || _char === '.' || _char === ',') {
                return false;
            }
        }
        return true;
    }

    /**
     * Creates contructor function of a name provided
     * This is done to atchieve effect of constructor function name being a custom to developers needs
     * @param   {String} __name Name of Class
     * @returns {Function}        Class contructor
     */
    function createConstructor(__name) {
        var _classConstructor;
        //create a dynamic constructor
        eval('_classConstructor = function ' + __name + '() {' + obfiscate + '};');
        return _classConstructor;
    }

    /**
     * Mixes object properties
     * @param   {Object} __modelObject properties to inherit from
     * @param   {Object} __targetObject new propertied will be assigned to this object
     * @returns {[type]}        [description]
     */
    function mixProto(__modelObject, __targetObject) {
        var _key;
        //assign prototype of class - something general???
        for (_key in __modelObject) {
            if (__modelObject.hasOwnProperty(_key)) {
                __targetObject[_key] = __modelObject[_key];
            } else {
                // console.error(_key);
            }
        }

        return __targetObject;
    }

    /**
     * Creates super chain of subclass
     * Ittarates over chain of all parent classes constructing object which is the super chain
     * @param   {Function} __parentExports Sudo Class constructor which may host its own chain of supers
     * @param   {Funciton} __classFactory  Sudo Class constructor to which new chain of supers are assigned
     * @returns {Function}  __classFactory
     */
    function closureSupers(__parentExports, __classFactory) {
        //current super as we'll be itterating over entire chain and assigning every new class as _super
        var _super, _currentSuper, _enclosedSuperStructure, _assignTo;

        //assign a starting super class to be the first in chain of supers
        _super = __parentExports
            //
        while (_super) {
            if (_currentSuper) {
                _assignTo = _currentSuper;
            }
            _currentSuper = _super;
            //start closure chain
            _enclosedSuperStructure = _enclosedSuperStructure || _currentSuper;
            //mix proto Class to enclosure binding it with instance
            mixProto(_super.prototype, _currentSuper);
            //ensure to cover speacial case of constructors !!!
            _currentSuper.constructor = _super.prototype.constructor; //.bind(__instane);
            //go up the chain of supers
            _super = _super.super;
            //ufter first run build the super chain that will be a part of "_enclosedSuperStructure"
            if (_assignTo) {
                _assignTo.super = _currentSuper;
            }
        }
        //finally assign the super chain
        __classFactory.super = _enclosedSuperStructure;

        return __classFactory;
    }

    /**
     * Ittarates over all the subclasses craated against provided class accessing "__superof" collection object
     * and checks the type of instance
     * @param   {Object} __instance     Class instance
     * @param   {Function} __classFactory Sudo Class constructor
     * @returns {Boolean} true if instance is of provided class of any of its subclasses
     */
    function instanceofChildren(__instance, __classFactory) {
        var _i, _childClass;
        //if not constructor or collection found
        if (!__classFactory || !__classFactory.__superof) {
            return false;
        }

        //looping over the collection of subclasses testing type
        for (_i = 0; _i < __classFactory.__superof.length; _i += 1) {
            //get the class the arguments is a superclass of
            _childClass = __classFactory.__superof[_i];
            if (__instance instanceof _childClass.constructor) {
                return true;
            } else if (_childClass.__superof) {
                //recurcive check the next subclass
                return instanceofChildren(__instance, _childClass);
            }
        }

        return false;
    }

    /**
     * Executes method "onInstanceCreated()" of a class and all its superclasses
     * This is to give developer ability to track instances of all subclasses individually
     * The order of execution is from class to last super
     * if "onInstanceCreated()" returns flase - the ietteration stops
     * @param   {Function} __classFactory immadiate class constructor of instance
     * @param   {Object} __instance instance
     */
    function onInstanceCreated(__classFactory, __instance) {
        var _i;
        var _class = __classFactory;
        var _executables = [];
        //collect classes
        while (_class) {
            _executables.push(_class);
            _class = _class.super;
        }

        for (_i = 0; _i < _executables.length; _i += 1) {
            _class = _executables[_i];
            //call method providing instance and class cunstructor
            if (_class.onInstanceCreated && _class.onInstanceCreated(__instance, __classFactory) === false) {
                break;
            }
        }
    }

    /**
     * Simmilar to "onInstanceCreated"
     * Executes method "onSubclassCreated()" of a class and all its superclasses
     * This is to give developer ability to track subclass of all superclassed individually
     * The order of execution is from class to last super
     * if "onSubclassCreated()" returns flase - the ietteration stops
     * @param   {Function} __classFactory immadiate class constructor of instance
     * @param   {Object} __instance instance
     */
    function onSubclassCreated(__classFactory, __subclass) {
        var _i;
        var _class = __classFactory;
        var _executables = [];

        //collect classes
        while (_class) {
            _executables.push(_class);
            _class = _class.super;
        }

        for (_i = 0; _i < _executables.length; _i += 1) {
            _class = _executables[_i];
            //call method providing instance and class cunstructor
            if (_class.onSubclassCreated && _class.onSubclassCreated(__subclass, __classFactory) === false) {
                break;
            }
        }
    }

    /**
     * A subclass constructor
     * Creates a class exporter of the same name as requested in arguments
     * A class exporter is NOT the same cunstructor as class itself
     * @param   {Function} __superClass Sudo Class constructor (super) is passed supers chain will be assigned
     * @param   {String} __name  name of class
     * @returns {Function}   new Sudo Class constructor of the same name
     */
    function classConstructor(__superClass, __name) {
        var _classConstructor;
        var _classFactory
            //we'll check if the method is being evoked by using keyword "new"
        if (this) {
            return ClassConstructor(0);
        };
        //we'll evauate name
        if (!evaluateClassName(__name)) {
            return ClassConstructor(1);
        }
        //a handle to attach evaluated function to
        _classConstructor = createConstructor(__name);
        //create constructor block
        _classFactory = '_classFactory = function ' + __name + '() { ' +
            //this is to push the function block into invisible area
            obfiscate +
            //prevent using new on _classFactory
            'if(this){' +
            'return ClassConstructor(0);' +
            '};' +
            //create instance
            'var _instance = new _classConstructor(arguments);' +
            //assign super chain
            '_instance.super = _classFactory.super;' +
            //assign own Class
            '_instance.class = _classFactory;' +
            //add original name of class and options
            '_instance.__className = __name;' +
            //add a subclass super generator only if it is a subclass
            'onInstanceCreated(_classFactory, _instance);' +
            // if constructor is not defined' +
            'if(_instance.constructor === _classConstructor){' +
            //warn developer that constructor is not available
            //not manditory call so we'll continue
            'ClassConstructor.apply(_instance, arguments);' +
            //
            '}else{' +
            //immediatly call "constructor()" method of a new instance
            '_instance.constructor.apply(_instance, arguments);' +
            //
            '};' +
            //return new instance
            'return _instance;' +
            '};';

        //create sudo constructor
        eval(_classFactory);

        //hanlde case of a Class contrucion as suposed to a subclass
        if (!__superClass) {
            //assign prototype of clas - somthing general???
            mixProto(PROTO, _classConstructor.prototype);
            //store the class constructor
            //no subclasses allowed
            //classes.push(_classConstructor);
            //set Level
            _classFactory.__level = 0;
        } else {
            //mix supers methods to constructor prototype
            mixProto(__superClass.prototype, _classConstructor.prototype);
            //
            _classFactory.super = __superClass;
            //setLevel
            _classFactory.__level = __superClass.__level + 1;

            //after adding super create a super structure
            closureSupers(__superClass, _classFactory);
            //notify supers about class being constructed
            onSubclassCreated(__superClass, _classFactory);
            //asign breadcrumbs
            __superClass.__superof = __superClass.__superof || [];
            //
            __superClass.__superof.push(_classFactory);
        }
        //assign prototype to proxy Sudo Class Constructor
        _classFactory.prototype = _classConstructor.prototype;
        //Totally strange but there is no need at all to expose SudoClass constructor
        _classFactory.constructor = _classConstructor;
        //not manditory but usefull
        _classFactory.__className = __name;
        // _classFactory.__classOptions = __options;
        _classFactory.subclass = classConstructor.bind(null, _classFactory);
        //
        _classFactory.mixin = mixin.bind(null, _classFactory);
        //debugger;
        return _classFactory;
    };

    __namespace[__name] = Object.freeze(classConstructor.bind(null, null));

}(window, '$jclass'));
