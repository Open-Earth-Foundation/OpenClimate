import exp from 'constants';
import {DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Op} from 'sequelize';

const init = require('./init.ts')
const sequelize = init.connect()

export class User extends Model <InferAttributes<User>, InferCreationAttributes<User>> {
  declare user_id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare first_name: string;
  declare last_name: string;
  declare token: string;
  // timestamps!
  // createdAt can be undefined during creation
  declare created_at: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updated_at: CreationOptional<Date>;
  declare organization_id: number;
  
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    email: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.TEXT,
    },
    first_name: {
      type: DataTypes.TEXT,
    },
    last_name: {
      type: DataTypes.TEXT,
    },
    token: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    
  },
  {
    sequelize, // Pass the connection instance
    modelName: 'User',
    tableName: 'users', // Our table names don't follow the sequelize convention and thus must be explicitly declared
    timestamps: false,
  },
)

// ROLES
class Role extends Model {}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize, // Pass the connection instance
    modelName: 'Role',
    tableName: 'roles', // Our table names don't follow the sequelize convention and thus must be explicitly declared
    timestamps: false,
  },
)

const User_Role = sequelize.define(
  'roles_to_users',
  {
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
  },
  {
    timestamps: false,
  },
)

User.belongsToMany(Role, {
  through: User_Role,
  foreignKey: 'user_id',
  otherKey: 'role_id',
})

Role.belongsToMany(User, {
  through: User_Role,
  foreignKey: 'role_id',
  otherKey: 'user_id',
})

export async function linkRoleAndUser(role_id, user_id) {
  try {
    // Create roles and link to user in 'roles-to-users table'
    const addRole = await User_Role.create({
      user_id,
      role_id
    })
    console.log(addRole)
    console.log('Successfully linked user and role')
  } catch (error) {
    console.error('Error linking user and role', error)
  }
}

export async function createRole (role_name) {
  try {
    const timestamp = Date.now()

    const role = await Role.create({
      role_name,
    })

    console.log('Role saved successfully.')
    return role
  } catch (error) {
    console.error('Error saving role to the database: ', error)
  }
}

export async function readRole (role_id) {
  try {
    const role = await Role.findAll({
      where: {
        role_id,
      },
    })

    return role[0]
  } catch (error) {
    console.error('Could not find role in the database: ', error)
  }
}

export async function readRoles () {
  try {
    const roles = await Role.findAll()

    return roles
  } catch (error) {
    console.error('Could not find roles in the database: ', error)
  }
}

export async function updateRole (role_id, role_name) {
  try {
    const timestamp = Date.now()

    await Role.update(
      {
        role_id,
        role_name,
      },
      {
        where: {
          role_id,
        },
      },
    )

    console.log('Role updated successfully.')
  } catch (error) {
    console.error('Error updating the Role: ', error)
  }
}

export async function deleteRole (role_id) {
  try {
    await Role.destroy({
      where: {
        role_id,
      },
    })

    console.log('Successfully deleted role')
  } catch (error) {
    console.error('Error while deleting role: ', error)
  }
}

// USERS
export async function createUser (organization_id, email, first_name, last_name) {
  try {
    const user = await User.create({
      email,
      first_name,
      last_name,
      organization_id
    })

    return user
  } catch (error) {
    console.error('Error saving user to the database: ', error)
  }
}

export async function readUser (user_id) {
  try {
    const user = await User.findAll({
      where: {
        user_id,
      },
      include: [
        {
          model: Role,
        },
        {
          model: Organization,
          required: false,
        }
      ],
    })

    return user[0]
  } catch (error) {
    console.error('Could not find user by id in the database: ', error)
  }
}

export async function readUserByToken (token) {
  try {
    const user = await User.findAll({
      where: {
        token,
      },
      include: [
        {
          model: Role,
        },
        {
          model: Organization,
          required: false,
        }
      ],
    })

    return user[0]
  } catch (error) {
    console.error('Could not find user by token in the database: ', error)
  }
}

export async function readUserByEmail (email) {
  try {
    const user = await User.findAll({
      where: {
        email,
      },
      include: [
        {
          model: Role,
        },
        {
          model: Organization,
          required: false,
        }
      ],
    })

    return user[0]
  } catch (error) {
    console.error('Could not find user by email in the database: ', error)
  }
}

export async function readUsers () {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
        },
        {
          model: Organization,
          required: false,
        }
      ],
    })

    return users
  } catch (error) {
    console.error('Could not find users in the database: ', error)
  }
}

export async function updateUserInfo (
  user_id,
  organization_id,
  email,
  first_name,
  last_name,
  password,
  token,
) {
  try {
    await User.update(
      {
        organization_id,
        email,
        first_name,
        last_name,
        password,
        token
      },
      {
        where: {
          user_id,
        },
      },
    )

    const user = readUser(user_id)

    console.log(`User updated successfully.`)
    return user
  } catch (error) {
    console.error('Error updating the User: ', error)
  }
}

export async function updateUserPassword (user_id, password) {
  try {
    const timestamp = Date.now()

    await User.update(
      {
        password,
        token: '',
      },
      {
        where: {
          user_id,
        },
      },
    )

    console.log('Password updated successfully.')
  } catch (error) {
    console.error('Error updating the password: ', error)
  }
}

export async function deleteUser (user_id) {
  try {
    await User.destroy({
      where: {
        user_id,
      },
    })

    console.log('User was successfully deleted')
    return user_id
  } catch (error) {
    console.error('Error while deleting user: ', error)
  }
}

export async function deleteRolesUserConnection (user_id) {
  try {
    await User_Role.destroy({
      where: {
        user_id,
      },
    })

    console.log('User roles connection was successfully deleted')
  } catch (error) {
    console.error('Error while deleting user: ', error)
  }
}

const {Organization} = require('./organizations.ts')