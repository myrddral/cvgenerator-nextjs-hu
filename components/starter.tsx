"use client"
import { useState } from "react"
import StarterCard from "./starter-card"
import StarterCardHelp from "./starter-card-help"

export default function Starter() {
  const [isHelpVisible, setIsHelpVisible] = useState(false)

  return isHelpVisible ? (
    <StarterCardHelp isHelpVisible={isHelpVisible} setIsHelpVisible={setIsHelpVisible} />
  ) : (
    <StarterCard isHelpVisible={isHelpVisible} setIsHelpVisible={setIsHelpVisible} />
  )
}
