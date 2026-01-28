import { Model as SequelizeModel, ModelStatic } from 'sequelize';

export interface DefaultAttributes {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export type Model = SequelizeModel<any, any> & DefaultAttributes;
