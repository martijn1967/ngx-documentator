import {ParserInterface} from "../interfaces/parser.interface";
import {ClassDeclaration} from "ts-morph";
import {BaseClass} from "./base-class";

export class PipeParser extends BaseClass implements ParserInterface {

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
    }
}
