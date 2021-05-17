import {parseHTML} from './parser'
import { generate } from './generate';


export function compileToFunction(template) {
   let root =  parseHTML(template);
   let code = generate(root)
   let render = new Function(code)
   return render
}