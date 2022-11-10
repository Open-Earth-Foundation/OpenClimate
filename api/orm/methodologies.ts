import {DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Model} from 'sequelize';
import { DataProvider } from './dataProviders';
import { Tag } from './tags';

const init = require('./init.ts');
const sequelize = init.connect();

export class Methodology extends Model<InferAttributes<Methodology>, InferCreationAttributes<Methodology>> {
    declare methodology_id: CreationOptional<number>;
    declare dataset_name: string;
    declare date_update: Date;
    declare methodology_link: string;
    declare data_provider_id: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Methodology.init({
    methodology_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    dataset_name: {
        type: DataTypes.STRING
    },
    date_update: {
        type: DataTypes.DATE
    },
    methodology_link: {
        type: DataTypes.STRING
    },
    data_provider_id: {
        type: DataTypes.STRING,
        references: {
            model: 'DataProvider',
            key: 'data_provider_id'
        }
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Methodology',
    tableName: 'methodologies',
    timestamps: false
});

// DataProvider.hasOne(Methodology);
DataProvider.belongsTo(Methodology, {
    foreignKey: {
        name: "data_provider_id"
    }
})

const mt = sequelize.define(
    'methodology_to_tag',
    {
        methodology_id: DataTypes.INTEGER,
        tag_id: DataTypes.INTEGER
    },
    {
        timestamps: false
    }
);

Methodology.belongsToMany(Tag, {
    through: mt,
    foreignKey: 'methodology_id',
    otherKey: 'tag_id'
});

Tag.belongsToMany(Methodology, {
    through: mt,
    foreignKey: 'tag_id',
    otherKey: 'methodology_id'
});