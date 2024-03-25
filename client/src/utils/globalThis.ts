if (typeof globalThis === 'undefined') {
    (window as any).globalThis = window;
}

if (typeof window.queueMicrotask !== "function") {
    window.queueMicrotask = function (callback) {
        Promise.resolve()
            .then(callback)
            .catch(e => setTimeout(() => { throw e; }));
    };
}
