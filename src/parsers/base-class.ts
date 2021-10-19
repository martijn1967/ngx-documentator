import {
    ClassDeclaration, ExpressionWithTypeArguments, GetAccessorDeclaration, MethodDeclaration, PropertyDeclaration
} from "ts-morph";
import {MethodParser} from "./method";
import {PropertyParser} from "./property";
import * as _ from 'lodash';

export abstract class BaseClass {

    name: string = null;

    extends: string = null;

    implementations: string [] = [];

    properties: any[] = [];

    methods: any[] = [];

    accessors: any[] = [];

    /**
     * Abstract constructor
     */
    constructor(public entity: ClassDeclaration) {
    }

    /**
     * Init the process, do not use for extracting modules
     */
    init(): void {

        this.setImplements();
        this.setMethods();
        this.setProperties();
        this.setAccessors();
    }

    /**
     * Set implementations
     */
    setImplements(): void {

        this.entity.getImplements().forEach((i: ExpressionWithTypeArguments) => {
            this.implementations.push(i.getText());
        });
    }

    /**
     * Extract methods
     */
    setMethods(): void {

        this.entity.getMethods().forEach((method: MethodDeclaration) => {

            const properties = (new MethodParser(method)).getProperties();
            this.methods.push(properties);
        });
    }

    /**
     * Extract properties
     */
    setProperties(): void {

        this.entity.getProperties().forEach((property: PropertyDeclaration) => {

            const properties = (new PropertyParser(property)).getProperties();
            this.properties.push(properties);
        });
    }

    /**
     * Extract accessors
     */
    setAccessors(): void {

        this.entity.getGetAccessors().forEach((accessor: GetAccessorDeclaration) => {

            let type = accessor.getReturnType().getText();
            const regExp = /^import*/i;

            if (type.match(regExp)) {
                type = _.last(type.split('.'));
            }

            this.accessors.push({
                name: accessor.getName(),
                returnType: type
            });
        });
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
