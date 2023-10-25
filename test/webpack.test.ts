import { expect, jest } from "@jest/globals"
import { vol } from "memfs"
jest.mock("fs")
import fs from "fs"

describe("webpack is run", () => {

    beforeAll(() => {
        vol.fromJSON({
            "./someFile": Buffer.from("<html><h1>Some stuff</h1></html>")
        })
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    it("works", () => {
        let buffer = fs.readFileSync("./someFile")
        expect(buffer.toString()).toEqual("<html><h1>Some stuff</h1></html>")
    })
})

