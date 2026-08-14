export type RouteView = "dashboard" | "list" | "detail" | "create" | "edit"

export interface Route {
  module: string
  view: RouteView
  id?: string
  submodule?: string
}
