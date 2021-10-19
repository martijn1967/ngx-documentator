import {ParserInterface} from "../interfaces/parser.interface";
import {JSDoc, MethodDeclaration, ParameterDeclaration, Node} from "ts-morph";
import * as _ from 'lodash';

export class MethodParser implements ParserInterface {

    /**
     * Method name
     */
    name: string = '';

    /**
     * Comments
     */
    description: string = '';

    /**
     * Return type
     */
    returnType: string = '';

    /**
     * Function arguments
     */
    parameters: any[] = [];

    /**
     * Method modifiers (public etc)
     */
    modifiers: string[] = [];

    /**
     * Function is async
     */
    isAsync: boolean = false;

    /**
     * @param entity
     */
    constructor(public entity: MethodDeclaration) {
        this.init();
    }

    /**
     * Init the process
     */
    init(): void {

        this.name = this.entity.getName();
        this.returnType = this.entity.getReturnType().getText(this.entity);

        this.entity.getJsDocs().forEach((doc: JSDoc) => {
            this.description = doc.getDescription().trim();
        });

        this.entity.getParameters().forEach((parameter: ParameterDeclaration) => {

            this.parameters.push({
                name: parameter.getName(),
                type: parameter.getType().getText(parameter),
                optional: parameter.isOptional(),
            });
        });

        this.entity.getModifiers().forEach((node: Node) => {
            this.modifiers.push(node.getText());
        });

        this.isAsync = this.entity.isAsync();
    }

    /**
     * Collect the properties for the documentation tool
     */
    getProperties(): object {

        const properties = {};

        for (let [key, value] of Object.entries(this)) {

            if (key === 'entity') {
                continue;
            }

            Object.defineProperty(properties, key, {
                enumerable: true,
                value
            });
        }

        return properties;
    }
}
