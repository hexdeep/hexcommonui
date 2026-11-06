import { HexIcon } from './HexIcon'
import { Tooltip } from './Tooltip'

export function LabelHint({ text, tone = 'info' }: { text: string; tone?: 'info' | 'error' }) {
  return <Tooltip content={text}><span className={`inline-flex shrink-0 ${tone === 'error' ? 'text-red-500' : 'text-neutral-400'}`}><HexIcon name="info" width={13} /></span></Tooltip>
}
