"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
function configureRoutes(app) {
    app.get('/', (req, res) => {
        res.status(200).send({ message: 'API do Alura Retro Miro funcionando!' });
    });
}
exports.configureRoutes = configureRoutes;
