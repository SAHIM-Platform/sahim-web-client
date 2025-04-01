interface OverlayProps {
  onClick?: () => void;
}

function Overlay({ onClick }: OverlayProps) {
  return (
    <div onClick={onClick} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
  )
}

export default Overlay;