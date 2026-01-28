import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface ItemListaComprasAttributes {
    id: number;
    listaId: number;
    produtoId: number;
    quantidade: number;
    valorUnitario: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ItemListaComprasCreationAttributes extends Optional<ItemListaComprasAttributes, 'id'> { }

class ItemListaCompras extends Model<ItemListaComprasAttributes, ItemListaComprasCreationAttributes> implements ItemListaComprasAttributes {
    public id!: number;
    public listaId!: number;
    public produtoId!: number;
    public quantidade!: number;
    public valorUnitario!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ItemListaCompras.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        listaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'lista_id',
            references: {
                model: 'lista_compras',
                key: 'id'
            }
        },
        produtoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'produto_id',
            references: {
                model: 'produtos',
                key: 'id'
            }
        },
        quantidade: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 1
        },
        valorUnitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'valor_unitario'
        }
    },
    {
        sequelize,
        tableName: 'item_lista_compras',
        modelName: 'ItemListaCompras',
        underscored: true
    }
);

export default ItemListaCompras;
