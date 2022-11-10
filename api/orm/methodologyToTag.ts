import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';



const init = require('./init.ts');
const sequelize = init.connect();

export class MethodologyToTag extends Model <InferAttributes<MethodologyToTag>, InferCreationAttributes<MethodologyToTag>> {
    declare methodology_id: CreationOptional<number>;
    declare tag_id: CreationOptional<number>;
}

MethodologyToTag.init({
    methodology_id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        unique: true,
        references: {
            model: 'Methodology',
            key: 'methodology_id'
        }
    },
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        unique: true,
        references: {
            model: 'Tag',
            key: 'tag_id'
        }
    },
    
}, {
    sequelize,
    modelName: 'MethodologyToTag',
    tableName: 'methodology_to_tag',
    timestamps: false
});