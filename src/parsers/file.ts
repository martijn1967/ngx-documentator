import {ClassDeclaration, Decorator, SourceFile} from "ts-morph";
import {ModuleInterface} from "../interfaces/module.interface";
import {ParserInterface} from "../interfaces/parser.interface";
import {ComponentParser} from "./component";
import {ModuleParser} from "./module";
import {InjectableParser} from "./injectable";
import {PipeParser} from "./pipe";
import {GenericParser} from "./generic";
import * as _ from 'lodash';

export class FileParser implements ParserInterface {

    modules: ModuleInterface[] = [];

    components: any[] = [];

    injectables: any[] = [];

    directives: any[] = [];

    pipes: any[] = [];

    interfaces: any[] = [];

    generics: any[] = [];

    /**
     * Possible angular class type decorators
     */
    classTypes = ['Component', 'NgModule', 'Pipe', 'Injectable', 'State'];

    /**
     * Public constructor
     */
    constructor(public sourceFile: SourceFile) {

        console.dir('Parsing: ' + sourceFile.getBaseName());
        this.init();
    }

    /**
     * Init the process
     */
    init(): void {

        this.extractClasses();
    }

    /**
     * Collect the properties for the documentation tool
     */
    getProperties(): object {

        const properties = {};

        for (let [key, value] of Object.entries(this)) {

            if (key === 'sourceFile') {
                continue;
            }

            Object.defineProperty(properties, key, {
                enumerable: true,
                value
            });
        }

        return properties;
    }

    /**
     * Extract all classes from file. It supposed to be a single class, but you will never know
     * @private
     */
    private extractClasses(): void {

        const classes = this.sourceFile.getClasses();

        if (Array.isArray(classes)) {

            classes.forEach((entity: ClassDeclaration) => {

                const properties = this.parseClass(this.findType(entity), entity);
                const decorator = _.get(properties, 'decorator', 'Generic');
                const key = decorator.toLowerCase() + 's';

                if (this.hasOwnProperty(key) && Array.isArray(_.get(this, key, null))) {
                    // @ts-ignore
                    this[key].push(properties);
                }
            });
        }
    }

    /**
     *
     * @param type Class type
     * @param entity
     * @private
     */
    private parseClass(type: string, entity: ClassDeclaration): object {

        let parser;

        switch (type) {

            case 'NgModule' : {
                parser = new ModuleParser(entity);
                break;
            }

            case 'Component' : {

                parser = new ComponentParser(entity);
                break;
            }

            case 'Pipe' : {

                parser = new PipeParser(entity);
                break;
            }

            case 'Injectable' : {

                parser = new InjectableParser(entity);
                break;
            }

            case 'State' : {

                break;
            }

            default : {
                parser = new GenericParser(entity);
            }
        }

        return parser.getProperties();
    }

    /**
     * Try to figure out what angular type it 's
     * @param entity
     */
    findType(entity: ClassDeclaration): string {

        const decorators = entity.getDecorators();
        let type = 'generic';

        if (Array.isArray(decorators)) {

            decorators.forEach((decorator: Decorator) => {

                if (this.classTypes.indexOf(decorator.getName()) !== -1) {

                    type = decorator.getName();

                    return;
                }
            });
        }

        return type;
    }
}
