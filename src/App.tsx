import { useRef, useEffect } from "react";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";

// @ts-ignore
import BpmnModeler7 from "camunda-bpmn-js/lib/camunda-platform/Modeler";

// @ts-ignore
import BpmnModeler8 from "camunda-bpmn-js/lib/camunda-cloud/Modeler";

import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    ZeebePropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule,
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
    ElementTemplatesPropertiesProviderModule,
    // @ts-ignore
} from "bpmn-js-element-templates";
import {
    CreateAppendAnythingModule,
    CreateAppendElementTemplatesModule,
    // @ts-ignore
} from "bpmn-js-create-append-anything";
import elementTemplates7 from "./templates7.json";
import "./App.css";

const isCamunda8 = process.env.REACT_APP_CAMUNDA_VERSION === "8";
const BpmnModeler = isCamunda8 ? BpmnModeler8 : BpmnModeler7;
const additionalModules = [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    ElementTemplateChooserModule,
    ElementTemplatesIconsRenderer,
    LintingModule,
    CreateAppendAnythingModule, // only partially works with Camunda 7
    CreateAppendElementTemplatesModule, // only partially works with Camunda 7

    ...(isCamunda8
        ? [
              ZeebeBehaviorsModule,
              ZeebePropertiesProviderModule,
              CloudElementTemplatesPropertiesProviderModule,
          ]
        : [
              CamundaPlatformPropertiesProviderModule,
              ElementTemplatesPropertiesProviderModule,
          ]),
];

const elementTemplates = isCamunda8
    ? elementTemplates7.map((t) => ({
          ...t,
          $schema:
              "https://unpkg.com/@camunda/zeebe-element-templates-json-schema/resources/schema.json",
      }))
    : elementTemplates7;

const moddleExtensions = isCamunda8 ? { zeebe: ZeebeModdle } : undefined;

function App() {
    const modeler = useRef<BpmnModeler7 | BpmnModeler8>();
    const editor = useRef<any>();
    const properties = useRef<any>();

    useEffect(() => {
        if (modeler.current || !editor.current || !properties.current) return;

        modeler.current = new BpmnModeler({
            container: editor.current,
            linting: {
                active: true,
            },
            keyboard: {
                bindTo: document,
            },
            propertiesPanel: {
                parent: properties.current,
            },

            additionalModules,
            moddleExtensions,
            elementTemplates,
        });

        modeler.current.createDiagram();
    });

    return (
        <div className="app">
            <div ref={editor} className="editor" />
            <div ref={properties} className="properties" />
        </div>
    );
}

export default App;
