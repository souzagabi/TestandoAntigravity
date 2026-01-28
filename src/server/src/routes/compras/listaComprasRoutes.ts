import { Router } from 'express';
import ListaComprasController from '../../controller/compras/ListaComprasController';

const router = Router();

router.get('/', ListaComprasController.findAll.bind(ListaComprasController));
router.get('/:id', ListaComprasController.findById.bind(ListaComprasController));
router.post('/', ListaComprasController.create.bind(ListaComprasController));
router.put('/:id', ListaComprasController.update.bind(ListaComprasController));
router.delete('/:id', ListaComprasController.delete.bind(ListaComprasController));

export default router;
