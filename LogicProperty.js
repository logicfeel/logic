
(function(global) {
    'use strict';
    /**
     * !! prototype 노출형 부모 (부모.call(this);  <= 불필요
     * 제한1 : var(private) 사용 못함
     * 제한2 : 생성자 전달 사용 못함
     * 제한3 : 부모.call(this) 비 호출로 초기화 안됨
     * 장점 : 중복 호출 방지 (성능 향상)  **
     * @name LAarry (LoagicArayy)
     */
    function LProperty() {

        this.isDebug        = false;
    }
    (function() {   // prototype 상속 정의
    }());

    
    LProperty.prototype._init = function() {
    };

    LProperty.prototype.setPropCallback = function(pPropName, pGetCallback, pSetCallback) {
        
        var obj = {
            enumerable: true,
            configurable: true
        };
        
        if (typeof pGetCallback === "function") {
            obj.get = pGetCallback;
        }
        if (typeof pSetCallback === "function") {
            obj.set = pSetCallback;
        }

        Object.defineProperty(this, pPropName, obj);
    }

    global.LProperty = global.LProperty || LProperty;

}(this));