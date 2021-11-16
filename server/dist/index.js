"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Printer_1 = require("./models/Printer");
const { ApolloServer, ApolloError, ValidationError, gql } = require('apollo-server');
// The GraphQL schema
const typeDefs = gql `
    type Query {
        "A simple type for getting started!"
        printers: [Printer]!
        printer(id: ID!): Printer!
    }
    type Mutation {
        addPrinter(name: String!, ipAddress: String!, isActive: Boolean!): Printer!
        updatePrinter(id: String!, newData: PrinterUpdate!): Printer!
        deletePrinter(id: String!): Printer
    }

    type Printer {
        id: ID!
        name: String!
        ipAddress: String!
        isActive: Boolean!
    }

    input PrinterUpdate {
        id: ID
        name: String
        ipAddress: String
        isActive: Boolean
    }
`;
// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        printers() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var con = yield getConnetion();
                    const Printers = yield con.manager.find(Printer_1.Printer);
                    return Printers;
                }
                catch (error) {
                    throw new ApolloError(error);
                }
            });
        },
        printer(_, args) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var con = yield getConnetion();
                    const printerRepository = con.getRepository(Printer_1.Printer);
                    const printerFound = yield printerRepository.findOne(args.id);
                    return printerFound || new ValidationError('Printer ID not found');
                }
                catch (error) {
                    throw new ApolloError(error);
                }
            });
        },
    },
    Mutation: {
        addPrinter: (_, { name, ipAddress, isActive }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("got addPrinter data", { name, ipAddress, isActive });
            let printerTp = new Printer_1.Printer();
            printerTp.name = name;
            printerTp.ipAddress = ipAddress;
            printerTp.isActive = isActive;
            const con = yield getConnetion();
            const newPrinter = yield con.manager.save(printerTp);
            return newPrinter;
            // const user = await dataSources.userAPI.findOrCreateUser({ email });
            // if (user) {
            //     user.token = Buffer.from(email).toString('base64');
            //     return user;
            // }
        }),
        updatePrinter: (_, { id, newData }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("got update printer data", { id, newData });
            const { name, ipAddress, isActive } = newData;
            const con = yield getConnetion();
            const printerRepository = con.getRepository(Printer_1.Printer);
            const printerFound = yield printerRepository.findOne(id);
            if (printerFound == null)
                return new ValidationError('Printer ID not found');
            //validate and ignore null...
            printerFound.name = name;
            printerFound.ipAddress = ipAddress;
            printerFound.isActive = isActive;
            const newPrinter = yield printerRepository.save(printerFound);
            return newPrinter;
        }),
        deletePrinter: (_, { id }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("got delete printer of id", id);
            const con = yield getConnetion();
            const printerRepository = con.getRepository(Printer_1.Printer);
            const printerFound = yield printerRepository.findOne(id);
            if (printerFound == null)
                return new ValidationError('Printer ID not found');
            yield printerRepository.remove(printerFound);
            console.log("got delete printer: returning", printerFound);
            return null;
        }),
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
let connection;
function getConnetion() {
    return __awaiter(this, void 0, void 0, function* () {
        if (connection != undefined)
            return connection;
        return new Promise((resolve, reject) => {
            typeorm_1.createConnection().then((gotConnection) => __awaiter(this, void 0, void 0, function* () {
                // here you can start to work with your entities
                connection = gotConnection;
                resolve(connection);
            })).catch(error => reject(error));
        });
    });
}
/*

createConnection(
    // {
    //     type: "mysql",
    //     host: "localhost",
    //     port: 3306,
    //     username: "root",
    //     password: "",
    //     database: "rz_printer_management",
    //     entities: [
    //         Printer
    //     ],
    //     synchronize: true,
    //     logging: false
    // }
).then(async connection => {
    // here you can start to work with your entities

    //store
    let printer1 = new Printer();
    printer1.name = "Lekker printer";
    printer1.isActive = false;
    printer1.ipAddress = "127.0.0.1";

    await connection.manager.save(printer1);
    console.log("Printer has been saved");

    //retrieve
    let savedPhotos = await connection.manager.find(Printer);
    console.log("All photos from the db: ", savedPhotos);

}).catch(error => console.log(error));


createConnection().then(async connection => {
    // here you can start to work with your entities

}).catch(error => console.log(error));
*/ 
//# sourceMappingURL=index.js.map