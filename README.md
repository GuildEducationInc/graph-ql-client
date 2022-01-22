# GraphQL Client
## Description
A tool for creating a graphql client to makes queries and process responses.

## Contributing
The npm package is deployed from the root level of the repo. Therefore, to publish a new version to npm, it's as easy as running:
```bash
npm version (feature | patch | minor)
npm release
```

## Installation
To install, run:
```bash
yarn add @guildeducationinc/graph-ql-client --dev
```

## Usage
The graph-ql-client can be used as a node module. You would need to have the correct environment variables set for the environment in question and invoke it via the node runtime.

A basic program that creates the client would look like the following:
```js
const compareGraphQlQueryResponse = require('@guildeducationinc/graph-ql-client')
class TestFailure extends Error {}

module.exports.run = async () => {
    const query = `
    mutation GenerateYearEndReport{
        funding_generateYearEndReport(
            input: {
                employerId: "6637b2af-eceb-4de9-8789-82e5b8b36200",
                type: EMPLOYEE,
                start: "2021-01-01",
                end: "2021-12-31",
            }
        ) {
            reportUrl
        }
    }
    `;
    const expectedResponse = `
    {
        "funding_generateYearEndReport": {
                "reportUrl": "[{\\"guildUuid\\":\\"2b52c459-ad19-4518-abf5-94ab165e6703\\",\\"externalId\\":\\"7yznm8p4y\\",\\"firstName\\":\\"Joseph\\",\\"lastName\\":\\"Patton\\",\\"roles\\":[\\"learner\\"],\\"archivedUserFound\\":false,\\"archivedUserIds\\":[],\\"userEmployers\\":[{\\"primary\\":true,\\"dependent\\":false,\\"entityId\\":null,\\"employeeId\\":\\"0216145\\",\\"verifiedOn\\":\\"2018-12-11T02:09:19Z\\",\\"employerUuid\\":\\"e7ae4770-6cf4-45c3-b489-697d7bf0eb2c\\"}],\\"userInstitutions\\":[{\\"studentId\\":\\"21257481\\",\\"verifiedOn\\":\\"2020-08-27T22:59:41Z\\",\\"institutionUuid\\":\\"f677f57f-5070-4edd-942b-a5140b96e4d4\\"}],\\"contactStrategies\\":[{\\"value\\":\\"+14582265608\\",\\"contactType\\":1},{\\"value\\":\\"jpatton323@gmail.com\\",\\"contactType\\":0}]},{\\"guildUuid\\":\\"7029083f-f162-45d7-80b1-93fd20a6f931\\",\\"externalId\\":\\"dywn74rdg\\",\\"firstName\\":\\"Fae\\",\\"lastName\\":\\"Dagonese\\",\\"roles\\":[\\"learner\\"],\\"archivedUserFound\\":false,\\"archivedUserIds\\":[],\\"userEmployers\\":[{\\"primary\\":true,\\"dependent\\":false,\\"entityId\\":null,\\"employeeId\\":\\"heyfae\\",\\"verifiedOn\\":\\"2020-04-03T13:25:01Z\\",\\"employerUuid\\":\\"177b508a-0ec5-4a12-89bb-ebf85e037b4f\\"},{\\"primary\\":true,\\"dependent\\":false,\\"entityId\\":null,\\"employeeId\\":\\"faesotherid\\",\\"verifiedOn\\":\\"2020-04-03T13:25:42Z\\",\\"employerUuid\\":\\"72b56457-4324-4ca3-89d3-a280f332f826\\"}],\\"userInstitutions\\":[{\\"studentId\\":\\"anotherstudentid\\",\\"verifiedOn\\":\\"2021-03-12T20:27:41Z\\",\\"institutionUuid\\":\\"e7ae4770-6cf4-45c3-b489-697d7bf0eb2c\\"}],\\"contactStrategies\\":null}]"
        }
    }
    `;
    let responseCompare;
    try {
        responseCompare = await compareGraphQlQueryResponse(query, expectedResponse)
    } catch (error) {
        throw new TestFailure(`generateYearEndReport raised the following error: ${error}.`)
    }
    if (responseCompare) {
        return `generateYearEndReport Succeeded.`;
    }
    else {
        throw new TestFailure(`Expected query response does not match expected response; generateYearEndReport Failed.`);
    }
}
```