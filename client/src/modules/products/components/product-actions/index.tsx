import { useProductActions } from "@lib/context/product-context"
import useProductPrice from "@lib/hooks/use-product-price"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import Button from "@modules/common/components/button"
import OptionSelect from "@modules/products/components/option-select"
import clsx from "clsx"
import Link from "next/link"
import React, { ChangeEvent, useMemo } from "react"

import { Product } from "types/medusa"
import QuantityInput from "@modules/common/components/quantity-input"
import { useState } from "react"

type ProductActionsProps = {
  product: PricedProduct
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const {
    updateOptions,
    addToCart,
    increaseQuantity,
    options,
    inStock,
    variant,
  } = useProductActions()

  const [quantity, setQuantity] = useState<number>(1)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    increaseQuantity(Number(e.target.value))
    setQuantity(Number(e.target.value))
  }

  const price = useProductPrice({ id: product.id!, variantId: variant?.id })

  const selectedPrice = useMemo(() => {
    const { variantPrice, cheapestPrice } = price
    return variantPrice || cheapestPrice || null
  }, [price])

  return (
    <div className="flex flex-col gap-y-2">
      {product.collection && (
        <Link
          href={`/collections/${product.collection.handle}`}
          className="text-small-regular text-gray-700"
        >
          {product.collection.title}
        </Link>
      )}
      <h3 className="text-xl-regular">{product.title}</h3>

      <p className="text-base-regular">{product.description}</p>

      {product.variants.length > 1 && (
        <div className="my-8 flex flex-col gap-y-6">
          {(product.options || []).map((option) => {
            return (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={updateOptions}
                  title={option.title}
                />
              </div>
            )
          })}
        </div>
      )}

      <div className="mb-4">
        {selectedPrice ? (
          <div className="flex flex-col text-gray-700">
            <span
              className={clsx("text-xl-semi", {
                "text-rose-600": selectedPrice.price_type === "sale",
              })}
            >
              {selectedPrice.calculated_price}
            </span>
            <div>Quantity</div>
            <QuantityInput
              value={quantity}
              onChange={handleChange}
              className="max-h-[35px] w-[75px]"
            />
            {selectedPrice.price_type === "sale" && (
              <>
                <p>
                  <span className="text-gray-500">Original: </span>
                  <span className="line-through">
                    {selectedPrice.original_price}
                  </span>
                </p>
                <span className="text-rose-600">
                  -{selectedPrice.percentage_diff}%
                </span>
              </>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <Button onClick={() => addToCart()}>
        {!inStock ? "Out of stock" : "Add to cart"}
      </Button>
    </div>
  )
}

export default ProductActions
