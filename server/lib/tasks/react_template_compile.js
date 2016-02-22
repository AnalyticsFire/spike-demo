'use strict';
// through2 is a thin wrapper around node transform streams
import through from 'through2';
import gutil from 'gulp-util';
import rt from 'react-templates';
import path from 'path';
import extend from 'extend';

// Consts
const PLUGIN_NAME = 'gulp-react-templates';
var PluginError = gutil.PluginError;

function normalizeName(name) {
    return name.replace(/-/g, '_');
}

export default function (opt) {
    function replaceExtension(filePath) {
        return filePath + '.js';
    }

    function transform(file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        var filePath = file.path,
          str = file.contents.toString('utf8'),
          data;

        var options = extend({
            filename: file.path,
            sourceFiles: [file.relative],
            generatedFile: replaceExtension(file.relative)
        }, opt);

        if (options.suffix && !options.name) {
            options.name = normalizeName(path.basename(filePath, path.extname(filePath))) + options.suffix;
        }

        try {
            data = rt.convertTemplateToReact(str, options);
        } catch (err) {
            return cb(new PluginError(PLUGIN_NAME, err));
        }

        file.contents = new Buffer(data);

        file.path = replaceExtension(file.path);
        cb(null, file);
    }

    return through.obj(transform);
};
