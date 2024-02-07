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
    ElementTemplate,
    // @ts-ignore
} from "bpmn-js-element-templates";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
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
    CreateAppendAnythingModule, // 'mostly' works with Camunda 7
    CreateAppendElementTemplatesModule, // 'mostly' works with Camunda 7

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

const elementTemplateIconRenderer = {
    iconProperty: isCamunda8 ? undefined : "camunda:modelerTemplateIcon",
};

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
            elementTemplateIconRenderer,
        });

        if (!isCamunda8) {
            // inspired from https://github.com/bpmn-io/bpmn-js-element-templates/blob/4f13f75ac397274c48892748449d9a883d68ccde/src/provider/cloud-element-templates/create/TemplateElementFactory.js#L46
            const elementFactory = modeler.current.get<any>("elementFactory");

            modeler.current.get<any>("elementTemplates").createElement = (
                template: ElementTemplate
            ) => {    
                const { appliesTo, id, icon } = template;
                const type = appliesTo[0];
                
                const element = elementFactory.createShape({ type });
                const businessObject = getBusinessObject(element);

                businessObject.set("camunda:modelerTemplate", id);
                businessObject.set("camunda:modelerTemplateIcon", icon.contents);

                return element;
            };
        }

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
