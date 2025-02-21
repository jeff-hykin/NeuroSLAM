export class Event extends Set {}
export const trigger = async (event, ...args)=>Promise.all([...event].map(each=>each(...args)))
export const everyTime = (event)=>({ then:(action)=>event.add(action) })
const unset = Symbol('unset')
export const everyTimeAllLatestOf = (...events)=>{
    let total = 0
    const values = Array(events).fill(unset)
    let index = 0
    let response
    let errStack
    try {
        throw Error(``)
    } catch (error) {
        errStack = error.stack
    }
    for (let each of events) {
        const eachIndex = index++
        everyTime(each).then((value)=>{
            if (values[eachIndex]==unset) {
                total++
            }
            values[eachIndex] = value
            if (total===events.length) {
                // reset
                triggered.fill(0)
                total = 0
                if (response) {
                    Promise.resolve(response(...values)).catch((error)=>{
                        console.error(`error during a everyTimeAllLatestOf response:`,error, errStack)
                    })
                }
            }
        })
    }
    return {
        then: (action)=>{
            response = action
        }
    }
}
export const once = (event)=>{
    let selfRemovingRanFirst = false
    let output
    let resolve
    const selfRemoving = async (...args)=>{
        event.delete(selfRemoving)
        output = args
        selfRemovingRanFirst = true
        // if promise ran before it had access to output
        // (and therefore couldnt handle the return)
        // then this function needs to handle the return
        if (resolve) {
            resolve(output)
        }
    }
    event.add(selfRemoving)
    return new Promise(res=>{
        resolve = res
        // if selfRemoving finished before it had access to resolve/reject
        // then the promise needs to handle the return
        if (selfRemovingRanFirst) {
            resolve(output)
        }
    })
}