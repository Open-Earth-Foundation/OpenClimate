import rules from './rbac-rules'

export const check = (rules, user, actions) => {
  // Get user roles
  if (!user) return false

  let roles = user.roles

  // Handle multiple roles by casting roles into array
  roles = roles instanceof Array ? roles : [roles]

  let permissions = []

  // Combine roles, ignore duplicate roles
  for (let i = 0; i < Object.keys(roles).length; i++) {
    permissions = permissions.concat(
      rules[roles[i]].filter((item) => permissions.indexOf(item) < 0)
    )
  }
  // (megan olsen) the above function throws an error in the console, please check.
  // (mikekebert) the above throws a warning for a paradigm that seems like it shouldn't matter. I don't know how to get around it yet.

  if (!permissions) {
    return false
  }

  // Determine all the permissions required by the component
  if (permissions) {
    const actionsList = actions.split(', ')

    // Check if the user has all required permissions
    for (const action in actionsList) {
      if (permissions.includes(actionsList[action])) {
        return true
      }
    }
  }
  return false
}

export const CanUser = (props) =>
  check(rules, props.user, props.perform, props.data) ? props.yes() : props.no()

CanUser.defaultProps = {
  yes: () => null,
  no: () => null,
}
