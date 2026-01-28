import { NextFunction, Request, Response } from "express";
import { ModelStatic, Op, FindOptions } from "sequelize";
import { Model } from "../database/models/model";

export default class ModelController<T extends Model> {
    protected model: ModelStatic<T>;

    constructor(model: ModelStatic<T>) {
        this.model = model;
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { search, page, limit, order, sort } = req.query;

            const options: FindOptions = {};

            // Basic search implementation (can be overridden)
            if (search) {
                // Assume 'nome' or 'descricao' fields exist for generic search, or override this method
                // This is a simplified version
            }

            if (page && limit) {
                const offset = (Number(page) - 1) * Number(limit);
                options.offset = offset;
                options.limit = Number(limit);
            }

            const result = await this.model.findAndCountAll(options);

            res.json({
                success: true,
                data: result.rows,
                pagination: {
                    totalItems: result.count,
                    page: Number(page) || 1,
                    pageSize: Number(limit) || result.count,
                    totalPages: limit ? Math.ceil(result.count / Number(limit)) : 1
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const result = await this.model.findByPk(id);

            if (!result) {
                res.status(404).json({ success: false, message: "Registro não encontrado" });
                return;
            }
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const result = await this.model.create(data);
            res.status(201).json({ success: true, message: "Criado com sucesso", data: result });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const record = await this.model.findByPk(id);

            if (!record) {
                res.status(404).json({ success: false, message: "Registro não encontrado" });
                return;
            }

            await record.update(req.body);
            res.json({ success: true, message: "Atualizado com sucesso", data: record });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const record = await this.model.findByPk(id);

            if (!record) {
                res.status(404).json({ success: false, message: "Registro não encontrado" });
                return;
            }

            await record.destroy();
            res.json({ success: true, message: "Excluído com sucesso" });
        } catch (error) {
            next(error);
        }
    }
}
