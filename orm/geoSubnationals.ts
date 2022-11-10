import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
const sequelize = init.connect()

class Geosubnationals extends Model <InferAttributes<Geosubnationals>, InferCreationAttributes<Geosubnationals>>{
  declare id: CreationOptional<number>;
  declare countryCode: number;
  declare data: JSON | null;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

Geosubnationals.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    countryCode: {
      type: DataTypes.INTEGER,
    },
    data: {
      type: DataTypes.JSONB,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize, 
    modelName: 'Geosubnationals',
    tableName: 'geosubnationals', 
    timestamps: false,
  },
)

export = {
  Geosubnationals
}
