import { useStore } from "@lib/context/store-context"
import { useState } from "react"
import { LineItem, Region } from "@medusajs/medusa"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import QuantityInput from "@modules/common/components/quantity-input"
import Trash from "@modules/common/icons/trash"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
}

const Item = ({ item, region }: ItemProps) => {
  const { updateItem, deleteItem } = useStore()
  const [quantity, setQuantity] = useState<number>(item.quantity)
  const [isDisabled, setIsDisabled] = useState(true)

  const handleConfirm = () => {
    isDisabled
      ? setIsDisabled(!isDisabled)
      : !isNaN(quantity) &&
        updateItem({
          lineId: item.id,
          quantity: quantity,
        })

    setIsDisabled(!isDisabled)
  }

  return (
    <div className="grid grid-cols-[122px_1fr] gap-x-4">
      <div className="w-[122px]">
        <Thumbnail thumbnail={item.thumbnail} size="full" />
      </div>
      <div className="text-base-regular flex flex-col gap-y-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span>{item.title}</span>
            <LineItemOptions variant={item.variant} />
          </div>

          <QuantityInput
            value={quantity}
            onChange={(e) => {
              setQuantity(Number(e.target.value))
            }}
            className="max-h-[35px] w-[75px]"
            disabled={isDisabled}
          >
            <button type="submit" onClick={() => handleConfirm()}>
              {isDisabled ? "Edit" : "Confirm"}
            </button>
          </QuantityInput>
        </div>
        <div className="flex items-end justify-between text-small-regular flex-1">
          <div>
            <button
              className="flex items-center gap-x-1 text-gray-500"
              onClick={() => deleteItem(item.id)}
            >
              <Trash size={14} />
              <span>Remove</span>
            </button>
          </div>
          <div>
            <LineItemPrice item={item} region={region} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
