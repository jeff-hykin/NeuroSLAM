# this was autogenerated by: "virkshop/plugins/nodejs.deno.js"
;
# all its doing is importing that javascript^, running a specific function from it, and then shell-sourcing the string output
;
'/Users/jeffhykin/.deno/1.41.3/bin/deno' 'eval' '--no-lock' '--no-config' '-q' '
                                                    import { FileSystem } from "https://deno.land/x/quickr@0.6.72/main/file_system.js"
                                                    const eventName = "@setup_with_system_tools/nodejs"
                                                    const [ virkshopFile, tempShellOutputPath, pluginPath ] = Deno.args
                                                    const { virkshop, shellApi } = await import(virkshopFile)
                                                    const { pluginOutput } = await virkshop._internal.importPlugin(pluginPath)
                                                    const result = await pluginOutput.events[eventName].apply(pluginOutput)
                                                    if (result instanceof Object && (result.beforeSetup|| result.beforeReadingSystemTools|| result.beforeShellScripts|| result.beforeEnteringVirkshop)) {
                                                        console.error(`In the plugin ${pluginPath}, the event hook ${JSON.stringify(eventName)} returned an object.
The author of that was probably a bit confused as, yes
the @setup_without_system_tools event expects an output like { beforeSetup:()=>{}, }
but @setup_without_system_tools is special.
Other events must return either nothing or a string
(a string that will be executed as a sourced shell script)

AKA the @setup_with_system_tools/nodejs isn'"'"'t allowed to return an object.`)
                                                        Deno.exit(1)
                                                    }
                                                    const shellString = shellApi.joinStatements((result||[]))
                                                    await FileSystem.write({
                                                        data: shellString,
                                                        path: tempShellOutputPath,
                                                    })
                                                ' '--' '/Users/jeffhykin/repos/NeuroSLAM/virkshop/support/virkshop.js' '/Users/jeffhykin/repos/NeuroSLAM/virkshop/temporary.ignore/short_term/event_evals/05644355469244315.sh' 'nodejs.deno.js'
;
'.' '/Users/jeffhykin/repos/NeuroSLAM/virkshop/temporary.ignore/short_term/event_evals/05644355469244315.sh'