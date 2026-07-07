import { Card } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export default function AttribPage() {
  const t = useTranslations("AttributionPage")

  return (
    <div>
      <Card className="bg-transparent/30 p-6">
        <h1 className="font-display mb-8 text-center text-3xl font-bold leading-none tracking-wider">
          {t("title")}
        </h1>
        <ul className="flex justify-center">
          <li>
            <a
              href="https://www.freepik.com/free-vector/abstract-3d-perspective-indoor-wireframe-vector-design_32237062.htm#fromView=search&page=1&position=12&uuid=3b8f1d69-d369-41a5-9af2-a6fab87f7682"
              className="text-primary"
            >
              {t("background")}
            </a>
          </li>
          <li>
            <a href="https://app.kittl.com/" className="text-primary">
              {t("avatarKittl")}
            </a>
          </li>
          <li>
            <a href="https://vecteezy.com/" className="text-primary">
              {t("avatarVecteezy")}
            </a>
          </li>
        </ul>
      </Card>
    </div>
  )
}
