import { Router } from 'express';
import ProdutoController from '../../controller/produto/ProdutoController';

const router = Router();

router.get('/', ProdutoController.findAll.bind(ProdutoController));
router.get('/:id', ProdutoController.findById.bind(ProdutoController));
router.post('/', ProdutoController.create.bind(ProdutoController));
router.put('/:id', ProdutoController.update.bind(ProdutoController));
router.delete('/:id', ProdutoController.delete.bind(ProdutoController));

export default router;
