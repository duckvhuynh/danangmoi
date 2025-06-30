import * as React from "react"

interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

export function useSafeArea(): SafeAreaInsets {
  const [safeArea, setSafeArea] = React.useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  React.useEffect(() => {
    const updateSafeArea = () => {
      // Check if CSS env() is supported
      if (CSS.supports('padding', 'env(safe-area-inset-top)')) {
        const computedStyle = getComputedStyle(document.documentElement)
        
        // Try to get safe area values from CSS environment variables
        const top = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0
        const right = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0
        const bottom = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0
        const left = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0

        setSafeArea({ top, right, bottom, left })
      } else {
        // Fallback for older browsers - estimate safe area based on user agent
        const isIPhone = /iPhone/.test(navigator.userAgent)
        const isIPad = /iPad/.test(navigator.userAgent)
        const isAndroid = /Android/.test(navigator.userAgent)

        if (isIPhone || isIPad) {
          // Rough estimates for iOS devices
          setSafeArea({
            top: 44, // Status bar + notch
            right: 0,
            bottom: 34, // Home indicator
            left: 0
          })
        } else if (isAndroid) {
          // Rough estimates for Android devices
          setSafeArea({
            top: 24, // Status bar
            right: 0,
            bottom: 48, // Navigation bar
            left: 0
          })
        }
      }
    }

    updateSafeArea()
    
    // Update on orientation change
    window.addEventListener('orientationchange', updateSafeArea)
    window.addEventListener('resize', updateSafeArea)

    return () => {
      window.removeEventListener('orientationchange', updateSafeArea)
      window.removeEventListener('resize', updateSafeArea)
    }
  }, [])

  return safeArea
}

export function useSafeAreaInset(side: 'top' | 'right' | 'bottom' | 'left'): number {
  const safeArea = useSafeArea()
  return safeArea[side]
}
