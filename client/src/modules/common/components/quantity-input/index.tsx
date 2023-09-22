import { ErrorMessage } from "@hookform/error-message"
import { useStore } from "@lib/context/store-context"
import clsx from "clsx"
import {
  forwardRef,
  InputHTMLAttributes,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { get } from "react-hook-form"

export type QuantityInputProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  // onConfirm?: (value: string) => void
} & InputHTMLAttributes<HTMLInputElement>

const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
  (
    { placeholder = "0", errors, touched, className, children, ...props },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null)
    const [isEmptyValue, setIsEmptyValue] = useState(false)

    const [isDisabled, setIsDisabled] = useState(true)
    // const [inputValue, setInputValue] = useState("1")

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current
    )

    const hasError = props.name
      ? get(errors, props.name) && get(touched, props.name)
      : false

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsEmptyValue(true)
      } else {
        setIsEmptyValue(false)
      }
    }, [innerRef.current?.value])

    const handleClick = () => {
      // if (!isDisabled) {
      //   onConfirm(inputValue)
      // }
      setIsDisabled(!isDisabled)
    }

    return (
      <div>
        <div
          onFocus={() => innerRef.current?.focus()}
          onBlur={() => innerRef.current?.blur()}
          className={clsx(
            "relative flex items-center text-base-regular border border-gray-200",
            className,
            {
              "text-gray-500": isEmptyValue,
            }
          )}
        >
          <input
            ref={innerRef}
            // value={inputValue}
            {...props}
            className="appearance-none flex-1 bg-transparent border-none px-4 py-2.5 transition-colors duration-150 focus:border-gray-700 outline-none"
            disabled={isDisabled}
          />
        </div>
        <button type="submit" onClick={() => handleClick()}>
          {!isDisabled ? "Confirm" : "Button: Quantity Change"}
        </button>
        {/* <button></button> */}
        {hasError && props.name && (
          <ErrorMessage
            errors={errors}
            name={props.name}
            render={({ message }) => {
              return (
                <div className="pt-1 pl-2 text-rose-500 text-xsmall-regular">
                  <span>{message}</span>
                </div>
              )
            }}
          />
        )}
      </div>
    )
  }
)

QuantityInput.displayName = "QuantityInput"

export default QuantityInput
