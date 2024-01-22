import { useRef, useEffect } from "react";
import "./App.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";

// @ts-ignore
import BpmnModeler from "camunda-bpmn-js/lib/camunda-platform/Modeler";

import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    ZeebePropertiesProviderModule,
    // @ts-ignore
} from "bpmn-js-properties-panel";
// @ts-ignore
import ZeebeModdle from "zeebe-bpmn-moddle/resources/zeebe";
// @ts-ignore
import ZeebeBehaviorsModule from "camunda-bpmn-js-behaviors/lib/camunda-cloud";
// @ts-ignore
import ElementTemplateChooserModule from "@bpmn-io/element-template-chooser";
// @ts-ignore
import ElementTemplatesIconsRenderer from "@bpmn-io/element-template-icon-renderer";
// @ts-ignore
import LintingModule from "@camunda/linting/modeler";
import {
    CloudElementTemplatesPropertiesProviderModule,
    // @ts-ignore
} from "bpmn-js-element-templates";
import elementTemplates from "./templates.json";

function App() {
    const modeler = useRef<BpmnModeler>();
    const editor = useRef<any>();
    const properties = useRef<any>();

    useEffect(() => {
        if (modeler.current || !editor.current || !properties.current) return;

        modeler.current = new BpmnModeler({
            container: editor.current,
            additionalModules: [
                ZeebeBehaviorsModule,
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
                ZeebePropertiesProviderModule,
                CloudElementTemplatesPropertiesProviderModule,
                ElementTemplateChooserModule,
                ElementTemplatesIconsRenderer,
                LintingModule,
            ],
            linting: {
                active: true,
            },
            keyboard: {
                bindTo: document,
            },
            moddleExtensions: {
                zeebe: ZeebeModdle,
            },
            propertiesPanel: {
                parent: properties.current,
            },
            elementTemplates,
        });

        modeler.current.createDiagram();
    });

    return (
        <table style={{ width: "100%", height: "100px" }}>
            <tbody>
                <tr>
                    <td
                        ref={editor}
                        style={{
                            height: "100px",
                            width: "80%",
                        }}
                    ></td>
                    <td ref={properties} style={{ height: "100px" }}></td>
                </tr>
            </tbody>
        </table>
    );
}

export default App;
