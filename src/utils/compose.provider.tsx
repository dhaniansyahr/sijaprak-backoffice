import { FC, ReactNode } from 'react'

export type ProviderComponent = FC<{ children: ReactNode }>

export function composeProviders(...components: ProviderComponent[]): ProviderComponent {
  return components.reduce(
    (AccumulatedProviders: ProviderComponent, CurrentProvider: ProviderComponent): ProviderComponent => {
      return ({ children }: { children: ReactNode }) => (
        <AccumulatedProviders>
          <CurrentProvider>{children}</CurrentProvider>
        </AccumulatedProviders>
      )
    },
    ({ children }: { children: ReactNode }) => <>{children}</>
  )
}
