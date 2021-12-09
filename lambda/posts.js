const { DynamoDB } = require('aws-sdk');
const { v1 } = require('uuid');

const db = new DynamoDB.DocumentClient({
    convertEmptyValues: true,
    apiVersion: '2012-10-08'
});

exports.create = async (event) => {
    try {
        const postId = v1();
        const data = JSON.parse(event.body);
        const item = { postId, ...data };

        await db.put({
            TableName: process.env.POST_TABLE,
            Item: item,
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(item),
        };
    } catch (e) {
        console.log(`[Error] ${e.message}`);
        return {
            statusCode: 500,
        };
    }
};

exports.get = async (event) => {
    try {
        const { postId } = event.pathParameters;
        const {
            Item: item = [],
        } = await db.get({
            TableName: process.env.POST_TABLE,
            Key: { postId },
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(item),
        };
    } catch (e) {
        console.log(`[Error] ${e.message}`);
        return {
            statusCode: 500,
        };
    }
};