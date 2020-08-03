import express from "./express"
import socketio from "./socketio"
import Container from "typedi"
import Logger from "../services/logger"

export default async () => {
    //TODO add logging, security
    const logger = Container.get(Logger);
    express()
    logger.info("Finished loading.")
}