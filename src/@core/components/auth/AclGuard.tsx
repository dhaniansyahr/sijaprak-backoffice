// ** React Imports
import { ReactNode, useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityForACL, buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false } = props

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined)

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  // Build ability when user data or ACL data changes
  useEffect(() => {
    if (auth.user) {
      // If we have ACL data from API, use it
      if (auth.acl) {
        const newAbility = buildAbilityForACL(auth.acl)
        setAbility(newAbility)
      } else if (auth.user.role) {
        // Fallback to legacy role-based system
        const newAbility = buildAbilityFor(auth.user.role)
        setAbility(newAbility)
      }
    } else {
      // Clear ability if no user
      setAbility(undefined)
    }
  }, [auth.user, auth.acl])

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (guestGuard || router.route === '/404' || router.route === '/500' || router.route === '/') {
    return <>{children}</>
  }

  // Show loading spinner while ACL is being fetched
  if (auth.user && auth.aclLoading) {
    return <Spinner />
  }

  // Check the access of current user and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // If user is authenticated but doesn't have required permission, show not authorized
  if (auth.user && ability) {
    return (
      <BlankLayout>
        <NotAuthorized />
      </BlankLayout>
    )
  }

  // If ability is not yet built, show loading spinner
  if (auth.user && !ability) {
    return <Spinner />
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
