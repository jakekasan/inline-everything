import { Compiler } from "webpack"

class HTMLInlineEverything {

    apply = (compiler: Compiler): void => {
        compiler.hooks.done.tap(
            "HTML Inline Everything!",
            _stats => { console.log("Webpack ran us!") }
        )
    }

}

export default HTMLInlineEverything

