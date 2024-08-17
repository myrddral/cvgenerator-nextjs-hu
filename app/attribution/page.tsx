import MainContainer from "../../components/main-container"
import { Card } from "../../components/ui/card"

export default function AttribPage() {
  return (
    <div>
      <Card className="bg-transparent/30 p-6">
        <h1 className="mb-8 text-center font-display text-3xl font-bold leading-none tracking-wider">
          Kredit
        </h1>
        <ul className="flex justify-center">
          <li>
            <a
              href="https://www.freepik.com/free-vector/abstract-3d-perspective-indoor-wireframe-vector-design_32237062.htm#fromView=search&page=1&position=12&uuid=3b8f1d69-d369-41a5-9af2-a6fab87f7682"
              className="text-primary"
            >
              Háttérkép: hálózat: starline on Freepik
            </a>
          </li>
          <li>
            <a href="https://app.kittl.com/" className="text-primary">
              Avatar grafika: www.kittl.com
            </a>
          </li>
          <li>
            <a href="https://vecteezy.com/" className="text-primary">
              Avatar grafika: www.vecteezy.com
            </a>
          </li>
        </ul>
      </Card>
    </div>
  )
}
