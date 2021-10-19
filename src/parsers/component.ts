import {ParserInterface} from "../interfaces/parser.interface";
import {ClassDeclaration, Decorator, PropertyAssignment, TypeGuards, Node} from "ts-morph";
import {BaseClass} from "./base-class";
import * as _ from 'lodash';

export class ComponentParser extends BaseClass implements ParserInterface {

    public readonly decorator = 'Component';

    selector: string = null;

    templateUrl: string = null;

    template: string = null;

    changeDetection: string = null;

    /**
     * @param entity
     */
    constructor(public entity: ClassDeclaration) {

        super(entity);

        this.init();
    }

    /**
     * Init the process
     */
    init(): void {

        super.init();

        this.name = this.entity.getName();

        if (this.entity.getExtends()) {
            this.extends = this.entity.getExtends().getText();
        }

        this.setMetaData();
    }

    /**
     * Set select, templateUrl etc
     */
    setMetaData(): void {

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
