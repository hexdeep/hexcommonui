import { Icon, type IconProps } from '@iconify/react'
import check from '@iconify-icons/material-symbols/check'
import chevronDown from '@iconify-icons/material-symbols/keyboard-arrow-down'
import chevronRight from '@iconify-icons/material-symbols/chevron-right'
import close from '@iconify-icons/material-symbols/close'
import info from '@iconify-icons/material-symbols/info-outline'

const materialSymbols = { check, chevronDown, chevronRight, close, info } as const

export type HexIconName = keyof typeof materialSymbols

/**
 * HexUI's default icon renderer. Built-in names always use Material Symbols
 * and are statically bundled, so desktop clients do not fetch icon data at
 * runtime. `icon` is the explicit escape hatch for a product-specific or
 * brand icon that Material Symbols does not provide.
 */
export function HexIcon({ name, icon, ...props }: Omit<IconProps, 'icon'> & { name: HexIconName; icon?: IconProps['icon'] }) {
  return <Icon icon={icon ?? materialSymbols[name]} {...props} />
}
