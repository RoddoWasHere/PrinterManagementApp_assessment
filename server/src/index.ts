import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { Printer } from "./models/Printer";
const { ApolloServer, ApolloError, ValidationError, gql } = require('apollo-server');



// The GraphQL schema
const typeDefs = gql`
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

interface IPrinterUpdate{
    id?: number
    name?: string
    ipAddress?: string
    isActive?: boolean
}

// A map of functions which return data for the schema.
const resolvers: any = {
    Query: {
        async printers(){
            try{
                var con = await getConnetion();
                const Printers = await con.manager.find(Printer);
                return Printers;
            }catch(error){
                throw new ApolloError(error);
            }
        },
        async printer(_: null, args: { id: string }){//id: number){
            try{
                var con = await getConnetion();
                const printerRepository = con.getRepository(Printer);
                const printerFound = await printerRepository.findOne(args.id);
                
                return printerFound || new ValidationError('Printer ID not found');
            }catch(error){
                throw new ApolloError(error);
            }
        },
    },
    Mutation: {
        addPrinter: async (_:null, { name, ipAddress, isActive }:any, { dataSources }:any) => {
            console.log("got addPrinter data",  { name, ipAddress, isActive });
            
            let printerTp = new Printer();
            printerTp.name = name;
            printerTp.ipAddress = ipAddress;
            printerTp.isActive = isActive;
            
            const con = await getConnetion();
        
            const newPrinter = await con.manager.save(printerTp);
            return newPrinter;
            // const user = await dataSources.userAPI.findOrCreateUser({ email });
            // if (user) {
            //     user.token = Buffer.from(email).toString('base64');
            //     return user;
            // }
        },
        updatePrinter: async (_:null, {id, newData}:any, { dataSources }:any) => {
            console.log("got update printer data", {id, newData});

            const { name, ipAddress, isActive } = newData;            
            
            const con = await getConnetion();

            const printerRepository = con.getRepository(Printer);
            const printerFound = await printerRepository.findOne(id);
            if(printerFound == null) return new ValidationError('Printer ID not found');

            //validate and ignore null...

            printerFound.name = name;
            printerFound.ipAddress = ipAddress;
            printerFound.isActive = isActive;

            const newPrinter = await printerRepository.save(printerFound);
            return newPrinter;
        },
        deletePrinter: async (_:null, { id }:any, { dataSources }:any) => {
            console.log("got delete printer of id", id);           
            
            const con = await getConnetion();

            const printerRepository = con.getRepository(Printer);
            const printerFound = await printerRepository.findOne(id);
            if(printerFound == null) return new ValidationError('Printer ID not found');

            await printerRepository.remove(printerFound);
            console.log("got delete printer: returning", printerFound); 
            return null;
        },
    }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }: any) => {
  console.log(`🚀 Server ready at ${url}`);
});


let connection: Connection;
async function getConnetion(){
    if(connection != undefined) return connection;
    return new Promise<Connection>((resolve, reject)=>{
        createConnection().then(async gotConnection => {
            // here you can start to work with your entities
            connection = gotConnection;
            resolve(connection);
        }).catch(error => reject(error));
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