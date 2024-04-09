import {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
  QueryCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  DescribeTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

const s3config = {
  forcePathStyle: true,
  region: "us-east-1",
};

const snsConfig = {
  forcePathStyle: true,
  region: "us-east-1",
};

const dynamoDBConfig = {
  forcePathStyle: true,
  region: "us-east-1",
};

const isLocal = process.env.IS_OFFLINE;

if (isLocal) {
  const host = process.env.LOCALSTACK_HOST || "localhost";
  s3config.endpoint = `http://${host}:4566`;
  snsConfig.endpoint = `http://${host}:4566`;
  dynamoDBConfig.endpoint = `http://${host}:4566`;
}

const s3Client = new S3Client(s3config);
const S3 = {
  /** @param {ListBucketsCommandInput} args */
  listBuckets: (args) => {
    return s3Client.send(new ListBucketsCommand(args));
  },
  createBucket: (args) => {
    return s3Client.send(new CreateBucketCommand(args));
  },

  deleteBucket: (args) => {
    return s3Client.send(new DeleteBucketCommand(args));
  },
};

const snsClient = new SNSClient(snsConfig);
const SNS = {
  /** @param {PublishCommand} args */
  publish: (args) => {
    return snsClient.send(new PublishCommand(args));
  },
};

const dynamoDBClient = new DynamoDBClient(dynamoDBConfig);

const DynamoDB = {
  /** @param {CreateTableCommand} args */
  createTable: async (args) => {
    const data = await dynamoDBClient.send(new ListTablesCommand({}));
    const existsTable = data.TableNames.includes(args.TableName);

    if (!existsTable) {
      return dynamoDBClient.send(new CreateTableCommand(args));
    }
  },
  /** @param {DeleteTableCommand} args */
  deleteTable: (args) => {
    return dynamoDBClient.send(new DeleteTableCommand(args));
  },
  /** @param {PutItemCommand} args */
  putItem: async (args) => {
    if (process.env.IS_OFFLINE) {
      try {
        await dynamoDBClient.send(
          new DescribeTableCommand({ TableName: args.TableName })
        );
      } catch (error) {
        if (error.name === "ResourceNotFoundException") {
          const params = {
            TableName: args.TableName,
            KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
            AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5,
            },
          };
          await DynamoDB.createTable(params);
        } else {
          throw error;
        }
      }
    }
    return dynamoDBClient.send(new PutItemCommand(args));
  },
  /** @param {GetItemCommand} args */
  getItem: (args) => {
    return dynamoDBClient.send(new GetItemCommand(args));
  },
  /** @param {ScanCommand} args */
  scan: (args) => {
    return dynamoDBClient.send(new ScanCommand(args));
  },
  /** @param {QueryCommand} args */
  query: (args) => {
    return dynamoDBClient.send(new QueryCommand(args));
  },
  /** @param {UpdateItemCommand} args */
  updateItem: (args) => {
    return dynamoDBClient.send(new UpdateItemCommand(args));
  },
  /** @param {DeleteItemCommand} args */
  deleteItem: (args) => {
    return dynamoDBClient.send(new DeleteItemCommand(args));
  },
};

export { S3, SNS, DynamoDB };
