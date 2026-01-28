import ListaCompras from './ListaCompras';
import ItemListaCompras from './ItemListaCompras';
import Produto from '../produto/Produto';

export function setupComprasAssociations() {
    // ListaCompras <-> ItemListaCompras
    ListaCompras.hasMany(ItemListaCompras, {
        foreignKey: 'listaId',
        as: 'itens',
        onDelete: 'CASCADE'
    });

    ItemListaCompras.belongsTo(ListaCompras, {
        foreignKey: 'listaId',
        as: 'lista'
    });

    // ItemListaCompras <-> Produto
    ItemListaCompras.belongsTo(Produto, {
        foreignKey: 'produtoId',
        as: 'produto'
    });

    // Produto hasMany ItemLista? Usually not needed, but good for integriy
    Produto.hasMany(ItemListaCompras, {
        foreignKey: 'produtoId'
    });
}
