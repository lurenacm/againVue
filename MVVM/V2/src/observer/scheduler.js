let queue = []
let has = {}

let pending = false

/** 将队列中的方法全部执行 */
function flushSchedulerQueue() {

    for (let i = 0; i < queue.length; i++) {
        queue[i].run()
    }
    queue = []
    has = {}
    pending = false  
}

const callbacks = []
function flushCallback(callbacks) {
    callbacks.forEach(cb => cb());
    waiting = false
}

/** 使用防抖，最后批量更新 */
let waiting = false
function nextTick(cb){
    callback.push(cb) // 数据更新时先执行 flushSchedulerQueue，再添加用户的 callback
    if(!waiting) {
        setTimeout(flushCallback,0)
        waiting = true
    }
}

export function queueWatcher(watcher) {
    let id = watcher.id

    // 去重
    if(has[id] == null) {
        queue.push(watcher)
        has[id] = true
        if(!pending) {
            /** 这里同一个值多次修改后只取最后一次的值，因为是异步的关系队列最后执行run,更新视图 */
            // setTimeout(flushSchedulerQueue ,0)
            nextTick(flushSchedulerQueue)
            pending = true
        }
    }
}

