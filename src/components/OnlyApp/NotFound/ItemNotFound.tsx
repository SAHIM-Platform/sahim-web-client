interface ItemNotFoundProps {
  description: string;
}

function ItemNotFound ({description}: ItemNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

export default ItemNotFound;
