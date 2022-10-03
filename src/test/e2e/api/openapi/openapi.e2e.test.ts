import { setupApp } from '../../helpers/test-helper';
import dbInit from '../../helpers/database-init';
import getLogger from '../../../fixtures/no-logger';
import SwaggerParser from '@apidevtools/swagger-parser';
import enforcer from 'openapi-enforcer';
import semver from 'semver';

let app;
let db;

beforeAll(async () => {
    db = await dbInit('openapi', getLogger);
    app = await setupApp(db.stores);
});

afterAll(async () => {
    await app.destroy();
    await db.destroy();
});

test('should serve the OpenAPI UI', async () => {
    return app.request
        .get('/docs/openapi/')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect((res) => expect(res.text).toMatchSnapshot());
});

test('should serve the OpenAPI spec', async () => {
    return app.request
        .get('/docs/openapi.json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            // Don't use the version field in snapshot tests. Having the version
            // listed in automated testing causes issues when trying to deploy
            // new versions of the API (due to mismatch between new tag versions etc).
            delete res.body.info.version;

            // This test will fail whenever there's a change to the API spec.
            // If the change is intended, update the snapshot with `jest -u`.
            expect(res.body).toMatchSnapshot();
        });
});

test('should serve the OpenAPI spec with a `version` property', async () => {
    return app.request
        .get('/docs/openapi.json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            const { version } = res.body.info;
            // ensure there's no whitespace or leading `v`
            expect(semver.clean(version)).toStrictEqual(version);

            // ensure the version listed is valid semver
            expect(semver.parse(version, { loose: false })).toBeTruthy();
        });
});

test('the generated OpenAPI spec is valid', async () => {
    const { body } = await app.request
        .get('/docs/openapi.json')
        .expect('Content-Type', /json/)
        .expect(200);

    // this throws if the swagger parser can't parse it correctly
    // also parses examples, but _does_ do some string coercion in examples
    try {
        await SwaggerParser.validate(body);
    } catch (err) {
        console.error(err);
        // there's an error here, so let's exit after showing it in the console.
        expect(true).toBe(false);
    }

    const [, enforcerError, enforcerWarning] = await enforcer(body, {
        fullResult: true,
        componentOptions: {
            exceptionSkipCodes: [
                // allow non-standard formats for strings (including 'uri')
                'WSCH001',

                // Schemas with an indeterminable type cannot serialize,
                // deserialize, or validate values. [WSCH005]
                //
                // This allows specifying the 'any' type for schemas (such as the
                // patchSchema)
                'WSCH005',
            ],
        },
    });

    if (enforcerWarning !== undefined) {
        console.warn(enforcerWarning);
    }
    if (enforcerError !== undefined) {
        console.error(enforcerError);
    }

    expect(enforcerWarning ?? enforcerError).toBe(undefined);
});

test('all tags are listed in the root "tags" list', async () => {
    const { body: spec } = await app.request
        .get('/docs/openapi.json')
        .expect('Content-Type', /json/)
        .expect(200);

    const rootLevelTagNames = new Set(spec.tags.map((tag) => tag.name));

    let invalidTags = {};
    for (const path of Object.values(spec.paths)) {
        for (const operation of Object.values(path)) {
            // ensure that the list of tags for every operation is a subset of
            // the list of tags defined on the root level
            // const operationTags = new Set(operation.tags);

            for (const tag in operation.tags) {
                if (rootLevelTagNames.has(tag)) {
                    invalidTags = {
                        ...invalidTags,
                        [path]: {
                            ...invalidTags[path],
                            [operation]: [],
                        },
                    };
                }
            }
            if (!operationTags.su)
                expect(rootLevelTagNames).toEqual(
                    expect.arrayContaining(operation.tags),
                );

            // todo: make this logging a bit friendlier
        }
    }
});
