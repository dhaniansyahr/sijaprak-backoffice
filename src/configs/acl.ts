import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'generate'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any

export type ACLObj = {
  action: Actions
  subject: string
}

// Define the structure of ACL data received from API
export type ACLData = {
  [key: string]: {
    [key in Actions]?: boolean
  }
}

// API response structure for ACL
export type ACLResponse = {
  content: ACLData
  message: string
  errors: string[]
}

/**
 * Build ability rules from API response
 * @param aclData - ACL data from API response
 * @returns Ability rules
 */
const defineRulesFromACL = (aclData: ACLData) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  // Iterate through each module in ACL data
  Object.keys(aclData).forEach(module => {
    const permissions = aclData[module]

    // Grant permissions for each action that is true
    Object.keys(permissions).forEach(action => {
      if (permissions[action as Actions] === true) {
        can(action as Actions, module)
      }
    })
  })

  return rules
}

/**
 * Build ability for user based on ACL data fetched from API
 * @param aclData - ACL data from API
 * @returns AppAbility instance
 */
export const buildAbilityForACL = (aclData: ACLData): AppAbility => {
  return new AppAbility(defineRulesFromACL(aclData), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use buildAbilityForACL instead
 */
export const buildAbilityFor = (role: string): AppAbility => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (role === 'SUPER_ADMIN') {
    can('manage', 'all')
  } else {
    can('manage', 'all')
  }

  return new AppAbility(rules, {
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFromACL
