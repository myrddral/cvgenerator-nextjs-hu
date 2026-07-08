import type { FieldValues, UseFormSetError } from "react-hook-form"
import type { ZodError } from "zod"
import type { InputProps } from "./input"

import { getImageSchema } from "@/form-generator/validation-schemas"
import { cn } from "@/lib/utils"
import { useCvId } from "@/hooks/use-cv-id"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { forwardRef, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "./card"
import Loader from "./loader"

export interface InputImageFileProps extends InputProps {
  setError: UseFormSetError<FieldValues>
  value: string
}

interface UploadCardProps {
  src: string | undefined
  onClick: () => void
  isLoading: boolean
  alt: string
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
const UploadCard = ({ src, onClick, isLoading, alt }: UploadCardProps) => {
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
            alt={alt}
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
  ({ className, setError, value, ...props }, ref) => {
    const t = useTranslations("CreateFlow")
    const imageSchema = useMemo(() => getImageSchema(t), [t])
    const cvId = useCvId()
    const generateUploadUrl = useMutation(api.cvs.generateUploadUrl)
    const setPicture = useMutation(api.cvs.setPicture)
    const [isLoading, setIsLoading] = useState(false)
    const [pictureUrl, setPictureUrl] = useState<string | undefined>(
      value && value.length > 0 ? value : undefined
    )
    const [prevValue, setPrevValue] = useState(value)
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    // keep pictureUrl in sync when the form value changes externally (e.g. switching
    // to edit a different item) - adjusted during render rather than in an effect
    if (value !== prevValue) {
      setPrevValue(value)
      if (value && value.length > 0) {
        setPictureUrl(value)
      }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true)
      setPictureUrl(undefined)

      const file = e.target.files?.[0]
      if (!file || !cvId) {
        setIsLoading(false)
        return
      }

      const parsedImage = imageSchema.safeParse(file)
      if (!parsedImage.success) {
        const error: ZodError = parsedImage.error
        const name = props.name
        if (!name) throw new Error("InputFile: name prop is missing")
        // To display one error message only, we take the first issue of the issues array
        setError(name, { type: "manual", message: error.issues[0]?.message })
        setIsLoading(false)
        return
      }

      const uploadUrl = await generateUploadUrl({})
      const uploadResponse = await fetch(uploadUrl, { method: "POST", body: parsedImage.data })
      const { storageId } = (await uploadResponse.json()) as { storageId: Id<"_storage"> }
      const { pictureUrl: resolvedUrl } = await setPicture({ cvId: cvId as Id<"cvs">, storageId })

      setPictureUrl(resolvedUrl ?? undefined)
      setIsLoading(false)
      props.onChange?.({ ...e, target: { ...e.target, value: resolvedUrl ?? "" } })
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
          value={""}
          onChange={(e) => void handleChange(e)}
        />
        <UploadCard src={pictureUrl} onClick={handleClick} isLoading={isLoading} alt={t("pictureUploadAlt")} />
      </>
    )
  }
)
InputImageFile.displayName = "InputImageFile"

export { InputImageFile }
