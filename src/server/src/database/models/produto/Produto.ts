import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface ProdutoAttributes {
    id: number;
    nome: string;
    categoria?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ProdutoCreationAttributes extends Optional<ProdutoAttributes, 'id'> { }

class Produto extends Model<ProdutoAttributes, ProdutoCreationAttributes> implements ProdutoAttributes {
    public id!: number;
    public nome!: string;
    public categoria!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Produto.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'produtos',
        modelName: 'Produto',
    }
);

export default Produto;
