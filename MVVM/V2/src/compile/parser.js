const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// html -> ast -> render() 

// 使用栈来构建 ast 语法树（dom树）
function creatAstElement(tagName, attrs) {
    return {
        tag: tagName,
        type: 1,
        attrs,
        children: [],
        parent: null,

    }
}

let root = null
let stack = []

function start(tagName, attrs) {
    let parent = stack[stack.length -1]
    let element = creatAstElement(tagName, attrs)
    if (!root) {
        root = element
    }
    element.parent = parent
    if(element.parent) {
        element.parent.children.push(element)
    }
    stack.push(element)
}

function end(tagName) {
    let last = stack.pop()
    if(last.tag !== tagName){
        throw new Error()
    }
}

function chars(text) {
    text = text.replace(/\s/g, "")
    let parent = stack[stack.length -1]
    if(text) {
        parent.children.push({
            type: 3,
            text
        })
    }
}

export function parseHTML(html) {
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }
        let text;
        if (textEnd >= 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }

    function advance(n) {
        html = html.substring(n);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length);
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({
                    name: attr[1],
                    value: attr[3]
                });
            }
            if (end) {
                advance(end[0].length);
                return match
            }
        }
    }
    return root
}

// example：<div id = "#app">{{msg}}</div>
// vue2.x 中的模板编译使用正则表达式逐步匹配解析标签内属性和值。
// 模板编译就是处理 {{msg}} 实现的内容。 
