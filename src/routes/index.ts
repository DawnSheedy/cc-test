import express, { Application } from "express";
import path from "path";

export default async (app: Application) => {
    app.use('/', express.static(__dirname+'/../../public'));
}