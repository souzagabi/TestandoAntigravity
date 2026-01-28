import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Produto from '../../database/models/produto/Produto';
import ModelController from '../ModelController';

class ProdutoController extends ModelController<Produto> {
    constructor() {
        super(Produto);
    }

    // Override findAll to implement search by name
    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { search, page, limit } = req.query;

            const where: any = {};
            if (search) {
                where.nome = { [Op.like]: `%${search}%` };
            }

            const offset = page && limit ? (Number(page) - 1) * Number(limit) : undefined;
            const limitNum = limit ? Number(limit) : undefined;

            const result = await this.model.findAndCountAll({
                where,
                limit: limitNum,
                offset: offset,
                order: [['nome', 'ASC']]
            });

            res.json({
                success: true,
                data: result.rows,
                pagination: {
                    totalItems: result.count,
                    page: Number(page) || 1,
                    pageSize: Number(limit) || result.count,
                    totalPages: limitNum ? Math.ceil(result.count / limitNum) : 1
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProdutoController();
