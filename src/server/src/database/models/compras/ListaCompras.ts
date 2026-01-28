import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface ListaComprasAttributes {
    id: number;
    dataCriacao: Date;
    nome?: string; // Optinal name for the list
    stConcluida: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ListaComprasCreationAttributes extends Optional<ListaComprasAttributes, 'id' | 'dataCriacao' | 'stConcluida'> { }

class ListaCompras extends Model<ListaComprasAttributes, ListaComprasCreationAttributes> implements ListaComprasAttributes {
    public id!: number;
    public dataCriacao!: Date;
    public nome!: string;
    public stConcluida!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ListaCompras.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        dataCriacao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'data_criacao'
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stConcluida: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'st_concluida'
        }
    },
    {
        sequelize,
        tableName: 'lista_compras',
        modelName: 'ListaCompras',
        underscored: true
    }
);

export default ListaCompras;
