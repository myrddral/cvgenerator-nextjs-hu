// This file is needed to make DOM testing work with Bun. jsdom is not compatible with Bun as of now.
import { GlobalRegistrator } from "@happy-dom/global-registrator"

GlobalRegistrator.register()
