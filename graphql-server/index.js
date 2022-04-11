const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');
const isEmail = require('isemail');
const jwt = require("jsonwebtoken");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  scalar Date

  type User{
    user_id: ID
    email: String! 
    password: String!
    username: String
    firstname: String!
    lastname: String!
    type: String!   #use a scalar here or something....      
  }

  type Listing{
    listing_id: ID 
    listing_title:String
    description:String
    street: String
    city: String
    postal_code: String
    price: Float
    user: User   
  }

  type Booking{
    listing_id: Listing
    booking_id: ID
    booking_date:Date
    booking_start:Date
    booking_end:Date
    user: User
  }

  type Query {
    users: [User]
    user(user_id:ID!): User
    user_email(email:String!): User
    user_username(username:String!): User

    listings: [Listing]
    listing(listing_id:ID!):Listing

    bookings: [Booking]
    booking(booking_id:ID!):Booking
    booking_by_listing(listing_id:Listing):[Booking]

  }

  type Mutation {
    signup(email: String!, password: String!, username: String!, firstname:String!,lastname:String!,type:String!): User
    signin(email: String!, password: String!): AuthPayload
    #updateaccount(user_id:ID!, email: String!, password: String!, username: String!, firstname:String!,lastname:String!,type:String!): User
    #deleteaccount(user_id:ID!):Boolean!

    createlisting(listing_title:String!, description:String!, street: String, city: String!, postal_code: String!, price: Float!): Listing
    #updatelisting(listing_id:ID!, listing_title:String!, description:String!, street: String, city: String!, postal_code: String!, price: Float!): Listing
    #deletelisting(listing_id:ID!):Boolean!

    createbooking(booking_date:Date!, booking_start:Date!, booking_end:Date!): Booking
    #updatebooking(booking_id:ID!, booking_date:Date!, booking_start:Date!, booking_end:Date!):Booking
    #deletebooking(booking_id:ID!):Boolean!
    
  }
  #Might remove or change or something.
  type AuthPayload {
    token: String!
    user_id: String!
    type:String!
  }
`;

class User {
  constructor(user_id, {email,password,username,firstname,lastname,type}) {
    this.user_id = user_id;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.type=type;
  }
}

class AuthPayload {
  constructor(token,user_id,type){
    this.token=token;
    this.user_id=user_id;
    this.type=type;
  }
}

class Listing {
  constructor(listing_id,{listing_title,description,street,city,postal_code,price},user){
    this.listing_id=listing_id;
    this.listing_title=listing_title;
    this.description=description;
    this.street=street;
    this.city=city;
    this.postal_code=postal_code;
    this.price=price;
    this.user = new User(user);
  }
}

class Booking{
  constructor(listing_id,booking_id,{booking_date,booking_start,booking_end},user){
    this.listing_id = new Listing(listing_id);
    this.booking_id=booking_id;
    this.booking_date=booking_date;
    this.booking_start = booking_start;
    this.booking_end = booking_end;
    this.user = new User (user);
  }
}

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});


const users = [
  {
    user_id:'Uf4b043ce6508e80f6f5b',
    email: 'p@p.com',
    password: 'test123',
    username: 'pritamworld', 
    firstname:'Pritesh', 
    lastname: 'Patel',   
    type:'admin'
  }
];

const listings =[
  { 
    listing_id:'Lf4b043ce6508e80f6f5b',
    listing_title:'Sea face home for rent',
    description:'max 1000-character description',
    street: '171 Young Street',
    city: 'Toronto',
    postal_code: 'M1X0Y5',
    price: 150.00,
    user: users[0],
  }
];

const bookings =[
  { 
    listing_id:listings[0],
    booking_id:'Bf4b043ce6508e80f6f5b',
    booking_date:'01-24-2022',
    booking_start:'01-25-2022',
    booking_end:'01-30-2022"',
    user:users[0]
  }
];
const authPayload = [];

const resolvers = {
  Date: dateScalar,  
  Query: {
    user(parent, args, context, info) {
      return users.find(user => user.user_id === args.user_id);
    },
    users(){
      return users;
    },
    user_username(parent, args, context, info) {
      return users.find(user => user.username === args.username);
    },
    user_email(parent, args, context, info) {
      return users.find(user => user.email === args.email);
    },

    booking(parent, args, context, info){
      return  bookings.find(booking => booking.booking_id === args.booking_id);
    },
    bookings(){
      return bookings;
    },
    booking_by_listing(parent, args, context, info){
      return  bookings.find(booking => booking.listing_id.listing_id === args.listing_id.listing_id);
    },
    
    listing(parent, args, context, info){
      return  listings.find(listing => listing.listing_id === args.listing_id);
    },
    listings(){
      return listings;
    }
  },
  Mutation:{
    signin(parent, { email, password }) {
      const { user_id,type } = users.find(
        account => account.email === email && account.password === password
      );
      return authPayload[authPayload.length-1] = new AuthPayload (jwt.sign(
        { "Token": { user_id, type } },
        "f1BtnWgD3VKY",
        { algorithm: "HS256", subject: user_id, expiresIn: "1d" }
      ),user_id,type);
    },
    signup: async(parent, args, context, info) => {
      var id = `U${require('crypto').randomBytes(10).toString('hex')}`;
      users[users.length] = new User(id, args);
      return users[users.length-1];

    },
    //createListing: async(parent, args, context, info) => {
    //  var id = `l${require('crypto').randomBytes(10).toString('dec')}`;
      //missing a few steps here.
   //   return listing;
   // }
  }
};


const server = new ApolloServer({ context: async ({ req }) => {
  // simple auth check on every request
  const auth = req.headers && req.headers.authorization || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');

  if (!isEmail.validate(email)) return { user: null };

  // find a user by their email
  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] || null;

  return { user: { ...user.dataValues } };
  
},typeDefs, resolvers});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
