import {Collector} from './files/collector';
import {ProjectParser} from "./parsers/project";
import {SourceFile} from "ts-morph";

const path = '/Users/developer/projects/lama/src/app';

const collector = new Collector(path);
const sourceFiles = collector.create();
const project = new ProjectParser();

project.appendProjectFiles(sourceFiles).then(() => {

    const files = project.getSourceFiles();

    files.forEach((file: SourceFile) => {

        project.parse(file).then(() => {
          //  console.dir(file.getBaseNameWithoutExtension() + ' processed');
        });
    });

});
