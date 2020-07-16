import { Application } from "express";

export default async (app: Application) {
    app.get('/techdesk', function (req, res) {
        res.send("TechDesk");
    })

    app.get('/captioner', function (req, res) {
        res.send("Captioner");
    })
}