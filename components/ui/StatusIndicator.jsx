import clsx from 'clsx'

export default function StatusIndicator({ status, label, className }) {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <span className={clsx(
        'w-1.5 h-1.5 block',
        status === 'online'  && 'bg-black',
        status === 'offline' && 'bg-gray-300',
        status === 'pending' && 'bg-gray-500 animate-pulse',
        status === 'error'   && 'bg-red-600'
      )} />
      {label && (
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">
          {label}
        </span>
      )}
    </div>
  )
}