export async function * mapToAsyncIterable(iterable, fn) {
    for (let each of iterable) {
        yield fn(each)
    }
}