const Users = require('../orm/users')

// Perform Agent Business Logic
const getRole = async (roleID) => {
  try {
    const role = await Users.readRole(roleID)

    return role
  } catch (error) {
    console.error('Error Fetching Role')
    throw error
  }
}

const getAll = async () => {
  try {
    const roles = await Users.readRoles()

    return roles
  } catch (error) {
    console.error('Error Fetching Roles')
    throw error
  }
}

const createRole = async function (rolename) {
  try {
    await Users.createRole(rolename)
  } catch (error) {
    console.error('Error Fetching Roles')
    throw error
  }
}

export = {
  createRole,
  getRole,
  getAll,
}
