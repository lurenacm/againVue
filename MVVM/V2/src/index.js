import {initMixin} from './init'
import { renderMixin } from './render'
import { lifeCycleMixin } from './lifeCycle'


function myVue(options = {}){
    this._init(options)
}

initMixin(myVue)
renderMixin(myVue)
lifeCycleMixin(myVue)
export default myVue