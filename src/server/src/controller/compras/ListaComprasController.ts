import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../../database/config/database';
import ListaCompras from '../../database/models/compras/ListaCompras';
import ItemListaCompras from '../../database/models/compras/ItemListaCompras';
import Produto from '../../database/models/produto/Produto';
import ModelController from '../ModelController';

class ListaComprasController extends ModelController<ListaCompras> {
    constructor() {
        super(ListaCompras);
    }

    // Override findAll to include items and products
    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page, limit } = req.query;
            const offset = page && limit ? (Number(page) - 1) * Number(limit) : undefined;
            const limitNum = limit ? Number(limit) : undefined;

            const result = await this.model.findAndCountAll({
                limit: limitNum,
                offset: offset,
                include: [
                    {
                        model: ItemListaCompras,
                        as: 'itens',
                        include: [{ model: Produto, as: 'produto' }]
                    }
                ],
                distinct: true, // Important for correct count with includes
                order: [['dataCriacao', 'DESC']]
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

    // Override findById to include items
    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const result = await this.model.findByPk(id, {
                include: [
                    {
                        model: ItemListaCompras,
                        as: 'itens',
                        include: [{ model: Produto, as: 'produto' }]
                    }
                ]
            });

            if (!result) {
                res.status(404).json({ success: false, message: "Lista não encontrada" });
                return;
            }
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    // Override create to handle items
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            const { itens, ...listaData } = req.body;

            const lista = await ListaCompras.create(listaData, { transaction });

            if (itens && Array.isArray(itens)) {
                const itensToCreate = itens.map((item: any) => ({
                    ...item,
                    listaId: lista.id
                }));

                await ItemListaCompras.bulkCreate(itensToCreate, { transaction });
            }

            await transaction.commit();

            // Fetch the complete created object
            const result = await ListaCompras.findByPk(lista.id, {
                include: [
                    {
                        model: ItemListaCompras,
                        as: 'itens',
                        include: [{ model: Produto, as: 'produto' }]
                    }
                ]
            });

            res.status(201).json({ success: true, message: "Lista criada com sucesso", data: result });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    // Override update to handle items update (replace strategy for simplicity?)
    // Or just update list details. For now, let's assume we update only list fields.
    // Full update would require diffing items.
    // Let's implement a simple update that can also upldate status
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;
            const record = await this.model.findByPk(id);

            if (!record) {
                await transaction.rollback();
                res.status(404).json({ success: false, message: "Lista não encontrada" });
                return;
            }

            const { itens, ...data } = req.body;
            await record.update(data, { transaction });

            // If items are provided, replace them (simple approach) or update?
            // "Inserir quantidade, valor unitário..." implies we might edit an existing list.
            // Let's do a full replace of items if 'itens' is provided.
            if (itens && Array.isArray(itens)) {
                // Delete existing items
                await ItemListaCompras.destroy({ where: { listaId: id }, transaction });

                // Create new items
                const itensToCreate = itens.map((item: any) => ({
                    ...item,
                    listaId: id
                }));
                await ItemListaCompras.bulkCreate(itensToCreate, { transaction });
            }

            await transaction.commit();

            const result = await ListaCompras.findByPk(id, {
                include: [
                    {
                        model: ItemListaCompras,
                        as: 'itens',
                        include: [{ model: Produto, as: 'produto' }]
                    }
                ]
            });

            res.json({ success: true, message: "Lista atualizada com sucesso", data: result });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }
}

export default new ListaComprasController();
