import {BaseClass} from "./base-class";
import {ParserInterface} from "../interfaces/parser.interface";
import {ClassDeclaration} from "ts-morph";

export class GenericParser extends BaseClass implements ParserInterface {

    public readonly decorator = 'Generic';

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
    }
}
