import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react"
import Page from "./page";

describe('Page Login Hub', () => {
  afterEach(cleanup)
   // beforeEach(() => {
   //    render(<Page />)
   // })
  describe('Render component Login', () => {
    test('Should show input user', () => {
      const { debug } = render(<Page />)
      const inputUser = screen.getByPlaceholderText('Ingrese su usuario')
      expect(inputUser).toBeDefined()
    })
    test('Should show input password', () => {
      const { debug } = render(<Page />)
      debug()
      const inputPassword = screen.getByPlaceholderText('Ingrese su contraseña')
      expect(inputPassword).toBeDefined()
    })
  })
})