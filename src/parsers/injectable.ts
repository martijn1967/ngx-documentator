import {BaseClass} from "./base-class";
import {ParserInterface} from "../interfaces/parser.interface";
import {ClassDeclaration, Decorator, Node, PropertyAssignment, TypeGuards} from "ts-morph";
import * as _ from "lodash";

export class InjectableParser extends BaseClass implements ParserInterface {

    public readonly decorator = 'Injectable';

    providedIn: string = null;

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
