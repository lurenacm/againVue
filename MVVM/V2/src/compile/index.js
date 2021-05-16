import {parseHTML} from './parser'
import { generate } from './generate';


export function compileToFunction(template) {
   let root =  parseHTML(template);
   generate(root)
    // 创建虚拟 dom
    // render()
}