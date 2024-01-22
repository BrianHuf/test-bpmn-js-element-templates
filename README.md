# Minimal app using bpmn-js-element-templates

Attempt is to reproduce test app [should import simple process (cloud-templates)](https://github.com/bpmn-io/bpmn-js-element-templates/blob/ce81139dce1af6cc95647e27b8caa558700cd7ed/test/spec/Example.spec.js#L170)

To test
```
npm i
npm start
```

At present the app returns an error when calling `new BpmnModeler`

```
react-dom.development.js:22839 Uncaught Error: overriding handler for command <propertiesPanel.removeTemplate>
    at CommandStack._setHandler (CommandStack.js:551:1)
    at CommandStack.register (CommandStack.js:313:1)
    at CommandStack.registerHandler (CommandStack.js:331:1)
    at registerHandlers$1 (index.js:10:1)
    at Injector.invoke (index.esm.js:226:1)
    at index.esm.js:326:1
    at Array.forEach (<anonymous>)
    at index.esm.js:320:1
    at index.esm.js:440:1
    at Array.forEach (<anonymous>)
```