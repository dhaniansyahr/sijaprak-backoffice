import { ACLData, Actions } from 'src/configs/acl'
import navigation from 'src/navigation/vertical'

/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string, acl?: ACLData | null) => {
  // If no ACL data, fallback to role-based routing
  if (!acl) {
    if (role === 'client') {
      return '/404'
    }

    return '/dashboard'
  }

  // Helper function to check if user has access to a sidebar item
  const hasAccess = (item: any): boolean => {
    // Check if user has the required permission
    const hasPermission = acl?.[item?.subject]?.[item.action as Actions]

    return !!hasPermission
  }

  // Helper function to check if user has access to any child items
  const hasChildAccess = (item: any): boolean => {
    if (!item.children || !Array.isArray(item.children)) return false

    return item.children.some((child: any) => {
      return acl[child.subject]?.[child.action as Actions]
    })
  }

  // Find the first accessible route by iterating through sidebarOptions
  for (const item of navigation() as any[]) {
    // Check if user has access to main item
    if (item.path && hasAccess(item)) {
      return item.path
    }

    // Check if user has access to any child items
    if (hasChildAccess(item)) {
      // Find the first accessible child
      for (const child of item.children || []) {
        if (child.path && acl[child.subject]?.[child.action as Actions]) {
          return child.path
        }
      }
    }
  }

  // Fallback to ACL page if no accessible routes found
  return '/401'
}

export default getHomeRoute
