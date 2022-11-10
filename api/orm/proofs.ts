import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
const sequelize = init.connect()

class Proofs extends Model <InferAttributes<Proofs>, InferCreationAttributes<Proofs>> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare cred_def_id: string;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
}

Proofs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    cred_def_id: {
      type: DataTypes.TEXT,
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
    modelName: 'Proofs',
    tableName: 'proofs', 
    timestamps: false,
  },
)


const createProof = async function (user_id, cred_def_id) {
  try {
    const timestamp = Date.now()

    const proof = await Proofs.create({
      user_id,
      cred_def_id
    })

    return proof
  } catch (error) {
    console.error('Error saving proof cred def to the database: ', error)
  }
}

const readProof = async function (id) {
  try {
    const proof = await Proofs.findAll({
      where: {
        id,
      }
    })

    return proof[0]
  } catch (error) {
    console.error('Could not find proof cred def by id in the database: ', error)
  }
}

const readProofsByUserId = async function (user_id) {
  try {
    const proofs = await Proofs.findAll({
      where: {
        user_id
      }
    })

    return proofs
  } catch (error) {
    console.error('Could not find proof cred def by user id in the database: ', error)
  }
}

const readProofsByCredDef = async function (user_id, cred_def_id) {
  try {
    const proof = await Proofs.findAll({
      where: {
        user_id,
        cred_def_id
      }
    })

    return proof[0]
  } catch (error) {
    console.error('Could not find proof cred def by cred def id in the database: ', error)
  }
}


export = {
  Proofs,
  createProof,
  readProof,
  readProofsByUserId,
  readProofsByCredDef
}
