import {BaseClass} from "./base-class";
import {ParserInterface} from "../interfaces/parser.interface";
import {ClassDeclaration, Decorator, Node, PropertyAssignment, TypeGuards} from "ts-morph";
import * as _ from "lodash";

export class ModuleParser extends BaseClass implements ParserInterface {

    public readonly decorator = 'Module';

    imports: string[] = [];

    declarations: string [] = [];

    exports: string[] = [];

    providers: string[] = [];

    /**
     * @param entity
     */
    constructor(entity: ClassDeclaration) {
        super(entity);

        this.init();
    }

    /**
     * Init the process
     */
    init(): void {

        this.name = this.entity.getName();

        if (this.entity.getExtends()) {
            this.extends = this.entity.getExtends().getText();
        }

        this.removeProperties();
        this.setMetaData();
    }

    /**
     * Remove none applicable properties
     * @private
     */
    private removeProperties(): void {

        const properties = ['implementations', 'properties', 'methods', 'accessors'];

        properties.forEach((property: string) => {

            if (this.hasOwnProperty(property)) {
                // @ts-ignore
                delete this[property];
            }
        });
    }

    /**
     * Extract the metadata from the module
     * @private
     */
    private setMetaData(): void {

        this.entity.getDecorators().forEach((decorator: Decorator) => {

            decorator.getArguments().forEach((argument: Node) => {

                if (TypeGuards.isObjectLiteralExpression(argument)) {

                    for (const prop of argument.getProperties()) {

                        const property = prop as PropertyAssignment;
                        const key = property.getName();

                        if (this.hasOwnProperty(key)) {

                            const value = property.getInitializerOrThrow().getText();
                            _.set(this, key, value.replaceAll('\'', ''));
                        }
                    }
                }
            });
        });
    }
}
