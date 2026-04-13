import EventEmitter from "events";

const reportEmitter = new EventEmitter();
reportEmitter.setMaxListeners(20);

export default reportEmitter;