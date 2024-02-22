import { pbjs, pbts } from 'protobufjs-cli';
import { promises } from 'fs';
import { join, parse } from 'path';
import { options } from 'yargs';
import { asyncMap } from '@tsigel/async-map';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { info, error } from './src/utils/log';


const { out, path } = options({
    out: {
        required: true,
        alias: 'o',
        type: 'string'
    },
    path: {
        required: true,
        alias: 'p',
        type: 'string'
    }
}).parseSync();

const exists = existsSync(out);

const launch = exists ? Promise.resolve() : mkdir(out);

const compileProtoFile = (filePath: string) => {
    info(`Compile proto file with path ${filePath}`);
    const { dir, name } = parse(filePath);
    return new Promise((res, rej) => {
            pbjs.main([
                '--no-create',
                '--no-verify',
                '--no-convert',
                '--keep-case',
                '--force-long',
                '-p', join(__dirname, path),
                '-r', name,
                '-t', 'static-module',
                '-w', 'commonjs',
                '-o', join(__dirname, out, `${name}.js`),
                join(dir, `${name}.proto`)
            ], (err, data) => {
                if (err) {
                    error('Proto compile', name, 'error\n', err);
                    rej(err);
                } else {
                    info('Proto compile', name, 'done');
                    res(data);
                }
            });
        }
    ).then(() => new Promise((res, rej) => {
        pbts.main([
            '-o',
            join(out, `${name}.d.ts`),
            join(out, `${name}.js`)
        ], (err, data) => {
            if (err) {
                error('Proto dts compile', name, 'error\n', err);
                rej(err);
            } else {
                info('Proto dts compile', name, 'done');
                res(data);
            }
        });
    }));
};

const compileDir = (path: string): Promise<unknown> =>
    promises.readdir(path)
        .then(files =>
            asyncMap(3, (name: string) =>
                promises.stat(join(path, name))
                    .then((stat) => ({ name, isDir: stat.isDirectory() })), files))
        .then((list) =>
            asyncMap<{ name: string, isDir: boolean }, unknown>(3, ({ name, isDir }) =>
                    isDir
                        ? compileDir(join(path, name))
                        : compileProtoFile(join(path, name)),
                list)
        );

launch
    .then(() => compileDir(join(__dirname, path)))
    .then(() => info(`All is done!`));
