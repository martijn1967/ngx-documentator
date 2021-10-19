import {ParserInterface} from "../interfaces/parser.interface";
import {Decorator, PropertyDeclaration, Node, JSDoc} from "ts-morph";

export class PropertyParser implements ParserInterface {

    /**
     * property name
     */
    name: string = null;

    /**
     * Decorators (Input, Output etc)
     */
    decorators: string[] = [];

    /**
     * Property modifier (public etc.)
     */
    modifiers: string[] = [];

    /**
     * Type guard
     */
    guard: string = null;

    /**
     * Comment
     */
    description: string = null;

    /**
     * @param entity
     */
    constructor(public entity: PropertyDeclaration) {
        this.init();
    }

    /**
     * Init the process
     */
    init(): void {

        this.name = this.entity.getName();

        this.entity.getJsDocs().forEach((doc: JSDoc) => {
            this.description = doc.getDescription().trim();
        });

        this.entity.getDecorators().forEach((decorator: Decorator) => {
            this.decorators.push(decorator.getName());
        });

        this.setTypeGuard();
    }

    /**
     * Extract the type guard from the property
     */
    setTypeGuard(): void {

        this.guard = (this.entity.getTypeNode() || this.entity.getType()).getText(this.entity);
        /**
         * @todo
         */
        // { pdf: import("/Users/developer/projects/lama/node_modules/@fortawesome/fontawesome-common-types/index").IconDefinition; }
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
