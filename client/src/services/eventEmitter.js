function eventEmitter(initialEvents = {}) {
  const events = { ...initialEvents };

  function subscribe(name, cb) {
    (events[name] || (events[name] = [])).push(cb);

    return () => unsubscribe(name, cb);
  }

  function unsubscribe(name, cb) {
    console.log(events)
    events[name] && events[name].splice(events[name].indexOf(cb) >>> 0, 1)
    console.log(events)
  }

  function emit(name, ...args) {
    (events[name] || []).forEach(fn => fn(...args));
  }

  return {
    subscribe,
    unsubscribe,
    emit,
  }
}

export default eventEmitter();
