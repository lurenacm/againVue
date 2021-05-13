import {initMixin} from './init'
function myVue(options = {}){
    this._init(options)
}

initMixin(myVue)
export default myVue