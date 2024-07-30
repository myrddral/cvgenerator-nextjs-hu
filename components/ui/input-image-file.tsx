import type { FieldValues, UseFormSetError } from "react-hook-form"
import type { ZodError } from "zod"
import type { InputProps } from "./input"

import { imageSchema } from "@/form-generator/generator-schema"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { forwardRef, useRef, useState } from "react"
import { Card, CardContent } from "./card"
import Loader from "./loader"

export interface InputImageFileProps extends InputProps {
  setError: UseFormSetError<FieldValues>
}

interface UploadCardProps {
  src: string | undefined
  onClick: () => void
  isLoading: boolean
}

/**
 * The UploadCard component is a reusable component that displays an image and a button to upload an image.
 * It takes in the src prop, which is the URL of the image to be displayed, and the onClick prop, which is a function that is called when the button is clicked.
 * The isLoading prop is a boolean that determines whether the image is being loaded or not.
 *
 * @param src - The URL of the image to be displayed.
 * @param onClick - A function that is called when the button is clicked.
 * @param isLoading - A boolean that determines whether the image is being loaded or not.
 *
 * @returns A React component that displays an image and a button to upload an image.
 */
const UploadCard = ({ src, onClick, isLoading }: UploadCardProps) => {
  return (
    <Card className="duration-250 h-52 w-44 border border-input p-2 transition-all hover:ring-1 hover:ring-ring">
      <CardContent
        className="flex-center duration-250 relative h-full w-full cursor-pointer overflow-clip rounded-md pt-6 opacity-75 transition-opacity hover:opacity-50"
        onClick={onClick}
      >
        {isLoading ? (
          <Loader size="icon" className="h-40 w-40" />
        ) : (
          <Image
            className="h-[12rem] w-[10rem] object-cover"
            src={src ?? "/vecteezy_profile_placeholder.jpg"}
            alt="Profilkép feltöltése"
            fill
            sizes="(max-width: 768px) 10rem, (max-width: 1024px) 12rem, 12rem"
          />
        )}
      </CardContent>
    </Card>
  )
}

/**
 * The InputImageFile component is a reusable component that displays an image and a button to upload an image.
 * It takes in the className, type, setError, and other props as props.
 * It also returns a React component that displays an image and a button to upload an image.
 *
 * @param className - The className prop is used to add custom CSS classes to the component.
 * @param setError - The setError prop is used to set the error state of the form field.
 * @param props - The props prop is used to pass additional props to the component.
 *
 * @returns A React component that displays an image and a button to upload an image.
 */
const InputImageFile = forwardRef<HTMLInputElement, InputImageFileProps>(
  ({ className, setError, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false)
    //TODO: decide to display uploaded file properties to the user
    const [uploadedFile, setUploadedFile] = useState<File>()
    const [base64, setBase64] = useState<string>()
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true)
      setBase64(undefined)
      
      const file = e.target.files?.[0]
      setUploadedFile(file)

      if (file) {
        // Since the RHF controller does not support file uploads, we use a separate validation here
        // then we convert the parsed image to base64 string and set it as the value of the input
        const parsedImage = imageSchema.safeParse(file)
        if (parsedImage.success) {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64 = reader.result as string
            setBase64(base64)
            setIsLoading(false)
            props.onChange?.({ ...e, target: { ...e.target, value: base64 } })
          }
          reader.readAsDataURL(parsedImage.data)
        }

        if (parsedImage.error) {
          const e: ZodError = parsedImage.error
          const name = props.name
          if (!name) throw new Error("InputFile: name prop is missing")
          // To display one error message only, we take the first issue of the issues array
          setError(name, {
            type: "manual",
            message: e.issues[0].message,
          })
          setIsLoading(false)
        }
      }
    }

    const handleClick = () => {
      inputFileRef.current?.click()
    }

    return (
      <>
        <input
          type={"file"}
          className={cn("sr-only", className)}
          ref={(node) => {
            ref && (typeof ref === "function" ? ref(node) : (ref.current = node))
            inputFileRef.current = node
          }}
          {...props}
          value=""
          onChange={handleChange}
        />
        <UploadCard src={base64} onClick={handleClick} isLoading={isLoading} />
      </>
    )
  }
)
InputImageFile.displayName = "InputImageFile"

export { InputImageFile }
