import {Project, SourceFile} from "ts-morph";
import {FileParser} from "./file";
import {ModuleInterface} from "../interfaces/module.interface";

export class ProjectParser extends Project {

    modules: ModuleInterface[] = [];

    components: any[] = [];

    services: any[] = [];

    directives: any[] = [];

    pipes: any[] = [];

    interfaces: any[] = [];

    generic: any[] = [];

    /**
     * Public constructor
     */
    constructor() {
        super();
    }

    /**
     * Append files to the current project
     * @param files
     */
    async appendProjectFiles(files: string[]): Promise<void> {

        return new Promise((resolve, reject) => {

            if (Array.isArray(files)) {

                files.forEach((path: string) => {
                    this.addSourceFileAtPathIfExists(path);
                });

                resolve();

            } else {
                reject();
            }
        });
    }

    /**
     * Parse the source file (It can contain multple classes, interfaces etc)
     * @param file
     */
    async parse(file: SourceFile): Promise<void> {

        return new Promise(((resolve, reject) => {

            const fileParser = new FileParser(file);

            resolve();
        }));
    }
}
