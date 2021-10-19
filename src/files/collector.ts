import * as path from 'path';
import * as fs from 'fs';

export class Collector {

    /**
     * Directory that serves as a starting point for searching for files, which are included
     * in the documentation process
     */
    public rootPath: string;

    /**
     * Files to be processed for documentation
     * @private
     */
    private _files: string[] = [];

    /**
     * Directories or files not to be included in the process. Like unit test etc.
     */
    public excluded: string[] = [];

    /**
     * Public construcot
     */
    constructor(path: string) {

        if (fs.existsSync(path) !== true) {
            throw new Error('Root path not found');
        }

        this.rootPath = path;
    }

    /**
     * Create the collection of files
     */
    create(): string[] {

        this._fetch(this.rootPath);
        return this._files;
    }

    /**
     * Fetch files to be processed
     * @param directory
     * @private
     */
    private _fetch(directory: string): void {

        const files = fs.readdirSync(directory);

        files.forEach((file: string) => {

            if (fs.statSync(directory + "/" + file).isDirectory()) {

                if (this.excluded.indexOf(directory) === -1) {
                    this._fetch(directory + "/" + file);
                }

            } else if (file.indexOf('spec.ts') === -1 && file.indexOf('.html') === -1 && file.indexOf('package.ts') === -1) {

                this._files.push(path.join(directory, "/", file));
            }
        });
    }

    /**
     * Public accessor for private variable
     */
    get files(): string[] {
        return this._files;
    }
}
