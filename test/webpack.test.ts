import { expect } from "@jest/globals"
import { vol, fs as memfs } from "memfs"
import { ufs } from "unionfs"
import webpack from "webpack"
import * as actualfs from "fs"
import HtmlWebpackPlugin from "html-webpack-plugin"

const fs = ufs.use(vol as any).use(actualfs)

describe("webpack", () => {

    beforeAll(async () => {
        vol.fromJSON({
            "./src/index.html": "<html><h1>Some stuff</h1></html>",
            "./src/index.js": "function foo() { console.log('howdy') }",
            "./tsconfig.json": "glurg"
        }, "/project/")
    })

    it("memfs works", done => {
        new Promise((resolve, reject) => {
            fs.readdir("/project/src", (err, files) => {
                if (err) return reject(err)
                resolve(files)
            })
        })
        .then(files => {
            expect(files).toHaveLength(2)
            done()
        })
        .catch(err => done(err))
    })

    it("webpack works on index.ts", done => {
        const compiler = webpack({
            entry: "/project/src/index.js",
            resolve: {
                extensions: [".tsx", ".ts", ".js"],
            },
            output: {
                filename: "bundle.js",
                path: "/project/dist/"
            },
            plugins: [
                new HtmlWebpackPlugin()
            ]
        })

        compiler.inputFileSystem = fs
        compiler.outputFileSystem = fs

        compiler.run((_errors, stats) => {
            if (stats?.compilation) {
                for (const error of stats?.compilation?.errors) {
                    console.log({error})
                }
            }
            compiler.close((_closeErr) => {
                new Promise((resolve, reject) => {
                    memfs.readdir("/project/dist", (err, folders) => {
                        if (err) { return reject(err) }
                        return resolve(folders)
                    })
                })
                .then(folders => {
                    expect(folders).toContain("bundle.js")
                    done()
                })
                .catch(err => done(err))
            })
        })
    })
})

